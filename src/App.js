import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';  // Изменено на HashRouter
import './styles.css';
import MessageBoard from './MessageBoard';
import WishList from './WishList';
import { auth } from './firebase';
import AuthPage from './AuthPage';
import AboutUs from './about'; // Импорт компонента AboutUs
import Contact from './contact'; // Импорт компонента Contact

const Home = () => (
  <div className="container">
    <div className="banner">
      <h1>🌟 Добро пожаловать на sweelabs.
        github.io</h1>
      <p>Представьте, что вы можете загадать желание и кто-то поможет ему сбыться.</p>
      <div className="buttons-container">
        <Link to="/wishlist" className="cta-button">Список желаний</Link>
        <Link to="/messages" className="learn-more-button">Оставить желание</Link>
      </div>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      localStorage.removeItem('user');
    }).catch((error) => {
      console.error('Ошибка при выходе:', error);
    });
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Главная</Link>
          <Link to="/about">О нас</Link>
          <Link to="/contact">Контакты</Link>
          {user ? (
            <>
              <Link to="/messages">Оставить желание</Link>
              <button onClick={handleLogout} className="logout-button">Выйти</button>
            </>
          ) : (
            <Link to="/auth">Войти</Link>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/messages" element={user ? <MessageBoard /> : <Navigate to="/auth" />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
