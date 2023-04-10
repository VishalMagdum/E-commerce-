import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function ProtectedRoute({ isAdmin }) {

    const { user, loading, isAuthenticated } = useSelector((state) => state.user)
    if (!loading) {
        return isAuthenticated === true ? <Outlet /> : <Navigate to="/login" />;
    }

    if (!loading) {
        return (user.role === "admin") && (isAuthenticated === true) && (isAdmin) ? <Outlet /> : <Navigate to="/login" />;

    }
}

export default ProtectedRoute