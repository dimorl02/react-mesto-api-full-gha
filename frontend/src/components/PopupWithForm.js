import React from 'react';
import cross from '../images/popup-close.svg'
function PopupWithForm({ name, title, children, isOpen, onClose, onSubmit, onOverlayClick }) {
    return (
        <section className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`} onClick={onOverlayClick}>
            <div className="popup__container" >
                <h2 className="popup__title" >{title}</h2>
                <form className={`popup__form popup__form_type_${name}`} name={name} onSubmit={onSubmit}>
                    <fieldset className="popup__set">
                        {children}
                        <button className="popup__save-button">Сохранить</button>
                    </fieldset>
                </form>
                <button
                    className="popup__close-button" type="button" onClick={onClose}><img src={cross}
                        alt="Кнопка закрытия формы" className="popup__cross" onClick={onClose}/>
                </button>
            </div>
        </section>
    );
}

export default PopupWithForm;