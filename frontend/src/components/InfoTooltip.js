import React from 'react';
import tick from '../images/popup-tick.svg'
import bigcross from '../images/popup-cross.svg'
import cross from '../images/popup-close.svg'
function InfoTooltip({isOpen, onClose, message}) {

  function handleOverlayClose(evt){
    if (evt.target.classList.contains('popup_opened')) {
      onClose();
    };
    if (evt.target.classList.contains('popup__close')) {
      onClose();
    };
  }

  return (
    <div className={`popup ${isOpen ? "popup popup_opened" : "popup"}`} onClick={handleOverlayClose}>
      <div className="popup__container">
        <img src={message.status ? tick : bigcross} className="popup__info-image" alt="регистрация прошла успешно"></img>
        <h2 className="popup__title popup__title_info">
          {message.text}
        </h2>
        <button
                    className="popup__close-button" type="button" onClick={onClose}><img src={cross}
                        alt="Кнопка закрытия формы" className="popup__cross" onClick={onClose}/>
                </button>
      </div>
    </div>
  );
}

export default InfoTooltip;