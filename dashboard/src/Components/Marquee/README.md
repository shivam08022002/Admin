# Marquee Component

A React component that displays banner messages in a scrolling marquee format below the header.

## Features

- Fetches banner messages from the API endpoint `alpha/getGlobalProperty/agentBannerMessage`
- Automatically refreshes banner messages every 5 minutes
- Responsive design with mobile-friendly styling
- Handles authentication errors (401) by calling logout function
- Fixed positioning below the header
- Smooth scrolling animation

## Usage

```jsx
import Marquee from '../Components/Marquee';

// In your component
<Marquee logout={logoutFunction} />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `logout` | `function` | Yes | Function to call when authentication fails (401 error) |

## API Integration

The component automatically calls the following API endpoint:
- **GET** `alpha/getGlobalProperty/agentBannerMessage`

## Styling

The component uses CSS classes for styling:
- `.marquee-container` - Main container with fixed positioning
- `.marquee-element` - The marquee element itself
- `.marquee-content` - Content styling with typography

## Responsive Design

- Desktop: 16px font size
- Tablet (≤768px): 14px font size  
- Mobile (≤480px): 12px font size

## Error Handling

- Handles 401 authentication errors by calling the provided logout function
- Gracefully handles API failures without breaking the UI
- Only renders when banner message is available
