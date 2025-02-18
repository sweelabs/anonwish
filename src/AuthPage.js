import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const googleProvider = new GoogleAuthProvider();

const AuthPage = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            navigate('/');
        } catch (error) {
            setError('Ошибка при авторизации через Google');
        }
    };

    const handleEmailPasswordLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setUser(auth.currentUser);
            setError('');
            navigate('/');
        } catch (error) {
            setError('Ошибка при входе');
        }
    };

    const handleEmailPasswordRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setUser(auth.currentUser);
            setError('');
            navigate('/');
        } catch (error) {
            setError('Ошибка при регистрации');
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Неверный формат email');
            return;
        }
        isLogin ? handleEmailPasswordLogin() : handleEmailPasswordRegister();
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>{isLogin ? 'Войти' : 'Регистрация'}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-container">
                        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-button">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
                <div className="toggle-auth">
                    <p onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}
                    </p>
                </div>
                <button onClick={handleGoogleLogin} className="google-auth-button">
                    Войти через Google
                </button>
            </div>
        </div>
    );
};

export default AuthPage;