# Project Structure Documentation

This document outlines the project structure and architecture for the Beans Coffee Shop website with its long scrolling page design.

## Overview

The project uses a modern JavaScript stack with Next.js for the frontend and Node.js/Express for the backend. The frontend implements a long scrolling design pattern instead of traditional pagination.

## Directory Structure

### Client (Frontend)

```
client/
├── public/                   # Static assets
│   ├── images/               # Image assets (coffee products, backgrounds, etc.)
│   └── fonts/                # Custom fonts
├── src/                      # Source code
│   ├── components/           # Reusable React components
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.jsx    # Fixed header with navigation
│   │   │   ├── Footer.jsx    # Site footer
│   │   │   ├── Layout.jsx    # Main layout wrapper
│   │   │   └── Navigation.jsx # Main and mobile navigation
│   │   ├── sections/         # Page sections for long scroll design
│   │   │   ├── Hero.jsx      # Hero section with parallax background
│   │   │   ├── About.jsx     # About the coffee shop section
│   │   │   ├── Featured.jsx  # Featured/seasonal products section
│   │   │   ├── Menu.jsx      # Coffee menu section
│   │   │   ├── Process.jsx   # Coffee making process section
│   │   │   ├── Subscription.jsx # Subscription options section
│   │   │   └── Contact.jsx   # Contact section
│   │   ├── ui/               # UI components
│   │   │   ├── Button.jsx    # Custom button component
│   │   │   ├── Card.jsx      # Card component for products
│   │   │   ├── Modal.jsx     # Modal component
│   │   │   └── Loader.jsx    # Loading state component
│   │   ├── cart/             # Shopping cart components
│   │   │   ├── Cart.jsx      # Cart sidebar/modal
│   │   │   ├── CartItem.jsx  # Individual cart item
│   │   │   └── Checkout.jsx  # Checkout process component
│   │   └── auth/             # Authentication components
│   │       ├── LoginForm.jsx # Login form
│   │       ├── SignupForm.jsx # Signup form
│   │       └── ProfileForm.jsx # User profile form
│   ├── pages/                # Next.js pages
│   │   ├── index.js          # Home page (main long scrolling page)
│   │   ├── _app.js           # Next.js app wrapper
│   │   ├── _document.js      # Custom document
│   │   ├── api/              # API routes for Next.js
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── auth/             # Authentication pages
│   │   └── [dynamic routes]  # Other dynamic routes
│   ├── styles/               # Styling
│   │   ├── globals.css       # Global styles
│   │   └── tailwind.css      # Tailwind imports
│   ├── hooks/                # Custom React hooks
│   │   ├── useIntersection.js # For scroll-triggered animations
│   │   ├── useScrollPosition.js # For tracking scroll position
│   │   ├── useCart.js        # Cart management
│   │   └── useAuth.js        # Authentication state
│   ├── context/              # React context providers
│   │   ├── CartContext.jsx   # Shopping cart context
│   │   ├── AuthContext.jsx   # Authentication context
│   │   └── UIContext.jsx     # UI state context
│   ├── lib/                  # Library code
│   │   ├── api.js            # API client
│   │   └── validators.js     # Form validation
│   ├── animations/           # Animation utilities
│   │   ├── parallax.js       # Parallax effect handlers
│   │   └── scroll.js         # Scroll-based animations
│   └── utils/                # Utility functions
│       ├── formatting.js     # Text/number formatting
│       └── helpers.js        # General helper functions
```

### Server (Backend)

```
server/
├── config/                   # Configuration files
│   ├── db.js                 # Database configuration
│   └── auth.js               # Authentication configuration
├── controllers/              # Route controllers
│   ├── auth.controller.js    # Authentication logic
│   ├── products.controller.js # Product management logic
│   ├── orders.controller.js  # Order processing logic
│   └── users.controller.js   # User management logic
├── models/                   # MongoDB models
│   ├── User.model.js         # User model schema
│   ├── Product.model.js      # Product model schema
│   ├── Order.model.js        # Order model schema
│   └── Category.model.js     # Category model schema
├── routes/                   # API routes
│   ├── auth.routes.js        # Authentication routes
│   ├── products.routes.js    # Product routes
│   ├── orders.routes.js      # Order routes
│   └── users.routes.js       # User management routes
├── middleware/               # Custom middleware
│   ├── auth.middleware.js    # Authentication middleware
│   └── validation.middleware.js # Request validation
└── utils/                    # Utility functions
    ├── errors.js             # Error handling utilities
    └── helpers.js            # Helper functions
```

## Long Scrolling Page Implementation

The home page (index.js) serves as the main entry point and implements the long scrolling design. It consists of several key sections that flow seamlessly as the user scrolls.

### Key Components for Long Scrolling

1. **Section Components**: Each visual section is a separate component in `src/components/sections/`
2. **Intersection Observer**: Used to detect when sections enter the viewport
3. **Scroll Position Tracking**: For parallax effects and sticky elements
4. **Smooth Scrolling**: CSS and JS techniques for smooth section transitions

### Reserved Space for Three.js Implementation

The project structure includes reserved areas where you can integrate Three.js later:

- `src/components/sections/` can include a new ThreeJS section component
- `src/lib/` could contain Three.js initialization and utility functions
- `public/models/` (to be created) for 3D models and textures

This allows you the flexibility to implement custom 3D elements without restructuring the project.

## Navigation in Long Scrolling Design

The navigation is designed to work with the long scrolling page:

1. **Sticky Header**: Always accessible navigation at the top
2. **Section Links**: Links in the navigation that smoothly scroll to the correct section
3. **Progress Indicator**: Visual indicator showing current scroll position/section
4. **Mobile Optimization**: Collapsible navigation for mobile devices 