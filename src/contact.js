import React from 'react';
import './styles.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">📞 Контакты</h1>
      <p className="contact-description">
        На нашем <a href="https://t.me/swelabs" className="social-link" target="_blank" rel="noopener noreferrer">Telegram канале</a> вы найдете всю информацию о разработке и сможете участвовать в тестировании.
      </p>
      <p className="contact-description">
        На нашем <a href="https://www.tiktok.com/@your_tiktok" className="social-link" target="_blank" rel="noopener noreferrer">TikTok</a> вы найдете увлекательный контент, связанный с проектом.
      </p>
    </div>
  );
};

export default Contact;
