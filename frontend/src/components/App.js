import React from "react";
import { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import ProtectedRouteElement from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import ImagePopup from './ImagePopup';
import Header from './Header.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import Main from './Main.js'

import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';

import * as auth from '../utils/auth';

function App() {
    const [currentUser, setCurrentUser] = useState({
        "name": '',
        "about": '',
        "avatar": '',
        "_id": '',
        "cohort": ''
    });
    const token = localStorage.getItem('token');
    const [loggedIn, setLoggedIn] = useState(token ? true : false);
    const [message, setMessage] = useState({
        status: false,
        text: "",
    })
    const [userEmail, setUserEmail] = useState("");
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isImagePopupOpen, setImagePopupOpen] = useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});

    useEffect(() => {
        if (loggedIn) {
          Promise.all([api.getUserInfoApi(), api.getInitialCards()])
            .then(([resUser, resCard]) => {
              setCurrentUser(resUser);
              setCards(resCard);
            })
            .catch((err) => console.log(err))
        }
      }, [loggedIn]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            auth.checkToken(token)
                .then((res) => {
                    api.setToken(token);
                    setUserEmail(res.email)
                    setLoggedIn(true);
                    navigate('/', { replace: true })
                    console.log(resCard);
                    console.log(resUser)
                })
                .catch((err) => console.log(err))
        }
    });


    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setImagePopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setImagePopupOpen(false);
        setSelectedCard({});
        setIsInfoTooltipOpen(false)
    }

    function handlePopupOverlayClick(evt) {
        if (evt.target === evt.currentTarget) {
            closeAllPopups();
        }
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i === currentUser._id);
        api.handleLikeApi(card._id, !isLiked)
          .then((newCard) => {
            const newCardsList = cards.map(c => {
              if (c._id === newCard._id) {
                return newCard;
              }
              return c;
            });
            setCards(newCardsList)
          })
          .catch(err => {
            console.log(err.status);
            alert(`Ошибка при постановке 'Мне нравится':\n ${err.status}\n ${err.text}`);
        });
    }

    const handleCardDelete = (card) => {
        api.deleteCardApi(card._id)
            .then(res => {
                console.log(res);
                setCards((state) => state.filter((c) => c._id !== card._id));
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка удаления карточки:\n ${err.status}\n ${err.text}`);
            })
    }

    function handleUpdateUser(objUserInfo) {
        api.setUserInfoApi(objUserInfo)
            .then(updatedUser => {
                setCurrentUser(updatedUser);
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка обновления данных пользователя:\n ${err.status}\n ${err.text}`)
            })
    }

    function handleUpdateAvatar(link) {
        api.setUserAvatarApi(link)
            .then(updatedUser => {
                setCurrentUser(updatedUser);
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка обновления аватара пользователя:\n ${err.status}\n ${err.text}`)
            })
    }

    function handleAddPlace(card) {
        api.addCardApi(card)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка добавления карточки:\n ${err.status}\n ${err.text}`);
            })
    }


    function handleLogin(data) {
        auth.authorizeUser(data.email, data.password)
            .then((res) => {
                setMessage({
                    status: true,
                    text: "Вы успешно авторизовались!",
                });
                localStorage.setItem("jwt", res.token);
                api.setToken(res.token);
                setLoggedIn(true);
                navigate('/', { replace: true })
                setUserEmail(data.email)
                setIsInfoTooltipOpen(true);
            })
            .catch(() => {
                setMessage({
                    status: false,
                    text: "Что-то пошло не так! Попробуйте ещё раз.",
                });
                setIsInfoTooltipOpen(true)
            })
    }

    function handleRegister(data) {
        auth.registerUser(data.email, data.password)
            .then(() => {

                setMessage({
                    status: true,
                    text: "Вы успешно зарегистрировались!",
                });
                navigate('/sign-in', { replace: true })
                setIsInfoTooltipOpen(true)
            })
            .catch(() => {
                setMessage({
                    status: false,
                    text: "Что-то пошло не так! Попробуйте ещё раз.",
                });
                setIsInfoTooltipOpen(true)
            })
    }

    function logOut() {
        localStorage.removeItem('jwt');
        navigate('/sign-in');
        setLoggedIn(false);
        setUserEmail('');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header signOut={logOut} userEmail={userEmail} />
                <Routes>
                    <Route path="/sign-up" element={<Register title="Регистрация" name="register" handleRegister={handleRegister} />} />
                    <Route path="/sign-in" element={<Login title="Вход" name="login" handleLogin={handleLogin} />} />
                    <Route path="/" element={
                        <ProtectedRouteElement
                            component={Main}
                            loggedIn={loggedIn}
                            cards={cards}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onDeleteClick={handleCardDelete} />
                    } />
                    <Route path="*" element={<Navigate to="/sign-in" replace />} />

                </Routes>

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    onOverlayClick={handlePopupOverlayClick}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlace}
                    onOverlayClick={handlePopupOverlayClick}
                />

                <ImagePopup
                    card={selectedCard}
                    isOpen={isImagePopupOpen}
                    onClose={closeAllPopups}
                    onOverlayClick={handlePopupOverlayClick}
                ></ImagePopup>

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    onOverlayClick={handlePopupOverlayClick}
                />
                <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} message={message} />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
