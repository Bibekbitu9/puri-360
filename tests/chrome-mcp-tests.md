# Chrome MCP Test Suite: GIS Navigator

## Environment
- Vite React + TypeScript
- Google Chrome DevTools MCP

## Scenarios Validated

### Scenario 1: User grants permission
**Action:** Mocked successful Geolocation coordinate return.
**Result:** Successfully displays coordinates.

### Scenario 2: Multiple panorama nodes & Location Change
**Action:** Simulated coordinates for "Badabil Cave Entrance" and "Ambjohlkhol Outlook".
**Result:** Algorithm correctly utilized the Haversine formula to sort distances and snap to the nearest virtual tour node. Distance rendered dynamically.

### Scenario 3: Pano2VR Viewer Loaded
**Action:** Clicked "Open Panorama Viewer".
**Result:** The application successfully launched the embedded `PanoViewer.tsx` component via `iframe`. The `src` securely points to the correct node ID in the Pano2VR `west_odisha_cave_test` tour.

### Scenario 4: Mobile Responsiveness
**Action:** Analyzed UI rendering in standard viewport.
**Result:** Premium Stitch UI dashboard adapts cleanly, displaying full-width cards and accessible touch targets for mobile.
