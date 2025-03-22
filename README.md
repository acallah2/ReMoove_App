# ReMoove - Smart Waste Management App

A mobile application built with Expo/React Native for monitoring and controlling automated waste sorting systems.

## Overview

ReMoove provides a comprehensive interface for managing smart trash cans, featuring real-time monitoring, manual controls, and usage analytics.

### Key Features

- Real-time trash can monitoring
- Fill level tracking for multiple waste categories
- Interactive sorting history graphs
- Manual sorting controls
- Alert system for maintenance and issues
- WebSocket integration for live updates

## Technology Stack

- **Frontend Framework**: Expo/React Native
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (TailwindCSS)
- **State Management**: React Hooks
- **Data Visualization**: react-native-chart-kit
- **API Integration**: Axios
- **Real-time Updates**: WebSocket
- **Storage**: AsyncStorage

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ReMoove_App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## Development

### Project Structure

```
ReMoove_App/
├── app/
│   ├── (tabs)/
│   │   ├── home/
│   │   ├── alerts/
│   │   └── settings/
│   └── utils/
├── components/
├── assets/
└── constants/
```

### Key Components

- `home/`: Main dashboard and trash can list
- `alerts/`: Real-time notifications and alerts
- `settings/`: App configuration and user preferences
- `utils/api.tsx`: API integration and WebSocket handling

## API Integration

The app connects to several AWS API Gateway endpoints:

- Status updates
- Manual controls
- Historical data
- Alert management

## Customization

### Theme Configuration

The app uses a custom theme defined in `tailwind.config.js`, featuring UC Davis brand colors:

- UC Davis Blue (`#022851`)
- UC Davis Gold (`#FDB927`)
- Supporting colors for status indicators

## Building for Production

1. Configure app.json:
   ```json
   {
     "expo": {
       "name": "ReMoove",
       "slug": "ReMoove",
       "version": "1.0.0"
     }
   }
   ```

2. Build for platforms:
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request
