import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext..jsx';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'staff'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...userData } = formData;
            const result = await register(userData);
            
            if (result.success) {
                console.log('Registration successful');
                navigate('/dashboard');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            const errMessage = err.response?.data?.message || 'Registration failed';
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
                            Get Started Today
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Join thousands of businesses using our ERP and CRM solution to streamline their operations and grow faster.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-6 h-6 text-blue-200 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-white font-semibold">Easy Setup</p>
                                <p className="text-blue-100 text-sm">Get started in minutes</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <svg className="w-6 h-6 text-blue-200 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-white font-semibold">Secure & Reliable</p>
                                <p className="text-blue-100 text-sm">Enterprise-grade security</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <svg className="w-6 h-6 text-blue-200 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-white font-semibold">24/7 Support</p>
                                <p className="text-blue-100 text-sm">Always here to help</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-blue-100 text-sm">
                    <p>© 2024 ERP & CRM System. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Registration Form */}
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
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">
                            Fill in your details to get started
                        </p>
                    </div>

                    {/* Registration Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <Alert
                                type="error"
                                message={error}
                                onClose={() => setError('')}
                            />
                        )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    <span className="ml-2">Creating account...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                        <p>By registering, you agree to our Terms of Service</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

