import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({component}) => {
    const signInPerson = JSON.parse(localStorage.getItem('IdU'))

    if (signInPerson && signInPerson.isAdmin) { 
        return component
    } else {
        return <Navigate to='/'/>
    }
};

export default ProtectedRoutes;