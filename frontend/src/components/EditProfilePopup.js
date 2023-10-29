import { useContext, useState, useEffect } from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup({ isOpen, onUpdateUser, ...commonProps }) {
    const currentUser = useContext(CurrentUserContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleEditName = (evt) => {
        setName(evt.target.value);
    }

    const handleEditAbout = (evt) => {
        setDescription(evt.target.value);
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onUpdateUser({
            name,
            about: description,
        });
    }

    useEffect(() => {
        if (!isOpen) {
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [isOpen, currentUser]);

    return (
        <PopupWithForm
            title="Редактировать профиль"
            name="edit-profile"
            isOpen={isOpen}
            onSubmit={handleSubmit}
            {...commonProps}
        >
            <div className="popup__error-container">
                <input
                    className="popup__text"
                    name="name"
                    id="name"
                    type="text" placeholder="Имя"
                    value={name}
                    minLength="2"
                    maxLength="40"
                    required
                    autoComplete="off"
                    onInput={handleEditName}
                />
            </div>
            <div className="popup__error-container">
                <input
                    className="popup__text"
                    name="about"
                    id="about"
                    type="text" placeholder="О себе"
                    value={description}
                    minLength="2"
                    maxLength="200"
                    required
                    autoComplete="off"
                    onInput={handleEditAbout}
                />
            </div>
        </PopupWithForm>
    );
}

export default EditProfilePopup;