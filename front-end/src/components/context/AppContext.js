// front-end/src/components/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { NAME_CONFIG } from '../../config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [clientProvince, setClientProvince] = useState('Hà Nội');

    useEffect(() => {
        const storedProvince = localStorage.getItem(NAME_CONFIG.USER_PROVINCE);

        if (storedProvince) {
            setClientProvince(storedProvince);
        } else {
            // Set default province and store it
            const defaultProvince = 'Hà Nội';
            setClientProvince(defaultProvince);
            localStorage.setItem(NAME_CONFIG.USER_PROVINCE, defaultProvince);
        }
    }, []);


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
