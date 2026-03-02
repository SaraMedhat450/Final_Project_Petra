import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const location = useLocation();

    // Check if user is authenticated
    // If not, redirect to login but keep the current location to redirect back
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user role is allowed
    // allowedRoles should be an array of strings like ['customer', 'provider']
    if (allowedRoles && !allowedRoles.includes(role)) {
        // If not allowed, redirect to a safe page or back to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
