// front-end/src/components/pages/general/PleaseLoginFirst.js
import React from "react";
import { useNavigate } from "react-router-dom";

const PleaseLoginFirst = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <div>
            <h1>Re-Home rất xin lỗi quý khách vì sự bất tiện này, xin quý khách vui lòng đăng nhập trước</h1>
            <button onClick={handleLoginRedirect}>Đăng nhập</button>
        </div>
    );
};

export default PleaseLoginFirst;
