import React from "react";
import logo from '../images/header-logo.svg';
import { Route, Link, Routes } from 'react-router-dom';
function Header({userEmail, signOut}) {
    return (
        <header className="header">
            <img src={logo} alt="Место" className="header__logo" />
            <Routes>
                <Route path="/sign-up" element={
                    <Link to={"/sign-in"} className="header__link">Войти</Link>} />
                <Route path="/sign-in" element={
                    <Link to={"/sign-up"} className="header__link">Регистрация</Link>} />
                <Route path="/" element={
                    <>
                        <div className="header__user-info">
                            <p className='header__user-email'>{userEmail}</p>
                            <button onClick={signOut} className="header__logout">Выйти</button>
                        </div>
                    </>
                } />
            </Routes>
        </header>
    )
}

export default Header;