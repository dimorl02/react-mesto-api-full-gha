// Cоздание класса утилиты Api, для описания работы логики, обращения к Api
class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  // Формирую запрос на сервер, если прошел не удачно, возвращаем ошибку!
  _handleSendingRequest(res) {
    if (res.ok) {
      return Promise.resolve(res.json());
    }

    // Если ошибка пришла, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Метод загрузки информации о пользователе с сервера
  async getRealUserInfo() {
    const response = await fetch(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    return this._handleSendingRequest(response);
  }

  // Метод загрузки карточек с сервера
  async getInitialCards() {
    const response = await fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    return this._handleSendingRequest(response);
  }

  // Метод редактирование профиля
  async editProfileUserInfo(data) {
    const response = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    });
    return this._handleSendingRequest(response);
  }

  // Метод добавления новой карточки с сервера
  async addNewCard(data) {
    const response = await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(data),
    });
    return this._handleSendingRequest(response);
  }

  // Метод постановки лайка карточки
  async addLike(cardId) {
    const response = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    return this._handleSendingRequest(response);
  }

  // Метод удаления карточки
  async removeCard(cardId) {
    const response = await fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    return this._handleSendingRequest(response);
  }

  // Метод постановки и снятия лайка с карточки
  async removeLike(cardId) {
    const response = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    return this._handleSendingRequest(response);
  }

  // Метод обновления аватара пользователя
  async updateProfileUserAvatar(avatar) {
    const response = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
    return this._handleSendingRequest(response);
  }
}

const api = new Api({
  baseUrl: "http://localhost:3000",
});

export default api;
