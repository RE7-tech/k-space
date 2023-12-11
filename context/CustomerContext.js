'use client';

import React, { createContext, useState } from 'react';

// Create the customer context
export const CustomerContext = createContext();

// Create the customer provider component
export const CustomerProvider = ({ children }) => {
    // State to store customer data
    const [customer, setCustomer] = useState(null);

    // Function to update the customer data

    // Value object to be passed to consumers
    const value = {
        customer,
        setCustomer,
    };

    // Render the provider with the provided children
    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
};
