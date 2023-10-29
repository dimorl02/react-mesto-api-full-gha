import React from "react";
import { useState, useEffect } from 'react';
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
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState({
        status: false,
        text: "",
      })
    const [userEmail, setUserEmail] = useState("");
    const [cards, setCards] = useState([]);
    useEffect(() => {
        Promise.all([api.getUserInfoApi(), api.getInitialCards()])
            .then(([resUser, resCard]) => {
                setCurrentUser(resUser);

                setCards(resCard);
            })
            .catch((error) => alert(`Произошла ошибка ${error}`));
    }, []);

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    

    const navigate = useNavigate();
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
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.handleLikeApi(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
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

    function tokenCheck(){
        const jwt = localStorage.getItem('jwt');
        if(jwt){
          auth.getContent(jwt)
            .then((res) => {
              setLoggedIn(true);
              setUserEmail(res.data.email);
              navigate("/", {replace: true});
            })
            .catch((err) => {
              console.log(err);
            })
        }
    }
    function handleLogin(data) {
        console.log("login data:", data)
        auth.authorizeUser(data.email, data.password)
          .then((res)=>{
            setMessage({
                status: true,
                text: "Вы успешно авторизовались!",
              });
            localStorage.setItem("jwt", res.token);
            setLoggedIn(true);
            navigate('/', {replace: true})
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
    
      function handleRegister(data){
        auth.registerUser(data.email, data.password)
          .then(()=>{
            
            setMessage({
                status: true,
                text: "Вы успешно зарегистрировались!",
              });
            navigate('/sign-in', {replace: true})
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

      useEffect(()=>{
        tokenCheck();
      }, [])

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header signOut={logOut} userEmail={userEmail} />
                <Routes>
                    <Route path="/sign-up" element={<Register title="Регистрация" name="register" handleRegister={handleRegister}/>} />
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
                <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} message={message}/>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
