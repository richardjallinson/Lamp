import SwiftUI
import WebKit
import StoreKit
import UIKit

/// Shows www/index.html and handles messages the game sends with
/// `window.webkit.messageHandlers.lamp.postMessage({type: ...})`.
struct LampWebView: UIViewRepresentable {
    @ObservedObject var purchases: Purchases

    func makeCoordinator() -> Coordinator { Coordinator(purchases: purchases) }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsInlineMediaPlayback = true
        let controller = WKUserContentController()
        let coordinator = context.coordinator
        controller.add(MessageRelay { [weak coordinator] body in coordinator?.handle(body) }, name: "lamp")
        config.userContentController = controller

        let web = WKWebView(frame: .zero, configuration: config)
        web.isOpaque = false
        web.backgroundColor = UIColor(red: 11 / 255, green: 19 / 255, blue: 40 / 255, alpha: 1)
        web.scrollView.backgroundColor = web.backgroundColor
        web.scrollView.bounces = false
        web.scrollView.isScrollEnabled = false          // the page scrolls its own lists
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.allowsLinkPreview = false
        if #available(iOS 16.4, *) { web.isInspectable = true } // Safari > Develop, for debugging builds

        context.coordinator.webView = web
        purchases.onChange = { [weak coordinator = context.coordinator] in coordinator?.sendEntitlement() }

        if let index = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
            web.loadFileURL(index, allowingReadAccessTo: index.deletingLastPathComponent())
        }
        return web
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    // MARK: - Coordinator: the bridge between the game and iOS

    final class Coordinator: NSObject {
        weak var webView: WKWebView?
        let purchases: Purchases
        private let cloud = CloudState()

        init(purchases: Purchases) {
            self.purchases = purchases
            super.init()
            cloud.onRemoteChange = { [weak self] json in self?.send(["type": "cloudState", "state": json]) }
        }

        func handle(_ body: [String: Any]) {
            guard let type = body["type"] as? String else { return }
            switch type {
            case "ready":
                // Give the page the newest saved copy (this iPhone's or iCloud's); the page merges it.
                if let json = cloud.load() { send(["type": "cloudState", "state": json]) }
                Task {
                    await purchases.refresh()
                    if let price = purchases.displayPrice { self.send(["type": "price", "price": price]) }
                    self.sendEntitlement()
                }
            case "save":
                if let json = body["state"] as? String { cloud.save(json) }
            case "reset":
                break // the page saves the cleared state straight after
            case "haptic":
                let style = body["style"] as? String ?? "light"
                DispatchQueue.main.async { self.haptic(style) }
            case "share":
                let text = body["text"] as? String ?? ""
                DispatchQueue.main.async { self.share(text) }
            case "review":
                DispatchQueue.main.async { self.requestReview() }
            case "purchase":
                Task {
                    let result = await purchases.buy()
                    self.send(["type": "purchaseResult", "ok": result.ok, "message": result.message ?? ""])
                }
            case "restore":
                Task {
                    let ok = await purchases.restore()
                    self.send(["type": "purchaseResult", "ok": ok,
                               "message": ok ? "" : "No earlier purchase was found for this Apple ID."])
                }
            default:
                break
            }
        }

        func sendEntitlement() {
            send(["type": "entitlement", "unlocked": purchases.unlocked])
        }

        /// Calls window.Lamp.fromNative({...}) in the page.
        func send(_ message: [String: Any]) {
            guard let data = try? JSONSerialization.data(withJSONObject: message),
                  let json = String(data: data, encoding: .utf8) else { return }
            DispatchQueue.main.async { [weak self] in
                self?.webView?.evaluateJavaScript("window.Lamp && Lamp.fromNative && Lamp.fromNative(\(json))")
            }
        }

        private func haptic(_ style: String) {
            switch style {
            case "success": UINotificationFeedbackGenerator().notificationOccurred(.success)
            case "error": UINotificationFeedbackGenerator().notificationOccurred(.warning)
            default: UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }
        }

        private func share(_ text: String) {
            guard let web = webView, !text.isEmpty else { return }
            let sheet = UIActivityViewController(activityItems: [text], applicationActivities: nil)
            sheet.popoverPresentationController?.sourceView = web
            sheet.popoverPresentationController?.sourceRect = CGRect(x: web.bounds.midX, y: web.bounds.maxY - 80, width: 1, height: 1)
            web.window?.rootViewController?.topMost.present(sheet, animated: true)
        }

        private func requestReview() {
            if let scene = webView?.window?.windowScene {
                SKStoreReviewController.requestReview(in: scene)
            }
        }
    }
}

/// Receives the game's messages and passes them on. Holding the coordinator weakly
/// avoids a retain cycle with WKUserContentController.
private final class MessageRelay: NSObject, WKScriptMessageHandler {
    let onMessage: ([String: Any]) -> Void
    init(_ onMessage: @escaping ([String: Any]) -> Void) { self.onMessage = onMessage }
    func userContentController(_ c: WKUserContentController, didReceive m: WKScriptMessage) {
        if let body = m.body as? [String: Any] { onMessage(body) }
    }
}

private extension UIViewController {
    var topMost: UIViewController { presentedViewController?.topMost ?? self }
}

/// Keeps a copy of the game's progress on this iPhone (UserDefaults) and in the
/// user's own iCloud (key-value storage), so it survives reinstalling and follows
/// them to a new iPhone. Nothing is sent anywhere else.
final class CloudState {
    private let key = "lamp-state-v1"
    private let store = NSUbiquitousKeyValueStore.default
    var onRemoteChange: ((String) -> Void)?

    init() {
        NotificationCenter.default.addObserver(
            self, selector: #selector(remoteChanged(_:)),
            name: NSUbiquitousKeyValueStore.didChangeExternallyNotification, object: store)
        store.synchronize()
    }

    /// The newer of the local and iCloud copies (each carries its own savedAt time).
    func load() -> String? {
        let local = UserDefaults.standard.string(forKey: key)
        let remote = store.string(forKey: key)
        switch (local, remote) {
        case let (l?, r?): return savedAt(r) > savedAt(l) ? r : l
        case let (l?, nil): return l
        case let (nil, r?): return r
        default: return nil
        }
    }

    func save(_ json: String) {
        UserDefaults.standard.set(json, forKey: key)
        store.set(json, forKey: key)
    }

    @objc private func remoteChanged(_ note: Notification) {
        if let json = store.string(forKey: key) { onRemoteChange?(json) }
    }

    private func savedAt(_ json: String) -> Double {
        guard let data = json.data(using: .utf8),
              let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return 0 }
        return (obj["savedAt"] as? Double) ?? 0
    }
}
