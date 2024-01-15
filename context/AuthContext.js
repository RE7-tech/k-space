'use client';

import React, { createContext, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getLoggedInUser } from '@/lib/api/users';
import config from '@/utils/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { removeAuthToken } from '@/utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [showModalMaintenance, setShowModalMaintenance] = useState(false);

    const login = () => {

    };

    const logout = () => {
        removeAuthToken();

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
            const urlSearch = new URLSearchParams(window.location.search);
    
            let accessToken = urlSearch.get('access_token');
            let accessToken2 = urlSearch.get('accessToken');

            if (!accessToken) {
                accessToken = accessToken2;
            }

            if (accessToken) {
                localStorage.setItem('auth_token', accessToken);
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

        if (localStorage.getItem('showModalMaintenance') === 'false') {
            setShowModalMaintenance(false);
        } else {
            setShowModalMaintenance(true);
        }
    }, []);

    const isAuthenticated = !!user;

    console.log('isAuthenticated', isAuthenticated, user);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser }}>
            {true && showModalMaintenance ? <>
                {/* Modal */}
                <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-90 z-50">
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="bg-white rounded-lg shadow-lg p-4 relative">
                            <FontAwesomeIcon icon={faClose} width={24} height={24} className="absolute top-4 right-4 text-gray-400 cursor-pointer" onClick={() => {
                                localStorage.setItem('showModalMaintenance', false);
                                setShowModalMaintenance(false);
                            }} />
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Maintenance en cours
                                </h2>
                                <p className="text-gray-600">
                                    Vous pourriez rencontrer des problèmes de connexion ou d'affichage. <br/>
                                    Merci de votre compréhension.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </> : null}
            {children}
        </AuthContext.Provider>
    );
};
