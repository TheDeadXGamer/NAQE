import React, { useState } from 'react';
import { setCookie, checkLogin, saveFavorites, retrieveFavorites } from './AccountCookies';

const Login = ({ setIsLoggedIn , setCurrentView}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const handleLogin = () => {
        // Placeholder for login logic
        if (checkLogin(username, password)) {
            setIsLoggedIn(username);
            retrieveFavorites(username); // Retrieve favorites from localStorage
            setCurrentView('map'); // Redirect to map view on successful login
            alert(`Logged in as ${username}`);
        } else {
            alert('Invalid username or password');
        }
    };

    const handleCreateAccount = () => {
        // Set a cookie for the new account
        setCookie(username, password);
        alert(`Account created for ${username}`);
    };

    return (
        <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
            <h2>{isCreatingAccount ? 'Create Account' : 'Login'}</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: 'block', margin: '10px auto', width: '100%' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', margin: '10px auto', width: '100%' }}
            />
            {isCreatingAccount ? (
                <button onClick={handleCreateAccount} style={{ margin: '10px' }}>
                    Create Account
                </button>
            ) : (
                <button onClick={handleLogin} style={{ margin: '10px' }}>
                    Login
                </button>
            )}
            <button
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
                style={{ margin: '10px' }}
            >
                {isCreatingAccount ? 'Back to Login' : 'Create Account'}
            </button>
        </div>
    );
};

export default Login;