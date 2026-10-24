import Foundation
import StoreKit

/// The single one-time purchase that unlocks Joshua to Revelation (StoreKit 2).
/// Genesis to Deuteronomy are always free.
final class Purchases: ObservableObject {
    /// Must match the non-consumable In-App Purchase created in App Store Connect.
    static let productID = "com.richardallinson.Lamp.fullbible"

    @Published private(set) var unlocked = false
    private(set) var product: Product?
    var onChange: (() -> Void)?
    private var updates: Task<Void, Never>?

    var displayPrice: String? { product?.displayPrice }

    init() {
        updates = Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let transaction) = result {
                    await transaction.finish()
                    await self?.refresh()
                }
            }
        }
    }

    deinit { updates?.cancel() }

    /// Loads the product (for its local price) and checks what this Apple ID owns.
    func refresh() async {
        if product == nil {
            product = try? await Product.products(for: [Self.productID]).first
        }
        var owns = false
        for await result in Transaction.currentEntitlements {
            if case .verified(let t) = result, t.productID == Self.productID, t.revocationDate == nil {
                owns = true
            }
        }
        let isOwned = owns
        await MainActor.run {
            if isOwned != self.unlocked { self.unlocked = isOwned }
            self.onChange?()
        }
    }

    func buy() async -> (ok: Bool, message: String?) {
        if product == nil { await refresh() }
        guard let product else { return (false, "The App Store isn’t available right now. Please try again later.") }
        do {
            switch try await product.purchase() {
            case .success(let verification):
                guard case .verified(let transaction) = verification else {
                    return (false, "The purchase couldn’t be verified.")
                }
                await transaction.finish()
                await refresh()
                return (true, nil)
            case .userCancelled:
                return (false, nil)
            case .pending:
                return (false, "Your purchase is waiting for approval. It will unlock as soon as it’s approved.")
            @unknown default:
                return (false, nil)
            }
        } catch {
            return (false, "The purchase didn’t go through. Please try again.")
        }
    }

    func restore() async -> Bool {
        try? await AppStore.sync()
        await refresh()
        return unlocked
    }
}
