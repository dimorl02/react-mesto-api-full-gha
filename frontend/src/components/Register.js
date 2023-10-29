import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function Register({ name, title, handleRegister }) {
    const [formValue, setFormValue] = useState({
        email: '',
        password: '',
    })

    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        handleRegister(formValue)
        console.log(formValue)
    }

    return (
        <section className="login" >
            <div className="login__container">
                <h2 className="login__title" >{title}</h2>
                <form className={`login__form popup__form_type_${name}`} name={name} onSubmit={handleSubmit}>
                    <fieldset className="login__set">
                        <div className="login__error-container">
                            <input
                                className="login__text"
                                name="email"
                                id="register-email"
                                type="text" placeholder="Email"
                                minLength="2"
                                maxLength="40"
                                required
                                autoComplete="off"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="login__error-container">
                            <input
                                className="login__text"
                                name="password"
                                id="register-password"
                                type="password" placeholder="Password"
                                minLength="2"
                                maxLength="200"
                                required
                                autoComplete="off"
                                onChange={handleChange}
                            />
                        </div>
                        <button className="login__save-button">Зарегистрироваться</button>
                    </fieldset>
                </form>
                <Link to="/sign-in" className="login__link">
                    Уже зарегистрированы? Войти
                </Link>
            </div>
        </section>
    );
}

export default Register;