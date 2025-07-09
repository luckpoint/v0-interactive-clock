# UI Design Specifications

## Overview
This document outlines the UI design specifications for the Fun Clock application, organized by device type (smartphone, tablet, PC). The specifications are based on screenshots and code analysis.

## Device Type Detection

| Device Type | Viewport Width | Touch Support | User Agent Pattern |
|-------------|----------------|---------------|-------------------|
| **Mobile** | `<= 768px` | Yes | `/Mobile\|mini\|Fennec\|Android\|iP(ad\|od\|hone)/` |
| **Tablet** | `>= 768px` | Yes | `/(tablet\|ipad\|playbook\|silk)\|(android(?!.*mobi))/i` |
| **Desktop** | `> 768px` | No | - |

### Platform Detection
| Platform | User Agent Pattern | Touch Target Size |
|----------|-------------------|-------------------|
| iOS | `/iPad\|iPhone\|iPod/` | 44pt (Apple HIG) |
| Android | `/Android/` | 48dp (Material Design) |
| Desktop | - | 32px |

## Layout Specifications by Device Type

### 1. Smartphone (Mobile)

| Property | Portrait | Landscape |
|----------|----------|-----------|
| **Viewport** | `<= 768px width` | `<= 768px width` |
| **Container Classes** | `flex flex-col items-center min-h-screen justify-start` | `flex flex-col items-center min-h-screen justify-center` |
| **Padding** | `pt-2 pb-4 px-2` (8px top, 16px bottom, 8px sides) | `px-2 py-2` (8px all sides) |
| **Gap** | `gap-2` (8px) | `gap-2` (8px) |

#### Clock Face Sizing
| Property | Value |
|----------|-------|
| **Size Calculation** | `Math.min(minDimension * 0.8, 320px)` |
| **Maximum Size** | `320px × 320px` |
| **Sizing Logic** | 80% of smaller viewport dimension |

#### Touch Targets
| Property | iOS | Android |
|----------|-----|---------|
| **Minimum Size** | 44pt | 48dp |
| **Touch Area Expansion** | +20px | +20px |
| **Touch Sensitivity** | 0.8 | 0.8 |

### 2. Tablet

| Property | Regular Tablet | Large Tablet (>= 800px) |
|----------|----------------|--------------------------|
| **Viewport** | `>= 768px width` | `>= 768px width` |
| **Container Classes** | `flex flex-col items-center min-h-screen justify-center` | `flex flex-col items-center min-h-screen justify-center` |
| **Padding** | `p-4` (16px all sides) | `p-4` (16px all sides) |

#### Clock Face Sizing
| Tablet Type | Size Calculation | Maximum Size |
|-------------|------------------|--------------|
| **Regular** | `Math.min(minDimension * 0.75, 700px)` | `700px × 700px` |
| **Large** | `Math.min(minDimension * 0.85, 900px)` | `900px × 900px` |

#### Touch Targets
| Property | Value |
|----------|-------|
| **Minimum Size** | 48dp |
| **Touch Area Expansion** | +15px |
| **Touch Sensitivity** | 0.9 |

### 3. Desktop (PC)

| Property | Value |
|----------|-------|
| **Viewport** | `> 768px width` |
| **Container Classes** | `flex flex-col items-center justify-center min-h-screen` |
| **Padding** | `p-4` (16px) / `sm:p-6` (24px) / `md:p-8` (32px) |

#### Clock Face Sizing
| Property | Value |
|----------|-------|
| **Size Calculation** | `Math.min(viewportWidth * 0.24, 500px)` |
| **Maximum Size** | `500px × 500px` |
| **Sizing Logic** | 24% of viewport width |

#### Interactive Elements
| Property | Value |
|----------|-------|
| **Minimum Size** | 32px |
| **Touch Area Expansion** | +5px |
| **Touch Sensitivity** | 1.0 |

## Component Specifications

### Header Bar
| Element | Position | Properties |
|---------|----------|------------|
| **Logo/Title** | Left | Consistent height across devices |
| **Theme Selector** | Right | Dropdown/popup menu |
| **Help Button** | Right | `?` icon button |
| **Spacing** | - | Even distribution |

### Digital Clock Display
| Property | Value |
|----------|-------|
| **Typography** | Large, monospace font |
| **Format** | `HH:MM:SS PM` |
| **Scaling** | Responsive to container size |
| **Padding** | Consistent margin from clock face |

### Control Panel

#### Time Adjustment Buttons
| Property | Value |
|----------|-------|
| **Layout** | Horizontal row |
| **Buttons** | `-1h`, `-5m`, `-1m`, `+1m`, `+5m`, `+1h` |
| **Spacing** | Even distribution with gaps |

#### Function Buttons
| Property | Value |
|----------|-------|
| **Layout** | Horizontal row |
| **Buttons** | `24-Hour`, `Second Hand`, `Stop`, `Reset` |
| **Spacing** | Even distribution with gaps |

### Modal Dialogs

#### Clock Face Selection
| Property | Value |
|----------|-------|
| **Layout** | Grid display (2 columns) |
| **Item Size** | Square thumbnails |
| **Spacing** | Consistent gaps between items |
| **Background** | Semi-transparent overlay |

#### Help Dialog
| Property | Value |
|----------|-------|
| **Layout** | Centered modal |
| **Content** | Bulleted list |
| **Close Button** | Bottom right |
| **Background** | Semi-transparent overlay |

#### Theme Selector
| Property | Value |
|----------|-------|
| **Layout** | Vertical list |
| **Items** | Color dots with labels |
| **Spacing** | Consistent vertical gaps |

## Color Scheme & Theming

### Available Theme Colors
| Color | Usage |
|-------|-------|
| **Orange** | Default theme |
| **Blue (Cyan)** | Alternative theme |
| **Green** | Alternative theme |
| **Purple** | Alternative theme |
| **Pink** | Alternative theme |

### UI Element Styling
| Element | Style |
|---------|-------|
| **Background** | Light, neutral tone |
| **Text** | Dark for readability |
| **Buttons** | Rounded corners, subtle shadows |
| **Modals** | White background with drop shadows |

## Responsive Behavior Summary

| Device Type | Orientation | Layout | Alignment | Spacing |
|-------------|-------------|---------|-----------|---------|
| **Mobile** | Portrait | Vertical | Top-aligned | Compact |
| **Mobile** | Landscape | Vertical | Centered | Compact |
| **Tablet** | Both | Vertical | Centered | Standard |
| **Desktop** | - | Vertical | Centered | Standard |

## Accessibility & Performance

### Touch Targets by Platform
| Platform | Minimum Size | Touch Area | Haptic Feedback |
|----------|--------------|------------|----------------|
| **iOS** | 44pt | +20px (mobile), +15px (tablet) | Light vibration |
| **Android** | 48dp | +20px (mobile), +15px (tablet) | Light vibration |
| **Desktop** | 32px | +5px | None |

### Performance Optimizations
| Optimization | Description |
|--------------|-------------|
| **SSR-Safe** | Desktop styles used until client initialization |
| **Progressive Enhancement** | Mobile optimizations applied after hydration |
| **Passive Events** | Used where possible for better performance |
| **Scroll Prevention** | On clock interaction areas |
| **Input Debouncing** | For rapid touch inputs |