# 🕐 Interactive Clock

A beautiful, interactive analog clock built with React, TypeScript, and Vite. You can drag the clock hands to set any time, and it supports both 12-hour and 24-hour formats with multilingual support (English/Japanese).

## 🌟 Features

- **Interactive Analog Clock**: Drag the red hour hand and blue minute hand to set time
- **Digital Display**: Shows time in both analog and digital formats
- **12/24 Hour Formats**: Toggle between 12-hour (AM/PM) and 24-hour formats
- **Multilingual Support**: Automatically detects browser language (English/Japanese)
- **Beautiful UI**: Modern design with glassmorphic effects and smooth animations
- **Touch Support**: Works on both desktop and mobile devices

## 🚀 Live Demo

Visit the live demo at: [https://luckpoint.github.io/interactive-clock/](https://luckpoint.github.io/interactive-clock/)

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/interactive-clock.git
cd interactive-clock

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Building for Production

\`\`\`bash
# Build the project
npm run build

# Preview the production build
npm run preview
\`\`\`

## 🌐 Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy your app
3. Your app will be available at `https://yourusername.github.io/interactive-clock/`

### GitHub Repository Settings

Make sure to enable GitHub Pages in your repository settings:

1. Go to **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Your site will be available at `https://yourusername.github.io/interactive-clock/`

## 🎯 Usage

1. **Set Time**: Drag the red (hour) or blue (minute) hands to set your desired time
2. **Toggle Format**: Click the time format button to switch between 12-hour and 24-hour formats
3. **Reset**: Click the reset button to set the time back to the current time
4. **Cross Midnight**: The clock automatically handles AM/PM transitions when you drag the hands past 12

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
