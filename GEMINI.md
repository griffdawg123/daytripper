# GEMINI.md - Daytripper Context

## Project Mission
Build a high-quality, cross-platform Sydney train trip management app with a robust backend proxy for TfNSW data.

## Project Structure
- **/frontend**: React Native (TypeScript) mobile application.
- **/backend**: Node.js (TypeScript) proxy server with Redis and SQLite caching.
- **/docs**: Requirements, Architecture (PLANNING.md), and API documentation.

## Architecture Highlights
- **Backend:** 
    - Handles TfNSW API auth and binary ProtoBuf decoding.
    - Caches real-time data in **Redis** (30s TTL).
    - Stores static timetable data in **SQLite**.
- **Frontend:** 
    - Uses **TanStack Query** to fetch and cache data from our backend.
    - Uses **MMKV** for persistent user trips and folders.

## Verified API Call (Backend)
- **Header:** `Authorization: apikey <TOD_TOKEN>`
- **Endpoint:** `https://api.transport.nsw.gov.au/v2/gtfs/realtime/sydneytrains`

## Coding Standards
- Functional components & hooks in React Native.
- Strict TypeScript interfaces for all transit models.
- Shared `.env` in the root (backend and frontend should access what they need).

## Current Focus
Developing the Backend's static GTFS ingestor and real-time proxy endpoints.
