# GrabAll - A Bangladeshi E-Commerce Platform

GrabAll is a comprehensive MERN stack e-commerce platform designed specifically for the Bangladeshi market. It features a modern UI, secure authentication, payment gateway integrations, and a powerful admin dashboard.

## Tech Stack

### Frontend
- **React + Vite**: For a fast and efficient development experience
- **Tailwind CSS**: For responsive and customizable UI components
- **Redux Toolkit**: For state management with RTK Query for API calls
- **Framer Motion**: For smooth animations and transitions
- **React Router**: For client-side routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: For secure authentication with HTTPOnly cookies
- **Gmail API**: For transactional emails

### Security Features
- **Helmet**: For setting security HTTP headers
- **XSS-Clean**: For sanitizing user input
- **Express Rate Limit**: For API rate limiting
- **CORS**: For Cross-Origin Resource Sharing
- **Cookie Parser**: For secure cookie-based authentication

## Features

### User Features
- Responsive design for all devices
- User registration and authentication
- Product browsing with advanced filtering
- Shopping cart management
- Order placement and tracking
- Payment gateway integration (SSLCommerz, bKash, Nagad)
- User profile management
- Wishlist functionality
- Product reviews and ratings

### Admin Features
- Comprehensive dashboard with analytics
- Product management (CRUD operations)
- Order management
- User management
- Banner/slider management
- Category management
- Sales reports and analytics

## Project Structure

```
graball-ecommerce/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source files
│       ├── app/            # Redux store setup
│       ├── assets/         # Images, logos, etc.
│       ├── components/     # Reusable UI components
│       ├── features/       # Redux slices + feature modules
│       ├── layouts/        # Page layouts
│       ├── pages/          # Page components
│       ├── router/         # React Router configuration
│       ├── services/       # API services
│       ├── utils/          # Utility functions
│       ├── hooks/          # Custom React hooks
│       └── context/        # React context providers
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── validations/        # Input validation schemas
└── .env                    # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/graball-ecommerce.git
   cd graball-ecommerce
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/graball
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   NODE_ENV=development

   # Gmail API credentials
   GMAIL_CLIENT_ID=your_gmail_client_id
   GMAIL_CLIENT_SECRET=your_gmail_client_secret
   GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
   GMAIL_USER=your_email@gmail.com

   # Payment gateway credentials
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_store_password
   BKASH_APP_KEY=your_bkash_app_key
   BKASH_APP_SECRET=your_bkash_app_secret
   NAGAD_MERCHANT_ID=your_nagad_merchant_id
   NAGAD_MERCHANT_NUMBER=your_nagad_merchant_number
   ```

### Running the Application

1. Start the server
   ```bash
   cd server
   npm run dev
   ```

2. Start the client
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## License

This project is licensed under the ISC License.

## Deployment

### Local Deployment

The application is set up to run in development mode locally. Follow the installation steps above to get started.

### Production Deployment

1. Build the client for production
   ```bash
   cd client
   npm run build
   ```

2. Set the following environment variables for production:
   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   ```

3. Deploy the server to your hosting provider (e.g., Heroku, Vercel, DigitalOcean)
   - For Heroku:
     ```bash
     heroku create
     git push heroku main
     ```
   - For Vercel, create a `vercel.json` file and deploy using the Vercel CLI:
     ```bash
     npm install -g vercel
     vercel
     ```

## API Documentation

The GrabAll API provides endpoints for product management, user authentication, cart operations, and order processing.

### Base URL

- Development: `http://localhost:5000/api`
- Production: `https://your-production-domain.com/api`

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user
- GET `/api/auth/logout` - Logout a user
- GET `/api/auth/profile` - Get current user profile
- PUT `/api/auth/profile` - Update user profile

### Products

- GET `/api/products` - Get all products with pagination and filtering
- GET `/api/products/:id` - Get a single product by ID
- POST `/api/products` - Create a new product (admin only)
- PUT `/api/products/:id` - Update a product (admin only)
- DELETE `/api/products/:id` - Delete a product (admin only)
- POST `/api/products/:id/reviews` - Create a product review

### Cart & Orders

- GET `/api/orders` - Get user orders
- POST `/api/orders` - Create a new order
- GET `/api/orders/:id` - Get order by ID
- PUT `/api/orders/:id/pay` - Update order to paid status
- PUT `/api/orders/:id/deliver` - Update order to delivered status (admin only)

### Admin

- GET `/api/admin/users` - Get all users (admin only)
- GET `/api/admin/orders` - Get all orders (admin only)
- GET `/api/admin/dashboard` - Get dashboard statistics (admin only)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

### Coding Standards

- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Keep components small and reusable
- Use meaningful variable and function names
- Document your code with JSDoc comments

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Product Listing

![Product Listing](screenshots/products.png)

### Product Detail

![Product Detail](screenshots/product-detail.png)

### Shopping Cart

![Shopping Cart](screenshots/cart.png)

### Checkout Process

![Checkout](screenshots/checkout.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

## Acknowledgements

- Inspired by popular e-commerce platforms like Daraz, Amazon, and Flipkart
- Built with modern web technologies and best practices
- Special thanks to the open-source community for providing excellent tools and libraries
