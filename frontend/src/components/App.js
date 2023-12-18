import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import ImagePopup from "./ImagePopup";
import Header from "./Header.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import Main from "./Main.js";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/Api";

import * as auth from "../utils/auth";

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
    cohort: "",
  });
  const token = localStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(token ? true : false);
  const [message, setMessage] = useState({
    status: false,
    text: "",
  });
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
    loggedIn &&
      Promise.all([api.getRealUserInfo(), api.getInitialCards()])
        .then(([resUser, cards]) => {
          setCurrentUser(resUser);
          setCards(cards.data);
          console.log(cards);
          console.log(resUser);
        })
        .catch((err) => console.log(err));
  }, [loggedIn]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    console.log(jwt);
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.email);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Токен не передан или передан не в том формате");
          }
          console.log("401 — Переданный токен некорректен");
        });
    }
  }, [navigate]);

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
    setIsInfoTooltipOpen(false);
  }

  function handlePopupOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    (isLiked ? api.removeLike(card._id) : api.addLike(card._id, true))
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === newCard.data._id ? newCard.data : c))
        );
      })
      .catch((err) => console.log(err));
  }

  const handleCardDelete = (card) => {
    api
      .removeCard(card._id)
      .then((res) => {
        console.log(res);
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status);
        alert(`Ошибка удаления карточки:\n ${err.status}\n ${err.text}`);
      });
  };

  function handleUpdateUser(objUserInfo) {
    api
      .editProfileUserInfo(objUserInfo)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status);
        alert(
          `Ошибка обновления данных пользователя:\n ${err.status}\n ${err.text}`
        );
      });
  }

  function handleUpdateAvatar(newAvatar) {
    console.log(newAvatar);
    api
      .updateProfileUserAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }

  function handleAddPlace(card) {
    api
      .addNewCard(card)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err.status);
        alert(`Ошибка добавления карточки:\n ${err.status}\n ${err.text}`);
      });
  }

  function handleLogin(data) {
    console.log();
    auth
      .login(data.email, data.password)
      .then((res) => {
        setMessage({
          status: true,
          text: "Вы успешно авторизовались!",
        });
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        navigate("/", { replace: true });
        setUserEmail(data.email);
        setIsInfoTooltipOpen(true);
      })
      .catch(() => {
        setMessage({
          status: false,
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        });
        setIsInfoTooltipOpen(true);
      });
  }

  function handleRegister(data) {
    auth
      .register(data.email, data.password)
      .then(() => {
        setMessage({
          status: true,
          text: "Вы успешно зарегистрировались!",
        });
        navigate("/sign-in", { replace: true });
        setIsInfoTooltipOpen(true);
      })
      .catch(() => {
        setMessage({
          status: false,
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        });
        setIsInfoTooltipOpen(true);
      });
  }

  function logOut() {
    localStorage.removeItem("jwt");
    navigate("/sign-in");
    setLoggedIn(false);
    setUserEmail("");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header signOut={logOut} userEmail={userEmail} />
        <Routes>
          <Route
            path="/sign-up"
            element={
              <Register
                title="Регистрация"
                name="register"
                handleRegister={handleRegister}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login title="Вход" name="login" handleLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                component={Main}
                loggedIn={loggedIn}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onDeleteClick={handleCardDelete}
              />
            }
          />
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
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          message={message}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
