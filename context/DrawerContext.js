'use client';

import React, { createContext, useState } from 'react';

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (name) => {
        if (isDrawerOpen === name) {
            return setIsDrawerOpen(false);
        } else {
            return setIsDrawerOpen(name);
        }
    };

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, toggleDrawer }}>
            {children}
        </DrawerContext.Provider>
    );
};
