# LudoMaster Frontend Features

- Authentication (email/mobile + password) with validation and error feedback
- Profile management and avatar URL
- Room listing, creation (public/private), join/leave
- Real-time game and chat with WebSockets
- Leaderboards, statistics, match history via REST
- Responsive, accessible UI (keyboard, screen readers, live regions)

Environment:
- REACT_APP_API_BASE_URL: REST API base URL
- REACT_APP_WS_URL: WebSocket base URL
- REACT_APP_SITE_URL: Site URL for backend email redirects (if used)

This app uses:
- React Router v6
- Zustand for state
- socket.io-client for WebSockets
- Basic CSS (no heavy UI library)
