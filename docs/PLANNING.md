# Daytripper - Planning & Architecture

## Overview
Daytripper is a Sydney train trip management app built with a React Native frontend and a Node.js backend. It features a high-performance caching layer to handle massive Sydney GTFS data efficiently.

## Architecture

### Frontend (React Native)
- **Framework:** React Native (TypeScript).
- **State Management:** 
    - **TanStack Query:** Caches API responses from the backend, handles revalidation and offline states.
    - **Zustand:** Manages local UI state, user preferences, and temporary folder views.
- **Persistence:** `react-native-mmkv` for lightning-fast local storage of saved trips and folders.
- **Navigation:** React Navigation (Native Stack + Bottom Tabs).
- **Maps:** `react-native-maps` for visual station selection.

### Backend (Node.js Proxy)
- **Runtime:** Node.js with TypeScript.
- **API Framework:** Express or Fastify.
- **Task:** 
    1. Securely communicates with TfNSW using `TOD_TOKEN`.
    2. Decodes binary GTFS-Realtime (ProtoBuf) into lightweight JSON.
    3. Filters massive static datasets so the mobile app only downloads what it needs.
- **Caching Layer:**
    - **Redis:** Stores "Hot" real-time data (Trip Updates) with a 30s TTL.
    - **SQLite:** Stores "Cold" static data (Stations, Routes, Timetables) for complex relational queries.

---

## Subsystems

### 1. Backend: Transit Data Engine
- **Static Ingestor:** Downloads the TfNSW static zip weekly, parses CSVs, and populates SQLite.
- **Real-time Decoder:** Polls TfNSW feeds, decodes using `gtfs-realtime-bindings`, and caches in Redis.
- **API Endpoints:**
    - `GET /stations`: Search stations (SQLite).
    - `GET /trips/live`: Get live ETAs for a set of IDs (Redis + Logic).

### 2. Frontend: Trip Management
- **Folder Logic:** User-defined groups (Commute, Weekend).
- **Sorting Engine:** Custom drag-and-drop or "Smart Sort" by next departure.
- **Map Picker:** Interface to drop a pin and find the nearest train stations.

### 3. Real-time Tracker (Hybrid)
- **Client:** Uses TanStack Query to poll the backend every 15-30s when the app is active.
- **Background:** (Optional) Uses `react-native-background-fetch` to update ETAs for high-priority trips.

---

## Implementation Plan

### Phase 1: Scaffolding (Backend & Frontend)
- [ ] Initialize React Native project (Done).
- [ ] Initialize Node.js backend project.
- [ ] Setup `API.md` and `.env` sharing (Done).

### Phase 2: Backend Development (Data Layer)
- [ ] Implement SQLite schema for Static GTFS.
- [ ] Create script to download/parse TfNSW Static bundle.
- [ ] Implement GTFS-Realtime fetcher + Redis cache.
- [ ] Expose `GET /stations` and `GET /live-updates`.

### Phase 3: Frontend Development (UI)
- [ ] Setup Navigation and basic Screens (Home, Map, Trips).
- [ ] Connect TanStack Query to Backend endpoints.
- [ ] Implement Folder/Trip CRUD and local storage.

### Phase 4: Map & Real-time Integration
- [ ] Integrate MapView with station markers.
- [ ] Connect "Trip Cards" to live ETA updates from the backend.
- [ ] Implement "Smart Sort" logic in the UI.

### Phase 5: Refinement
- [ ] Add "Home Station" shortcuts.
- [ ] Implement background notifications for delayed trains.
- [ ] Visual polish (animations, splash screen).

---

## Technical Risks
- **Memory Usage:** SQLite on the server must be indexed correctly to handle station searches quickly.
- **Data Latency:** Ensure the "Decode -> Cache -> Serve" loop happens in under 500ms to keep ETAs feeling live.
- **Battery:** Mobile polling frequency must be tuned to avoid draining battery.
