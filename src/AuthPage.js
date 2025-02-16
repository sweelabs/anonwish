import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './styles.css'; // Импорт вашего CSS файла
import './Auth.css'; // Импорт вашего CSS файла
import { useNavigate } from 'react-router-dom';

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
      console.error('Ошибка при авторизации через Google:', error);
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
      console.error('Ошибка при входе с логином и паролем:', error);
      if (error.code === 'auth/invalid-email') {
        setError('Неверный формат электронной почты');
      } else if (error.code === 'auth/user-not-found') {
        setError('Пользователь с таким email не найден');
      } else if (error.code === 'auth/wrong-password') {
        setError('Неверный пароль');
      } else {
        setError('Ошибка при входе: ' + error.message);
      }
    }
  };

  const handleEmailPasswordRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      setError('');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Этот email уже используется');
      } else {
        setError('Ошибка при регистрации: ' + error.message);
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Неверный формат электронной почты');
      return;
    }
    if (isLogin) {
      handleEmailPasswordLogin();
    } else {
      handleEmailPasswordRegister();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Войти' : 'Зарегистрироваться'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
