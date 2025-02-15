import React, { useState, useEffect } from 'react';
import { addData, fetchData, deleteData, auth, db } from './firebase';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import './styles.css';

const MessageBoard = () => {
  const [message, setMessage] = useState('');
  const [wallet, setWallet] = useState('');
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cooldown, setCooldown] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUserRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      }
    };

    loadUserRole();
  }, [auth.currentUser]);

  useEffect(() => {
    const loadWishes = async () => {
      const wishesFromDB = await fetchData('wishes');
      setWishes(wishesFromDB);
      setLoading(false);
    };
    loadWishes();
  }, [auth.currentUser]);

  useEffect(() => {
    const cooldownTime = localStorage.getItem(`cooldown_${auth.currentUser?.uid}`);
    if (cooldownTime) {
      const remainingTime = Math.max(0, Number(cooldownTime) - Date.now());
      if (remainingTime > 0) {
        setCooldown(remainingTime);
      } else {
        localStorage.removeItem(`cooldown_${auth.currentUser?.uid}`);
      }
    }
  }, [auth.currentUser]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem(`cooldown_${auth.currentUser?.uid}`);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown, auth.currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message && wallet && auth.currentUser) {
      if (cooldown > 0) return;

      const newWish = {
        message,
        wallet,
        timestamp: new Date(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Аноним'
      };

      try {
        const addedWish = await addData('wishes', newWish);
        setWishes([addedWish, ...wishes]);

        const cooldownTime = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах
        localStorage.setItem(`cooldown_${auth.currentUser.uid}`, Date.now() + cooldownTime);
        setCooldown(cooldownTime);

        setMessage('');
        setWallet('');
      } catch (error) {
        console.error('Ошибка при добавлении желания:', error);
      }
    } else if (!auth.currentUser) {
      console.error('Пользователь не аутентифицирован.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData('wishes', id);
      setWishes(wishes.filter(wish => wish.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении желания:', error);
    }
  };

  const handleResetCooldown = () => {
    if (isAdmin) {
      localStorage.removeItem(`cooldown_${auth.currentUser.uid}`);
      setCooldown(0);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="message-board">
      <h2>Оставить желание</h2>
      {cooldown > 0 ? (
        <p className="cooldown-timer">Вы можете оставить следующее желание через {formatTime(cooldown)}</p>
      ) : (
        <form onSubmit={handleSubmit} className="wish-form">
          <div className="form-group">
            <label>Ваше желание:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength="500"
            />
          </div>
          <div className="form-group">
            <label>Криптокошелёк для получения:</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={cooldown > 0}>
            Отправить желание
          </button>
        </form>
      )}
      {isAdmin && auth.currentUser && (
        <button onClick={handleResetCooldown} className="reset-cooldown-button">
          Сбросить кулдаун
        </button>
      )}
      <div className="wishes">
        <h3>Ваши желания:</h3>
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : (
          wishes
            .filter(wish => wish.userId === auth.currentUser?.uid || isAdmin)
            .map((wish) => (
              <div key={wish.id} className="wish-item">
                <p><strong>Желание:</strong> {wish.message}</p>
                <p><strong>Кошелек:</strong> {wish.wallet}</p>
                <p><strong>Дата:</strong> {new Date(wish.timestamp.seconds * 1000).toLocaleString()}</p>
                {(auth.currentUser && auth.currentUser.uid === wish.userId) || isAdmin ? (
                  <button onClick={() => handleDelete(wish.id)} className="delete-button">Удалить</button>
                ) : null}
              </div>
            ))
        )}
      </div>
      <Link to="/wishlist" className="wish-list-link">Список желаний</Link>
    </div>
  );
};

export default MessageBoard;
