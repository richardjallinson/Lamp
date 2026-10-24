import SwiftUI

/// Lamp: Bible Word Puzzle.
/// The game itself is the web app in the `www` folder; this shell shows it full screen
/// and adds what only iOS can do: iCloud sync, the one-time purchase, haptics, sharing
/// and the App Store rating prompt.
@main
struct LampApp: App {
    @StateObject private var purchases = Purchases()

    var body: some Scene {
        WindowGroup {
            LampWebView(purchases: purchases)
                .ignoresSafeArea()
                .background(Color(red: 11 / 255, green: 19 / 255, blue: 40 / 255))
                .preferredColorScheme(.dark)
                .statusBarHidden(false)
        }
    }
}
