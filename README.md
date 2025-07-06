# 🕐 Interactive Clock

A beautiful, interactive analog clock built with React, TypeScript, and Next.js. You can drag the clock hands to set any time, with full mobile optimization, theme support, and gesture controls.

## 🌟 Features

### 🎮 Interactive Features
- **Interactive Analog Clock**: Drag the red hour hand and blue minute hand to set time
- **Digital Display**: Shows time in both analog and digital formats with edit mode
- **12/24 Hour Formats**: Toggle between 12-hour (AM/PM) and 24-hour formats
- **Theme System**: 5 beautiful themes (Warm, Cool, Nature, Elegant, Cute)

### 📱 Mobile Optimizations
- **Touch-Optimized**: Enhanced touch targets and sensitivity
- **Swipe Gestures**: Left/right to change themes, up to toggle time format
- **Haptic Feedback**: Vibration feedback on mobile devices
- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop
- **Landscape Mode**: Special layout adjustments for landscape orientation

### 🌍 Accessibility & Localization
- **Multilingual Support**: Automatically detects browser language (English/Japanese)
- **Screen Reader Support**: ARIA labels and semantic markup
- **Keyboard Navigation**: Full keyboard accessibility

### ✨ Visual Design
- **Modern UI**: Glassmorphic effects and smooth animations
- **Visual Feedback**: Drag indicators and hover effects
- **Cross-Platform**: Consistent experience across all devices

## 🚀 Live Demo

Visit the live demo at: [https://luckpoint.github.io/v0-interactive-clock/](https://luckpoint.github.io/v0-interactive-clock/)

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/luckpoint/v0-interactive-clock.git
cd v0-interactive-clock

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Building for Production

```bash
# Build the project
pnpm run build
```

## 🌐 Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy your app
3. Your app will be available at `https://luckpoint.github.io/v0-interactive-clock/`

### GitHub Repository Settings

Make sure to enable GitHub Pages in your repository settings:

1. Go to **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Your site will be available at `https://luckpoint.github.io/v0-interactive-clock/`

## 🎯 Usage

### 🖱️ Desktop Controls
1. **Set Time**: Drag the red (hour) or blue (minute) hands to set your desired time
2. **Toggle Format**: Click the time format button to switch between 12-hour and 24-hour formats
3. **Change Themes**: Click theme buttons to switch between different color schemes
4. **Edit Digital Time**: Double-click the digital display to edit time directly
5. **Reset**: Click the reset button to set the time back to the current time

### 📱 Mobile Controls
1. **Touch & Drag**: Touch and drag clock hands to set time
2. **Swipe Gestures**:
   - **Left/Right**: Change themes
   - **Up**: Toggle time format
3. **Haptic Feedback**: Feel vibrations when interacting with controls
4. **Optimized Layout**: Enjoy mobile-specific UI optimizations

### ⚙️ Advanced Features
- **Cross Midnight**: The clock automatically handles AM/PM transitions when you drag the hands past 12
- **Real-time Updates**: Clock updates every second when not being manually adjusted
- **Persistent Settings**: Theme and format preferences are maintained during session

## 🏗️ Project Structure

```
v0-interactive-clock/
├── components/           # React components
│   ├── interactive-clock.tsx      # Main clock component
│   ├── MobileOptimizedClock.tsx   # Mobile-optimized clock wrapper
│   ├── MobileControlPanel.tsx     # Mobile-specific controls
│   ├── ResponsiveContainer.tsx    # Responsive layout container
│   └── theme-provider.tsx         # Theme provider for Next-Themes
├── hooks/               # Custom React hooks
│   ├── useClock.ts              # Clock state management
│   ├── useClockDrag.ts          # Drag interaction handling
│   ├── useClockEdit.ts          # Digital time editing
│   ├── useMobileOptimization.ts # Mobile detection & optimization
│   └── useSwipeGestures.ts      # Swipe gesture handling
├── lib/                 # Utility libraries
│   ├── themes.ts               # Theme definitions
│   ├── i18n.ts                # Internationalization
│   ├── clock-utils.ts         # Clock calculation utilities
│   ├── mobile-utils.ts        # Mobile detection utilities
│   ├── constants.ts           # App constants
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # General utility functions
└── docs/                # Documentation
    ├── digital-clock-edit-mode.md
    ├── improvement.md
    ├── prevent-scroll-on-mobile.md
    ├── responsive-design.md
    └── theme.md
```

## 🧪 Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Theming**: next-themes
- **Package Manager**: pnpm
- **Build Tool**: Next.js built-in bundler
- **Deployment**: GitHub Pages with GitHub Actions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

This project uses `pnpm` for package management. Please use `pnpm` to install dependencies.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern mobile interfaces
- Accessibility guidelines from WCAG 2.1
- Mobile optimization best practices from Apple HIG and Material Design
