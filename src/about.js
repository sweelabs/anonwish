import React from 'react';
import './styles.css';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">🌟 О нас</h1>
      <p className="about-text">
        👉 Представь, что ты можешь просто написать своё желание… и кто-то может его исполнить.
      </p>
      <p className="about-text">
        🔗 Я создал сайт, где каждый может опубликовать свою мечту и прикрепить криптокошелёк.
      </p>
      <p className="about-text">
        ❓ А другие – отправить анонимный подарок, если захотят помочь.
      </p>
      <p className="about-text">
        🔥 Никаких посредников. Никаких комиссий. Просто добро в чистом виде.
      </p>
      <p className="about-text">
        📱 Ты можешь просто сканировать QR-код и отправить крипту за секунды.
      </p>
      <p className="about-text">
        🎮 А ещё тут есть геймификация! Люди будут вдохновлять друг друга и исполнять мечты.
      </p>
      <p className="about-text">
        💡 Как тебе идея? Напиши в комментариях, что бы ты добавил!
      </p>
      <p className="about-text">
        🚀 И да, если интересно – я буду держать вас в курсе разработки!
      </p>
      <div className="developer-info">
        <p>
          Меня зовут <span className="developer-name">swelabs</span>, и я разработчик этого сайта.
        </p>
        <p>
          Подписывайтесь на мой <a href="https://t.me/swelabs" className="tg-link" target="_blank" rel="noopener noreferrer">Telegram канал</a>, чтобы следить за процессом разработки и участвовать в тестировании!
        </p>
      </div>
    </div>
  );
};

export default About;
