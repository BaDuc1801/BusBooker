import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const beUrl = import.meta.env.VITE_APP_BE_URL;

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            axios.get(`${beUrl}/users/infor`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    setUser(res.data);
                    setAuthenticated(true);
                })
                .catch(err => {
                    console.error('Error fetching user info:', err);
                    logout();
                });
        }
    }, [beUrl]);

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setAuthenticated(false);
    };

    const login = async (data) => {
        try {
            const res = await axios.post(`${beUrl}/users/login`, data);
            const token = res.data.accessToken;
            localStorage.setItem('accessToken', token);
            
            const userRes = await axios.get(`${beUrl}/users/infor`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userRes.data);
            setAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            setAuthenticated(false);
        }
    };

    // context lưu giá trị địa điểm đã chọn 
    const [originChoice, setOriginChoice] = useState(null)
    const [destiChoice, setDestiChoice] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    return (
        <UserContext.Provider value={{ user, authenticated, login, logout, originChoice, setOriginChoice, destiChoice, setDestiChoice, startTime, setStartTime, endTime, setEndTime }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
