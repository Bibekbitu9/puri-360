# Chrome MCP Testing Strategy

This document provides the exact task prompts for an AI agent to automatically test the Location Tracker application using the `chrome-devtools-mcp` tools. 

To run these tests, instruct the AI to execute these scenarios.

## Scenario 1: Permission Granted

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Take a screenshot to verify the initial state.
3. Emulate a geolocation position using `evaluate_script`:
   `navigator.geolocation.getCurrentPosition = (success) => success({ coords: { latitude: 40.7128, longitude: -74.0060, accuracy: 10 }, timestamp: Date.now() })`
4. Click the element with the aria-label "Share My Location".
5. Wait for the success UI to render.
6. Verify the page contains "Latitude", "Longitude", and the values "40.712800" and "-74.006000".
7. Take a screenshot.
```

## Scenario 2: Permission Denied

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Emulate a geolocation permission denied error using `evaluate_script`:
   `navigator.geolocation.getCurrentPosition = (_, error) => error({ code: 1, PERMISSION_DENIED: 1 })`
3. Click the "Share My Location" button.
4. Verify the page displays "Permission to access location was denied".
5. Verify the "Try Again" button is present.
6. Take a screenshot.
```

## Scenario 3: Location Unavailable

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Emulate a geolocation position unavailable error using `evaluate_script`:
   `navigator.geolocation.getCurrentPosition = (_, error) => error({ code: 2, POSITION_UNAVAILABLE: 2 })`
3. Click the "Share My Location" button.
4. Verify the page displays "Location information is unavailable".
5. Take a screenshot.
```

## Scenario 4: Timeout

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Emulate a geolocation timeout error using `evaluate_script`:
   `navigator.geolocation.getCurrentPosition = (_, error) => error({ code: 3, TIMEOUT: 3 })`
3. Click the "Share My Location" button.
4. Verify the page displays "The request to get user location timed out".
5. Take a screenshot.
```

## Scenario 5: Copy Functionality

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Emulate a successful geolocation response.
3. Click "Share My Location".
4. Click the "Copy Latitude" button.
5. Use `evaluate_script` to read the clipboard contents: `navigator.clipboard.readText()`
6. Verify the clipboard contains the correct latitude.
```

## Scenario 6: Refresh Location

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Emulate a successful geolocation response with specific coordinates.
3. Click "Share My Location".
4. Update the emulated coordinates to different values.
5. Click "Refresh Location".
6. Verify the UI updates to the new coordinates.
```

## Scenario 7: Responsive Testing

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Use the `emulate` tool to set the viewport width to 375px (Mobile). Take a screenshot.
3. Use the `emulate` tool to set the viewport width to 768px (Tablet). Take a screenshot.
4. Use the `emulate` tool to set the viewport width to 1440px (Desktop). Take a screenshot.
```

## Scenario 8: Theme Toggle

```text
Using chrome-devtools-mcp:
1. Navigate to "http://localhost:5173"
2. Click the element with aria-label "Toggle theme".
3. Use `evaluate_script` to check if `document.documentElement.getAttribute('data-theme')` is 'dark'.
4. Take a screenshot to verify dark mode styling.
5. Click the toggle again and verify the theme reverts to light.
```
