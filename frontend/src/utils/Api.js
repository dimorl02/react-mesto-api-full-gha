import settingsApi from './constants.js'
class Api {
    constructor(options) {
        this._url = options.url;
        this._headers = options.headers;
        this._authorization = options.headers['authorization'];
    }

    _checkResponseValidity(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    };

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            headers: {
                method: 'GET',
                authorization: this._authorization
            },
        })
            .then(res => this._checkResponseValidity(res))
    }

    addCardApi(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link,
            }),
        })
            .then(res => this._checkResponseValidity(res))
    };

    getUserInfoApi() {
        return fetch(`${this._url}/users/me`, {
            headers: {
                method: 'GET',
                authorization: this._authorization
            },
        })
            .then(res => this._checkResponseValidity(res))
    }

    setUserInfoApi(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about,
            }),
        })
            .then(res => this._checkResponseValidity(res))
    }

    setUserAvatarApi(link) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: link
            }),
        })
            .then(res => this._checkResponseValidity(res))
    }

    deleteCardApi(cardId) {
        return fetch(`${this._url}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(res => this._checkResponseValidity(res))
    }

    likeCardApi(cardId) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: this._headers,
        })
            .then(res => this._checkResponseValidity(res))
    }

    dislikeCardApi(cardId) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: this._headers,
        })
            .then(res => this._checkResponseValidity(res))
    }

    handleLikeApi(cardId, isLiked) {
        if (isLiked) {
          return this.likeCardApi(cardId);
        } else {
          return this.dislikeCardApi(cardId);
        }
      }
}

export const api = new Api(settingsApi);