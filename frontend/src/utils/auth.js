export const BASE_URL = 'https://api.mesto.dimorl02.nomoredomainsrocks.ru';

function checkResponseValidity(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};


export const registerUser = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(console.log(email, password))
    .then(res => checkResponseValidity(res));
};

export const authorizeUser = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "password": password,
      "email": email
    }),
  })
    .then((res) => {
      return checkResponseValidity(res);
    })
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      }
  })
      .then((res) => {
          return checkResponse(res);
      })
}

export const getContent =(token) => {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => checkResponseValidity(res))
    .then(data => data)
};