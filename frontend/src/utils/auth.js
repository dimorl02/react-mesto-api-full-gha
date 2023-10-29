export const BASE_URL = 'https://auth.nomoreparties.co';

function checkResponseValidity(res) {
    if (res.ok) {
      return res.json();
    } 
    return Promise.reject(`Ошибка: ${res.status}`);
  };


export function registerUser(email, password) {
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
  
  export function authorizeUser(email, password) {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => checkResponseValidity(res))
      .then((data) => {
        if (data.token) {
          const token = data.token;
          localStorage.setItem('jwt', token);
          return token;
        };
      })
  };

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => res.json())
  .then(data => data)
}

export function getContent(token) {
    return fetch(`${BASE_URL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => checkResponseValidity(res))
      .then(data => data)
  };