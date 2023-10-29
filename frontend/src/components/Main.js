import React from "react";
import Card from './Card';
import pen from '../images/profile-pen.svg';
import plus from '../images/profile-plus.svg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Footer from './Footer.js'
function Main({ cards, onEditProfile, onEditAvatar, onAddPlace, onCardClick, onCardLike, onDeleteClick }) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <>
            <main className="content"
            >
                <section className="profile">
                    <div className="profile__avatar" onClick={onEditAvatar}>
                        <img src={currentUser.avatar} alt="Аватар пользователя" className="profile__image" />
                    </div>
                    <div className="profile__info">
                        <div className="profile__author">
                            <h1 className="profile__name">{currentUser.name}</h1>
                            <p className="profile__brief">{currentUser.about}</p>
                        </div>
                        <button type="button" className="profile__edit-button">
                            <img src={pen} alt="Кнопка редактирования"
                                className="profile__pen" onClick={onEditProfile} />
                        </button>
                    </div>
                    <button type="button" className="profile__add-button" onClick={onAddPlace}>
                        <img src={plus} alt="Кнопка добавления" className="profile__plus" />
                    </button>
                </section>

                <section className="cards">
                    {cards.map((card) => (
                        <Card card={card} onCardClick={onCardClick} key={card._id} onCardLike={onCardLike} onDeleteClick={onDeleteClick} />
                    ))}
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Main;