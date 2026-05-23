# Hacker News Feed

A React Native Hacker News reader built with TypeScript, FlashList, Zustand, MMKV, TanStack Query, and NativeWind. The app focuses on a fast feed, optimistic save/like actions, and a dedicated saved reels screen.

## Run Locally

1. Install dependencies.

   ```sh
   npm install
   ```

2. Start Metro.

   ```sh
   npm start
   ```

3. Run the Android app in a second terminal.

   ```sh
   npm run android
   ```

If Metro complains about port 8081, stop the process using that port and restart it with `npm start -- --reset-cache`.

## Tested Platforms

I tested the project on Android in the current Windows development environment. The app starts with `npx react-native run-android`, and the Jest smoke test also passes locally.

## Architectural Decisions

### FlashList for feed rendering
I used **FlashList** instead of `FlatList` because the feed is infinite and scroll-heavy. FlashList recycles views more efficiently, which gives better memory usage and smoother scrolling than a plain `FlatList`.

### TanStack Query for feed fetching
The feed is loaded with **`useInfiniteQuery`** so pagination, caching, refetching, and loading states stay isolated from the UI. That keeps the feed screen focused on rendering and interaction.

### Zustand + MMKV for saved state
Saved and liked stories are managed in **Zustand** and persisted with **MMKV**. This is faster than AsyncStorage and makes saved items available immediately on app launch.

### Persisted saved-story snapshots
Saved reels need more than just IDs, so I store full saved story snapshots in the app state. That allows the saved reels screen to render items and unsave them without needing the live feed to be present at the same moment.

### Screen switching without a routing dependency
I kept the feed and saved reels views in a simple animated app shell rather than adding a full navigation library. That reduced complexity for a two-screen flow and let me control the left/right transition direction directly.

### Optimistic actions with rollback
Likes and saves update immediately in the UI, then a mock API call runs with a small delay and a failure rate. If it fails, the store rolls back the change and shows a toast so the interaction still feels responsive.

## What I Would Add With More Time

- Add offline feed caching so the app can open even without the network.
- Add a real navigation stack or bottom tabs if the app grows beyond two screens.
- Add unit tests for the saved-story store and optimistic rollback flow.
- Add Detox or another end-to-end test layer for pull-to-refresh and screen switching.

## AI Assistance And Verification

AI assistance was used for the initial NativeWind setup, the optimistic action flow, and parts of the screen/layout implementation. I verified the output by:

- Running `npm test -- --runInBand` and confirming the Jest smoke test passed.
- Running `npx react-native run-android` successfully on Android.
- Checking TypeScript/problem output after edits to catch compile issues such as invalid styles or gesture-handler changes.

## Notes

- Pull-to-refresh is handled on the feed screen.
- Saved reels are persisted locally and can be unsaved from the saved screen.
