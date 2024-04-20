import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoginAPI from '../services/LoginAPI'
import {jwtDecode} from 'jwt-decode';
export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            decodeToken(token);
        }
    }, []);

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            console.log(decoded);
            setUser({
                username: decoded.username,
                isAdmin: decoded.isAdmin === 1,
                id: decoded.id
            });
        } catch (error) {
            console.error("Failed to decode token: ", error);
            logout(); 
        }
    };

    const login = (username, password) => {
        LoginAPI.login(username, password).then(data => {
            if (data.token) { 
                localStorage.setItem('token', data.token); // Store the token
                decodeToken(data.token);
            }
        }).catch(error => {
            console.error('Login failed:', error.message);
            logout(); // Ensure clean state on failure
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContextProvider;
