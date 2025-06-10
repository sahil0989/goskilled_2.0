import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Courses() {

    const { user } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogin = () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                navigate("/auth/login")
            }
        }
        handleLogin()
    }, [user, navigate]);

    return <>
        <div
            className="flex items-center justify-center"
            style={{ height: "calc(100vh - 80.8px)" }}
        >
            <div className="font-bold text-4xl">Coming Soon</div>
        </div>
    </>;
}
