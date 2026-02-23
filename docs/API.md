# TfNSW API Reference - Daytripper

This document outlines the verified endpoints and authentication methods for accessing Sydney transport data.

## Authentication

TfNSW Open Data APIs require an API Key (stored in `.env` as `TOD_TOKEN`).

- **Header:** `Authorization`
- **Format:** `apikey <TOKEN>`

**Note:** The prefix must be `apikey` (lowercase) followed by a space and your token.

## Endpoints

### 1. Sydney Trains Realtime (GTFS-R)
Returns real-time trip updates and vehicle positions in binary Protocol Buffer format.

- **URL:** `https://api.transport.nsw.gov.au/v2/gtfs/realtime/sydneytrains`
- **Method:** `GET`
- **Response Type:** `application/x-google-protobuf`

### 2. Static GTFS Data (Timetables)
Requires downloading the full bundle for station names and scheduled stops.

- **URL:** `https://api.transport.nsw.gov.au/v1/gtfs/schedule/sydneytrains`
- **Method:** `GET`
- **Response Type:** `application/zip`

## Example Usage (CLI)

To test the real-time feed and save it to a file:

```bash
curl -H "Authorization: apikey YOUR_TOKEN_HERE" 
     https://api.transport.nsw.gov.au/v2/gtfs/realtime/sydneytrains 
     -o sydneytrains.pb
```

## Implementation Notes
- **ProtoBuf Decoding:** Use the `gtfs-realtime-bindings` npm package.
- **Caching:** Static GTFS data should be cached locally and updated weekly.
- **Rate Limits:** Monitor headers for `X-RateLimit-Limit` and `X-RateLimit-Remaining`.
