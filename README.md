# Beans - Modern Coffee Shop Website

A full-stack modern coffee shop website featuring a long scrolling design, responsive layout, user authentication, shopping cart functionality, and admin management.

## Features

- 📜 **Long Scrolling Design** - Elegant single-page experience with smooth section transitions
- 🎨 **Responsive UI** - Beautiful, responsive frontend with parallax scrolling effects
- 🛒 **E-commerce** - Complete shopping cart and order management system
- 👤 **Authentication** - User login via email, phone, or username
- 📱 **Cross-device** - Consistent experience across all devices
- 🔧 **Admin Panel** - Backend administration for products, orders, and users
- 🚀 **Performance** - Optimized for speed and user experience
- 🖼️ **Visual Storytelling** - Seasonal coffee showcases and subscription process explanations

## Tech Stack

### Frontend
- **Next.js** - React framework for server-rendered applications
- **React.js** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - Reserved for custom 3D visualization implementation

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication token handling

## Project Structure

```
beans/
├── client/                   # Frontend Next.js application
│   ├── public/               # Static assets
│   │   ├── images/           # Image assets
│   │   └── fonts/            # Custom fonts
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable React components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── sections/     # Page sections for long scroll design
│   │   │   ├── ui/           # UI components (buttons, cards, etc.)
│   │   │   ├── cart/         # Shopping cart components
│   │   │   └── auth/         # Authentication components
│   │   ├── pages/            # Next.js pages
│   │   ├── styles/           # Global styles and Tailwind config
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React context providers
│   │   ├── lib/              # Library code for third-party services
│   │   ├── animations/       # Animation utilities (for parallax)
│   │   └── utils/            # Utility functions
│   ├── next.config.js        # Next.js configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── server/                   # Backend Node.js application
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   └── utils/                # Utility functions
│
└── docs/                     # Documentation files
    ├── api/                  # API documentation
    ├── design/               # Design specifications
    │   ├── sections/         # Long scroll section designs
    │   └── components/       # Component design specs
    └── development/          # Development guides
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/beans.git
cd beans
```

2. Install frontend dependencies
```bash
cd client
npm install
```

3. Install backend dependencies
```bash
cd ../server
npm install
```

### Configuration

1. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beans
JWT_SECRET=your_jwt_secret
```

2. Create a `.env.local` file in the client directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the application

1. Start the backend server
```bash
cd server
npm run dev
```

2. Start the frontend application
```bash
cd client
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Long Scrolling Page Design

This project implements a continuous scrolling experience instead of traditional pagination:

- **Section-Based Architecture** - Content is organized in distinct, flowing sections
- **Smooth Transitions** - Seamless scrolling between content sections
- **Parallax Effects** - Depth and dimension through parallax scrolling
- **Intersection Observers** - Trigger animations and effects as sections come into view
- **Sticky Elements** - Navigation and key UI elements remain accessible
- **Responsive Adaptations** - Long-scroll experience adapted for all device sizes

## Development Roadmap

1. Setup basic project structure ✅
2. Implement long scrolling page architecture
3. Create responsive homepage with parallax effects
4. Implement user authentication system
5. Develop product catalog with visual storytelling
6. Implement shopping cart functionality
7. Create checkout and payment system
8. Develop order history and tracking
9. Build admin dashboard
10. Reserved space for Three.js implementation
11. Testing and deployment

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
