# Software Vala - Low-Bandwidth Architecture

## Overview
Complete offline-first, low-bandwidth optimized architecture for 2G networks and budget devices.

## APK Optimization Checklist
- [ ] Target APK size: <12MB
- [ ] Enable ProGuard/R8 minification
- [ ] Use WebP images (<80KB each)
- [ ] Lazy load all screens
- [ ] Tree-shake unused code
- [ ] Enable Brotli/GZIP compression
- [ ] Use SVG for icons

## Architecture Components

### 1. Network Detection (`src/lib/network/network-detector.ts`)
- Auto-detects 2G/3G/4G/WiFi
- Measures actual RTT and bandwidth
- Triggers adaptive UI modes

### 2. Lightweight API Client (`src/lib/network/api-client.ts`)
- Request deduplication
- Automatic retry with exponential backoff
- Response caching
- Offline queue for mutations

### 3. Offline Storage (`src/lib/offline/`)
- **IndexedDB**: Local database for all data
- **Cache Manager**: TTL-based response caching
- **Sync Queue**: Queues actions when offline
- **Chat Queue**: Offline message queuing
- **Draft Manager**: Auto-saves form data

### 4. Service Worker (`public/sw.js`)
- Precaches static assets
- Network-first for HTML
- Stale-while-revalidate for APIs
- Background sync support

## API Payload Guidelines
```json
{
  "maxPayloadSize": "50KB",
  "compression": "gzip",
  "pagination": { "defaultLimit": 20, "maxLimit": 50 },
  "fields": "minimal by default, expand on request"
}
```

## Performance Targets
| Metric | Target |
|--------|--------|
| Dashboard load (2G) | <3s |
| Memory usage | <120MB |
| CPU usage | <20% |
| TTI on budget phone | <5s |

## Low-Data Mode Features
- Disables animations
- Uses low-res images
- Text-first UI
- Reduced API polling
- Skeleton loading

## Cache Strategy
1. **Static Assets**: Cache-first, 30-day TTL
2. **API Responses**: Stale-while-revalidate, 5-min TTL
3. **User Data**: IndexedDB with sync
4. **Max Cache Size**: 50MB

## Device Compatibility
- Android 5.0+ (API 21)
- 1GB RAM minimum
- 2G/EDGE networks
- Chrome 60+, Firefox 55+
