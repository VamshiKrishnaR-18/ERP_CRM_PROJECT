import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext..jsx';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        try {
            const result = await login(email, password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            const errMessage = err.response?.data?.message || 'Login failed';
            setError(errMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 flex-col justify-between p-12">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-blue-600 font-bold text-2xl">E</span>
                        </div>
                        <div>
                            <p className="text-white text-xl font-bold">ERP & CRM</p>
                            <p className="text-blue-100 text-sm">Management System</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Manage Your Business Efficiently
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Streamline your operations with our comprehensive ERP and CRM solution. Manage customers, invoices, payments, and analytics all in one place.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-6 h-6 text-blue-200 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-white font-semibold">Customer Management</p>
                                <p className="text-blue-100 text-sm">Organize and track all your customers</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <svg className="w-6 h-6 text-blue-200 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-white font-semibold">Invoice & Billing</p>
                                <p className="text-blue-100 text-sm">Create and manage invoices easily</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <svg className="w-6 h-6 text-blue-200 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-white font-semibold">Payment Tracking</p>
                                <p className="text-blue-100 text-sm">Monitor payments and cash flow</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-blue-100 text-sm">
                    <p>© 2024 ERP & CRM System. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">E</span>
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-gray-900">ERP & CRM</p>
                                <p className="text-gray-500 text-sm">Management System</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                        <p className="mt-2 text-gray-600">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <Alert
                                type="error"
                                message={error}
                                onClose={() => setError('')}
                            />
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-9 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.064.37-2.213 1.02-3.303m2.934-2.934A9.956 9.956 0 0112 5c5 0 9 4 9 7 0 1.293-.47 2.59-1.305 3.78M4 4l16 16" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    <span className="ml-2">Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                        <p>Secure login powered by JWT authentication</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;