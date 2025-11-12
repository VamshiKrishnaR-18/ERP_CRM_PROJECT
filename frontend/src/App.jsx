import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext..jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { LoadingScreen } from './components/Spinner';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CustomersPage from './pages/Customers/CustomersPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import PaymentsPage from './pages/Payments/PaymentsPage';

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <Link to="/dashboard" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Loading your workspace..." />;
  }

  return (
    <div id="app-container" className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <InvoicesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
