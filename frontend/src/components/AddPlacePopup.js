import { useState, useEffect } from "react";
import PopupWithForm from './PopupWithForm';
function AddPlacePopup({ isOpen, onAddPlace, ...commonProps }) {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const handleChangePlace = (evt) => {
        setName(evt.target.value);
    }

    const handleChangeLink = (evt) => {
        setLink(evt.target.value);
    }

    const handleAddPlaceSubmit = (evt) => {
        evt.preventDefault();
        onAddPlace({ name, link });
    }

    /**Инициализация инпутов при закрытии попапа*/
    useEffect(() => {
        if (!isOpen) {
            setName('');
            setLink('');
        } 
    }, [isOpen])

    return (
        <PopupWithForm
            title="Новое место"
            name="add-place"
            isOpen={isOpen}
            onSubmit={handleAddPlaceSubmit}
            {...commonProps}

        >
            <div className="popup__error-container">
                <input
                    className='popup__text'
                    name="name"
                    id="place"
                    type="text"
                    placeholder="Название"
                    value={name}
                    minLength="2"
                    maxLength="30"
                    required
                    onInput={handleChangePlace}
                />
            </div>
            <div className="popup__error-container">
                <input
                    className="popup__text"
                    name="link"
                    id="link"
                    type="url"
                    placeholder="Ссылка на картинку"
                    value={link}
                    minLength="2"
                    maxLength="200"
                    required
                    onInput={handleChangeLink}
                />
            </div>
        </PopupWithForm>
    );
}

export default AddPlacePopup;