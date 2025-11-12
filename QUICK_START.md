# Quick Start Guide - ERP & CRM System

## Prerequisites
- Node.js (v16+)
- MongoDB running
- npm or yarn

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Create `.env` file in backend directory
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/erp_crm
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Start backend server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   Backend will run on `http://localhost:3000`

## Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## First Time Usage

1. **Access the application**
   - Open browser and go to `http://localhost:5173`

2. **Register a new account**
   - Click "Register here" on login page
   - Fill in:
     - Full Name
     - Email
     - Password
     - Confirm Password
     - Role (Admin or Staff)
   - Click "Register"

3. **You'll be automatically logged in and redirected to Dashboard**

## Using the Application

### Dashboard
- View revenue summary
- See total invoices and customers
- Check pending payments
- View recent invoices

### Customers
- Click "Customers" in navigation
- Click "+ Add Customer" to create new customer
- Fill in customer details (name, email, phone, address, company)
- Click on a customer row to view details
- Use "Edit" to modify customer
- Use "Delete" to remove customer

### Invoices
- Click "Invoices" in navigation
- Click "+ Create Invoice" to create new invoice
- Select client from dropdown
- Add invoice items (name, quantity, price, tax, discount)
- Click "+ Add Item" for multiple items
- Set invoice date and due date
- Click "Create Invoice"

### Payments
- Click "Payments" in navigation
- Click "+ Record Payment" to add payment
- Select invoice (only unpaid/partial invoices shown)
- Amount auto-fills from invoice total
- Select payment method
- Add reference number and notes (optional)
- Click "Record Payment"

## Default Test Data

If you want to test with sample data, you can:

1. **Create a test customer**
   - Name: Test Company Ltd
   - Email: test@company.com
   - Phone: +91 9876543210
   - Address: 123 Test Street, Mumbai
   - Company: Test Company

2. **Create a test invoice**
   - Select the test customer
   - Add items:
     - Item: Web Development
     - Quantity: 1
     - Price: 50000
     - Tax: 18%

3. **Record a payment**
   - Select the invoice
   - Amount: 50000
   - Method: Bank Transfer

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 3000 is available

### Frontend won't start
- Check if backend is running
- Verify `.env` file in frontend directory
- Check if port 5173 is available

### Can't login
- Make sure backend is running
- Check browser console for errors
- Verify API URL in frontend `.env`

### CORS errors
- Backend CORS middleware should allow frontend URL
- Check backend `cors.js` configuration

## API Endpoints

### Authentication
- POST `/users/register` - Register new user
- POST `/users/login` - Login user
- POST `/users/logout/:id` - Logout user

### Customers
- GET `/customers/getCustomers` - Get all customers
- POST `/customers/createCustomer` - Create customer
- PATCH `/customers/updateCustomer/:id` - Update customer
- DELETE `/customers/deleteCustomer/:id` - Delete customer

### Invoices
- GET `/invoices/getAllInvoices` - Get all invoices
- POST `/invoices/createInvoice` - Create invoice
- PATCH `/invoices/updateInvoice/:id` - Update invoice
- DELETE `/invoices/deleteInvoice/:id` - Delete invoice

### Payments
- GET `/payments/getAllPayments` - Get all payments
- POST `/payments/createPayment` - Create payment
- DELETE `/payments/deletePayment/:id` - Delete payment

### Analytics
- GET `/analytics/dashboard` - Get dashboard data

## Production Build

### Backend
```bash
cd backend
npm run build  # if build script exists
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # to test production build
```

The production build will be in `frontend/dist` directory.

## Support

For detailed documentation:
- Frontend: See `frontend/SETUP.md`
- Backend: Check backend API documentation
- Summary: See `FRONTEND_IMPLEMENTATION_SUMMARY.md`

## Features Checklist

- ✅ User Authentication (Login/Register/Logout)
- ✅ Dashboard with Analytics
- ✅ Customer Management (CRUD)
- ✅ Invoice Management (CRUD with items)
- ✅ Payment Management (Record & Track)
- ✅ Protected Routes
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Form Validation

Enjoy using your ERP & CRM system! 🚀

