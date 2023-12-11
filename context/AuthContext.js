'use client';

import React, { createContext, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getLoggedInUser } from '@/lib/api/users';
import useAccessToken from '@/hooks/useAccessToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const accessToken = useAccessToken();

    const login = () => {

    };

    const logout = () => {
        window.localStorage.removeItem('auth_token');

        setUser(null);

        redirect('/auth/login');

    };

    const loadUser = async () => {

        try {
            const userResp = await getLoggedInUser();

            setUser(userResp?.data?.data ?? null);
        } catch (e) {
            if (e.response.status === 401) {
                setUser(null);
            }
        }
    }

    // Dans votre AuthProvider

    const checkIfTokenIsInUrl = async () => {
        try {
            if (accessToken) {
                sessionStorage.setItem('auth_token', accessToken);
                // sleep 100ms to wait for the token to be saved
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error('Erreur lors de l’authentification avec le token', error);
            // Gérez les erreurs (par exemple, token invalide)
        }
    };


    useEffect(() => {
        checkIfTokenIsInUrl().then(() => {
            loadUser();
        });
    }, []);

    const isAuthenticated = !!user;

    console.log('isAuthenticated', isAuthenticated, user);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
