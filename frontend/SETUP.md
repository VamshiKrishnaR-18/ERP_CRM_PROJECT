# ERP & CRM Frontend Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3000 (or configured port)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `VITE_API_BASE_URL` in `.env` file to match your backend URL
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API service files
│   │   ├── axiosClient.js      # Axios configuration
│   │   ├── userService.js      # User API calls
│   │   ├── customerService.js  # Customer API calls
│   │   ├── invoiceService.js   # Invoice API calls
│   │   ├── paymentService.js   # Payment API calls
│   │   ├── analyticsService.js # Analytics API calls
│   │   ├── notificationService.js
│   │   └── exportService.js
│   ├── components/             # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/                # React Context
│   │   └── AuthContext..jsx   # Authentication context
│   ├── pages/                  # Page components
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── Dashboard/
│   │   │   └── DashboardPage.jsx
│   │   ├── Customers/
│   │   │   ├── CustomersPage.jsx
│   │   │   └── CustomerForm.jsx
│   │   ├── Invoices/
│   │   │   ├── InvoicesPage.jsx
│   │   │   └── InvoiceForm.jsx
│   │   └── Payments/
│   │       ├── PaymentsPage.jsx
│   │       └── PaymentForm.jsx
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Features Implemented

### Authentication
- User login with JWT token
- User registration
- Protected routes
- Auto-redirect on token expiration
- Persistent login state

### Dashboard
- Revenue summary
- Invoice statistics
- Customer count
- Pending payments overview
- Recent invoices list
- Quick stats

### Customers Management
- List all customers
- Create new customer
- Edit customer details
- Delete customer (soft delete)
- Customer status (Active/Inactive)

### Invoices Management
- List all invoices
- Create new invoice with multiple items
- Edit invoice
- Delete invoice (soft delete)
- Invoice status tracking
- Payment status tracking
- Client association

### Payments Management
- List all payments
- Record new payment
- Link payment to invoice
- Multiple payment methods support
- Payment history

## API Integration

All API calls are made through service files in the `src/api` directory. The `axiosClient.js` file handles:
- Base URL configuration
- JWT token attachment to requests
- Response/error interceptors
- Auto-redirect on 401 errors

## Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- Responsive design for mobile and desktop
- Consistent color scheme
- Modern UI components

## Authentication Flow

1. User logs in via LoginPage
2. JWT token is stored in localStorage
3. Token is decoded to extract user info
4. User info is stored in AuthContext
5. Protected routes check authentication status
6. Token is automatically attached to all API requests
7. On 401 error, user is logged out and redirected to login

## Next Steps

To extend the application:
1. Add invoice detail view page
2. Add customer detail view page
3. Implement analytics charts
4. Add export functionality UI
5. Implement notification system UI
6. Add user profile management
7. Implement search and filtering
8. Add pagination for large datasets

## Troubleshooting

### CORS Issues
Make sure the backend CORS middleware is configured to allow requests from the frontend URL.

### API Connection Failed
- Check if backend server is running
- Verify `VITE_API_BASE_URL` in `.env` file
- Check browser console for detailed error messages

### Authentication Issues
- Clear localStorage and try logging in again
- Check if JWT token is being sent in request headers
- Verify backend authentication middleware is working

## Support

For issues or questions, please refer to the backend API documentation or contact the development team.

