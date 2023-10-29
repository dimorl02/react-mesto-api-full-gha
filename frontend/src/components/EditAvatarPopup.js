import { useRef, useEffect } from "react";
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onUpdateAvatar, ...commonProps }) {
  const avatarLink = useRef();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateAvatar(avatarLink.current.value);
  }

  useEffect(() => {
    if (!isOpen) {
      avatarLink.current.value = '';
    }
  }, [isOpen])
  
  return (
    <PopupWithForm
      title="Обновить аватар"
      name="edit-avatar"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      {...commonProps}
    >
      <div className="popup__error-container">
        <input
          ref={avatarLink}
          className="popup__text"
          name="avatar"
          id="edit-avatar"
          type="url"
          placeholder="Ссылка на картинку"
          required
          autoComplete="off"
        />
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;