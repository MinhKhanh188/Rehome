// front-end/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


function App() {
    const location = useLocation();
    const showHeader = location.pathname !== '/login' && location.pathname !== '/signup';
    const showFooter = location.pathname === '/';

    return (
        <>
            {showHeader}
            <Routes>

            </Routes>
            {showFooter}
        </>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;