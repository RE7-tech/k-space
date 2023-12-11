'use client';

import { useContext } from 'react';
import { CustomerContext } from '@/context/CustomerContext';
import useAuth from './useAuth';

export default function useCustomer () {
    const { customer, setCustomer } = useContext(CustomerContext);
    const { user, setUser, login, logout } = useAuth();

    console.log('useCustomer', user);

    if (user) {
        if (user?.customer) {
            setCustomer(user?.customer);
        }
    }

    return {
        customer,
        setCustomer
    };
}