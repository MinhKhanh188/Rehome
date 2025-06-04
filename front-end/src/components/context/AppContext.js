// front-end/src/components/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { NAME_CONFIG } from '../../config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const storedProvince = localStorage.getItem(NAME_CONFIG.USER_PROVINCE);
    const [clientProvince, setClientProvince] = useState(() => {
        const stored = localStorage.getItem(NAME_CONFIG.USER_PROVINCE);
        if (stored) return stored;
        const defaultProvince = 'Hà Nội';
        localStorage.setItem(NAME_CONFIG.USER_PROVINCE, defaultProvince);
        return defaultProvince;
    });


    useEffect(() => {
        const syncProvince = () => {
            const province = localStorage.getItem(NAME_CONFIG.USER_PROVINCE);
            if (province && province !== clientProvince) {
                setClientProvince(province);
            }
        };
        window.addEventListener('storage', syncProvince);
        return () => window.removeEventListener('storage', syncProvince);
    }, [clientProvince]);



    const updateProvince = (province) => {
        setClientProvince(province);
        localStorage.setItem(NAME_CONFIG.USER_PROVINCE, province);
    };



    return (
        <AppContext.Provider value={{
            clientProvince,
            updateProvince
        }}>
            {children}
        </AppContext.Provider>
    );
};
