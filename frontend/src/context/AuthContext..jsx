import {createContext, useContext, useState, useEffect, useCallback} from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Logout function
    const logout = useCallback(async () => {
        try {
            if (user?.id) {
                await axiosClient.post(`/users/logout/${user.id}`);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [user]);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser) {
                    const decoded = jwtDecode(token);

                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {
                        // Token expired, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        setIsAuthenticated(false);
                    } else {
                        setUser(JSON.parse(storedUser));
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []); // Empty dependency array - only run once on mount

    // Login function
    const login = useCallback(async (email, password) => {
        try {
            const response = await axiosClient.post('/users/login', { email, password });

            const { token } = response.data.data;

            if (!token) {
                throw new Error('No token received from server');
            }

            // Decode token to get user info
            const decoded = jwtDecode(token);

            // Store token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decoded));

            setUser(decoded);
            setIsAuthenticated(true);

            return { success: true, data: decoded };
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            return { success: false, error: errorMessage };
        }
    }, []);

    // Register function
    const register = useCallback(async (userData) => {
        try {
            const response = await axiosClient.post('/users/register', userData);

            const { token } = response.data.data;

            if (!token) {
                throw new Error('No token received from server');
            }

            // Decode token to get user info
            const decoded = jwtDecode(token);

            // Store token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(decoded));

            setUser(decoded);
            setIsAuthenticated(true);

            return { success: true, data: decoded };
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed';
            return { success: false, error: errorMessage };
        }
    }, []);

    // Update user info
    const updateUser = useCallback((updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }, []);

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};