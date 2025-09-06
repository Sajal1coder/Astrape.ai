# E-Commerce Web Application

A full-stack e-commerce application built with Node.js, Express.js, MongoDB, Next.js, and React.

## Features

### Backend
- **Authentication**: JWT-based user authentication (signup/login)
- **Items API**: CRUD operations with filtering by price and categories
- **Cart API**: Add, update, remove items from cart
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing with bcrypt

### Frontend
- **Framework**: Next.js with React
- **Authentication**: Login and registration pages
- **Product Listing**: Filterable product catalog with pagination
- **Shopping Cart**: Add/remove items, quantity management
- **Cart Persistence**: Cart items persist after logout (stored in database)
- **Responsive Design**: Mobile-friendly UI

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (for production deployment)
- Vercel account (for deployment)

### Local Development Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your environment variables:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

5. Seed the database by visiting:
```
http://localhost:3000/api/seed
```

### Vercel Deployment

This application is configured for deployment on Vercel with both frontend and backend as serverless functions.

#### Deploy to Vercel

1. **Push to GitHub**: Push your code to a GitHub repository

2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

3. **Environment Variables**: Add these environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens

4. **Deploy**: Vercel will automatically build and deploy your application

#### Post-Deployment Setup

1. **Seed Database**: After deployment, visit `https://your-app.vercel.app/api/seed` to populate the database

2. **Test**: Your application will be available at the Vercel URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Items
- `GET /api/items` - Get all items with filters
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)
- `GET /api/items/meta/categories` - Get available categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/remove/:cartItemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Products**: View products on the home page with filtering options
3. **Add to Cart**: Click "Add to Cart" on any product (requires login)
4. **Manage Cart**: View and modify cart items on the cart page
5. **Persistent Cart**: Cart items are saved to your account and persist across sessions

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

### Frontend
- Next.js
- React
- Axios
- js-cookie
- CSS3

## Project Structure

```
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   └── cart.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── components/
│   │   └── Layout.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── lib/
│   │   └── api.js
│   ├── pages/
│   │   ├── _app.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── register.js
│   │   └── cart.js
│   ├── styles/
│   │   └── globals.css
│   ├── next.config.js
│   └── package.json
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

## Future Enhancements

- Order management system
- Payment integration
- Product reviews and ratings
- Admin dashboard
- Email notifications
- Image upload functionality
- Search functionality improvements
