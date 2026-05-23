# Hacker News Feed

A modern, high-performance Hacker News feed built with React Native, Bare CLI, TypeScript, and Nativewind. Designed for speed, smooth scrolling, and optimistic UX.

## 🚀 Quick Start (Run Instructions)

1. **Install Dependencies**
   ```sh
   npm install
   ```

2. **Start Metro Bundler**
   ```sh
   npm start
   ```

3. **Run on Android** (In a new terminal window)
   ```sh
   npm run android
   ```
   *Note: If you run into Metro port conflicts, use `npm run android --no-packager` while Metro is running.*

## 🏗️ Architectural Trade-offs & Decisions

### 1. List Rendering: FlashList vs FlatList
I chose **Shopify's FlashList** over the standard `FlatList`. FlashList recycles views under the hood (similar to RecyclerView on Android), which provides a buttery smooth infinite feed even at scale. It significantly outperforms `FlatList` in memory usage and frame rates, which is crucial for an infinite scrolling app.

### 2. Local Persistence: MMKV vs AsyncStorage
For saving state locally, I used **react-native-mmkv**. It is a synchronous, high-performance C++ key-value store that is vastly faster than `AsyncStorage`. This ensures that loading saved stories is instantaneous and doesn't block the UI thread.

### 3. State Management & Data Fetching
- **TanStack Query (React Query)**: Handles the Algolia API fetching, infinite scrolling (`useInfiniteQuery`), caching, and provides a clean foundation for our network layer.
- **Zustand + MMKV**: Manages the global state for "Liked" and "Saved" stories. Zustand provides a minimalistic, clean API, and hooking it up with MMKV ensures our optimistic UI state is persisted instantly.

### 4. Optimistic UI & Error Rollbacks
When a user "Likes" or "Saves" a story, the UI updates **instantly** via Zustand. 
Simultaneously, a mock API request fires with a 300-800ms delay and a 15% failure rate. If the request fails, the state manager gracefully rolls back the UI to its previous state and alerts the user via a non-blocking `react-native-toast-message`.

## 🎨 UI & UX Design
The app leverages **Nativewind** to bring Tailwind CSS to React Native.
- **Aesthetic**: Minimalist and modern with a clean brand-orange identity.
- **Micro-interactions**: Uses floating headers, pill badges, and distinct active states.
- **Edge Cases Handling**: Stories from "Ask HN" that return `null` for URLs are handled gracefully. Instead of a broken webview, they open a custom modal displaying the `story_text`.

## 🤖 AI Usage
AI assistance was used during the development of this project. Specifically:
- **Mock Function & Scaffold**: AI helped scaffold the initial Nativewind setup (v4 configuration) and generate the simulated delay/failure mock function (`mockToggleAction`). The 15% failure rate was subsequently verified by logging the randomized outcomes.
- **UI Tweaks**: AI was used to migrate generic React Native `StyleSheet` objects into responsive Tailwind utility classes via Nativewind.

## 🔮 Future Improvements
Given more time, I would focus on:
- **Testing**: Adding comprehensive E2E tests using Detox and unit tests with Jest to guarantee the stability of the optimistic rollback logic.
- **Offline Support**: Caching the actual feed data (not just liked/saved IDs) so the app is fully functional offline.
- **iOS Polish**: While the logic is cross-platform, I would dedicate time to fine-tune iOS-specific UI nuances (e.g., specific safe area insets and shadow rendering).
