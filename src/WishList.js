import React, { useEffect, useState, useCallback } from 'react';
import { fetchData, deleteData, updateData } from './firebase';
import { auth, db } from './firebase';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import './WishList.css';

const WishList = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [editWallet, setEditWallet] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const getUserNickname = async (userId) => {
    if (!userId) return 'Аноним';

    if (auth.currentUser?.uid === userId && auth.currentUser.displayName) {
      return auth.currentUser.displayName;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data().nickname || 'Аноним' : 'Аноним';
    } catch (error) {
      console.error('Ошибка загрузки ника:', error);
      return 'Аноним';
    }
  };

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
  }, []);

  useEffect(() => {
    const loadWishes = () => {
      const unsubscribe = onSnapshot(collection(db, 'wishes'), (snapshot) => {
        const updatedWishes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          userName: 'Загрузка...'
        }));

        setWishes(updatedWishes);

        updatedWishes.forEach(async (wish, index) => {
          const userName = await getUserNickname(wish.userId);
          setWishes((prevWishes) => {
            const newWishes = [...prevWishes];
            newWishes[index] = { ...newWishes[index], userName };
            return newWishes;
          });
        });

        setLoading(false);
      });

      return () => unsubscribe();
    };

    loadWishes();
  }, []);

  const handleDelete = async (wishId) => {
    try {
      await deleteData('wishes', wishId);
      setWishes(wishes.filter((wish) => wish.id !== wishId));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const startEditing = (id, currentMessage, currentWallet) => {
    setEditId(id);
    setEditMessage(currentMessage);
    setEditWallet(currentWallet);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editMessage && editWallet && auth.currentUser && editId) {
      const updatedWish = {
        message: editMessage,
        wallet: editWallet,
        timestamp: new Date()
      };

      try {
        await updateData('wishes', editId, updatedWish);
        setWishes(wishes.map(wish => (wish.id === editId ? { ...wish, ...updatedWish } : wish)));
        setEditId(null);
        setEditMessage('');
        setEditWallet('');
      } catch (error) {
        console.error('Ошибка при редактировании желания:', error);
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="wish-container">
      <h2 className="wish-title">Список желаний</h2>
      <div className="wish-grid">
        {wishes.map((wish) => (
          <div key={wish.id} className="wish-card">
            <div className="card-header">
              <div className="user-info">
                <span className="user-avatar">{wish.userName?.[0]?.toUpperCase() || '👤'}</span>
                <span className="user-name">{wish.userName || 'Аноним'}</span>
              </div>
              {isAdmin && (
                <>
                  <button
                    onClick={() => startEditing(wish.id, wish.message, wish.wallet)}
                    className="edit-btn"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(wish.id)}
                    className="delete-btn"
                    title="Удалить"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
            <div className="card-body">
              <p className="wish-text">{wish.message}</p>
              <div className="wallet-info">
                <span>Кошелек: </span>
                <span className="wallet-address">{wish.wallet}</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="wish-date">
                {wish.timestamp?.seconds
                  ? new Date(wish.timestamp.seconds * 1000).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Неизвестная дата'}
              </span>
            </div>
          </div>
        ))}
      </div>
      {isAdmin && editId && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Редактировать желание</h3>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Желание:</label>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  required
                  maxLength="500"
                />
              </div>
              <div className="form-group">
                <label>Кошелек:</label>
                <input
                  type="text"
                  value={editWallet}
                  onChange={(e) => setEditWallet(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Сохранить изменения
              </button>
              <button onClick={() => setEditId(null)} className="cancel-button" type="button">Отмена</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishList;
