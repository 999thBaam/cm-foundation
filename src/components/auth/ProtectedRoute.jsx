import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore();
    const location = useLocation();

    if (!user) {
        // Redirect to login page but save the attempted location
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
