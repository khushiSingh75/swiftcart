
👉 [Live App](https://swiftcart-phi.vercel.app)
# ShopEasy - E-commerce Web Application

A full-stack e-commerce web application built with React, Convex, and TypeScript featuring JWT authentication, product management, and persistent shopping cart functionality.

## 🚀 Features

### Backend (Convex)
- **JWT-based Authentication**: Secure signup and login with Convex Auth
- **Product Management**: CRUD operations for products with filtering and sorting
- **Shopping Cart**: Persistent cart that survives logout/login cycles
- **Real-time Updates**: Live data synchronization across all clients
- **Database Schema**: Well-structured tables for users, products, and cart items

### Frontend (React + TypeScript)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Listing**: Browse products with category and price filters
- **Shopping Cart**: Add, remove, and update item quantities
- **Authentication**: Seamless login/logout experience
- **Real-time UI**: Automatic updates when data changes

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Convex (serverless backend with real-time database)
- **Authentication**: Convex Auth with JWT tokens
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Convex React hooks for real-time data

## 📦 Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will start both the Convex backend and React frontend.

3. **Seed Demo Data**
   - Sign up for a new account
   - Click "Add Demo Products" to populate the store with sample products

## 🏗️ Project Structure

```
/
├── convex/                 # Backend functions and schema
│   ├── schema.ts          # Database schema definition
│   ├── products.ts        # Product CRUD operations
│   ├── cart.ts           # Shopping cart management
│   └── auth.ts           # Authentication helpers
├── src/
│   ├── components/        # React components
│   │   ├── ProductList.tsx # Product browsing and filtering
│   │   └── Cart.tsx       # Shopping cart interface
│   ├── App.tsx           # Main application component
│   └── index.css         # Global styles and Tailwind
└── README.md
```

## 🔧 Key Features Explained

### Authentication
- Users can sign up and log in using email/password
- JWT tokens are managed automatically by Convex Auth
- Authentication state persists across browser sessions

### Product Management
- **Filtering**: Filter products by category and price range
- **Sorting**: Products are sorted by price (ascending)
- **Categories**: Dynamic category list generated from products
- **Stock Management**: Track inventory levels

### Shopping Cart
- **Persistent Storage**: Cart items are stored in the database, not localStorage
- **Cross-session Persistence**: Cart survives logout/login cycles
- **Quantity Management**: Increase/decrease item quantities
- **Real-time Updates**: Cart updates immediately across all browser tabs
- **Price Calculation**: Automatic subtotal and total calculations

### Real-time Features
- Product list updates when new items are added
- Cart updates instantly when items are modified
- Live cart item count in navigation
- Automatic UI refresh when data changes

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User feedback for all actions
- **Empty States**: Helpful messages when no data is available
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔒 Security Features

- **Authentication Required**: Cart operations require login
- **User Isolation**: Users can only access their own cart items
- **Input Validation**: All inputs are validated on both client and server
- **Type Safety**: Full TypeScript coverage for type safety

## 🚀 Deployment

The application is ready for deployment on Vercel or similar platforms:

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the Vite configuration
   - Convex handles the backend deployment automatically

## 📝 API Endpoints (Convex Functions)

### Products
- `products.list` - Get filtered and sorted products
- `products.getCategories` - Get all available categories
- `products.getById` - Get single product details
- `products.seedProducts` - Add demo products (development)

### Cart
- `cart.getCartItems` - Get user's cart with product details
- `cart.addToCart` - Add item to cart or update quantity
- `cart.updateQuantity` - Update item quantity
- `cart.removeFromCart` - Remove item from cart
- `cart.clearCart` - Clear entire cart
- `cart.getCartSummary` - Get cart totals

### Authentication
- `auth.loggedInUser` - Get current user information

## 🎯 Future Enhancements

- **Payment Integration**: Add Stripe or PayPal checkout
- **Order History**: Track completed purchases
- **Product Reviews**: User ratings and reviews
- **Wishlist**: Save items for later
- **Admin Panel**: Product management interface
- **Search**: Full-text product search
- **Recommendations**: AI-powered product suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
