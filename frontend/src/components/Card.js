import React from 'react';
import heart from "../images/elements-heart.svg";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
function Card({ card, onCardClick, onCardLike, onDeleteClick }) {
    
    const handleClick = () => {
        onCardClick(card);
    }
    const handleLike = () => {
        onCardLike(card);
    }

    const handleDeleteClick = () => {
        onDeleteClick(card);
    }

    const currentUser = React.useContext(CurrentUserContext);
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = ( 
        `cards__like-button ${isLiked && 'cards__like-button_active'}` 
      );; 
    const isOwn = card.owner._id === currentUser._id;

    return (
        <li className="cards__card">
            <img className="cards__image" src={card.link} alt={`${card.name}`} onClick={handleClick} />
            <div className="cards__field">
                <h2 className="cards__name">{card.name}</h2>
                <div className="cards__like-container">
                    <button className={cardLikeButtonClassName} type="button" src={heart} onClick={handleLike} />
                    <span className="cards__like-counter">{card.likes.length}</span>
                </div>
            </div>
            {isOwn && <button className="cards__delete-button" type="button" onClick={handleDeleteClick}/>}
        </li>
    );
}

export default Card;