import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.60a74dfa5c5348bdb711c4f1a1cc9bf5',
  appName: 'softwarewalanet',
  webDir: 'dist',
  
  // Live URL - APK always loads latest version from web
  server: {
    url: 'https://60a74dfa-5c53-48bd-b711-c4f1a1cc9bf5.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    allowNavigation: ['*'],
    errorPath: '/offline.html'
  },
  
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#1a1a2e',
    buildOptions: {
      releaseType: 'APK'
    },
    useLegacyBridge: false,
    // Security: Disable screenshots in sensitive areas
    appendUserAgent: 'SoftwareVala-Mobile/1.0'
  },
  
  ios: {
    backgroundColor: '#1a1a2e',
    contentInset: 'automatic',
    scheme: 'SoftwareVala'
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1a1a2e',
      showSpinner: true,
      spinnerColor: '#8b5cf6',
      androidSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: true,
      launchAutoHide: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e'
    },
    // Haptics for button feedback
    Haptics: {
      impactStyle: 'light'
    }
  }
};

export default config;
