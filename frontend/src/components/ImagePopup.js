import React from 'react';
import cross from '../images/popup-close.svg'
function ImagePopup({ card, onClose, isOpen, onOverlayClick}) {
    return (
        <section className={`popup popup_type_image ${isOpen ? "popup_opened" : ""}`} onClick={onOverlayClick}>
            <div className="popup__block" id="image-popup__block">
                <figure className="popup__figure" >
                    <img className="popup__image" src={card.link} alt={card.name} />
                    <figcaption className="popup__name">{card?.name}</figcaption>
                </figure>

                <button type="button" className="popup__close-button" id="image-popup__close-button"><img
                    src={cross} alt="Кнопка закрытия формы"
                    className="popup__cross" onClick={onClose} /></button>
            </div>
        </section>
    );
}

export default ImagePopup;