const inputs = document.querySelectorAll('.cookies-app__input');

inputs.forEach((input) => {
  input.addEventListener('invalid', handleInvalid);
  input.addEventListener('input', handleResetInputCustomValidity);
});

function handleInvalid(e) {
  e.target.setCustomValidity('Veuillez remplir ce champ');
}
function handleResetInputCustomValidity(e) {
  e.target.setCustomValidity('');
}

const cookieForm = document.querySelector('.cookies-app__form');

cookieForm.addEventListener('submit', handleCookieForm);

function handleCookieForm(e) {
  e.preventDefault();
  createCookie();

  cookieForm.reset();
}

const cookiesList = document.querySelector('.cookies-app__list');

function createCookie() {
  const newCookie = {};

  inputs.forEach((input) => {
    const nameAttribute = input.getAttribute('name');
    newCookie[nameAttribute] = input.value.trim();
  });

  const cookiesArray = document.cookie.replace(/\s/g, '').split(';');
  const alreadyExistingCookie = cookiesArray.find(
    (cookie) => decodeURIComponent(cookie.split('=')[0]) === newCookie.name,
  );

  if (alreadyExistingCookie) {
    createToast({ name: newCookie.name, state: 'modifié', color: 'royalblue' });

    const modifiedCookie = document.querySelector(`[data-cookie=${newCookie.name}]`);

    modifiedCookie.querySelector('.cookies-app__cookie-value').textContent =
      `Valeur : ${newCookie.value}`;
  } else {
    createToast({ name: newCookie.name, state: 'crée', color: 'green' });

    if (!cookiesList.children.length) {
      cookiesList.appendChild(createCookieListItem(`${newCookie.name}=${newCookie.value}`));
    } else {
      cookiesList.insertBefore(
        createCookieListItem(`${encodeURIComponent(newCookie.name)}=${newCookie.value}`),
        cookiesList.firstChild,
      );
    }
  }

  document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};path=/;expires=${getCookieExpiration(7)}`;
}

function createCookieListItem(cookie) {
  const formatCookie = cookie.split('=');
  const cookiesListItem = document.createElement('li');
  cookiesListItem.className = 'cookies-app__cookie';
  cookiesListItem.setAttribute('data-cookie', decodeURIComponent(formatCookie[0]));

  cookiesListItem.innerHTML = `
    <p class="cookies-app__cookie-name"></p>
    <p class="cookies-app__cookie-value"></p>
    <button class="cookies-app__cookie-button">X</button>
  `;

  cookiesListItem.querySelector('.cookies-app__cookie-name').textContent =
    `Nom : ${decodeURIComponent(formatCookie[0])}`;
  cookiesListItem.querySelector('.cookies-app__cookie-value').textContent =
    `Valeur : ${decodeURIComponent(formatCookie[1])}`;

  cookiesListItem
    .querySelector('.cookies-app__cookie-button')
    .addEventListener('click', handleDeleteCookie);

  function handleDeleteCookie(e) {
    createToast({ name: formatCookie[0], state: 'supprimé', color: 'crimson' });

    document.cookie = `${formatCookie[0]}=; expires=${new Date(0)};path=/`;
    e.target.closest('.cookies-app__cookie').remove();
  }

  return cookiesListItem;
}

function getCookieExpiration(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
}
const toastContainer = document.querySelector('.toasts');

function createToast({ name, state, color }) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<p class="toast__name"></p>';
  toast.querySelector('.toast__name').textContent = `Cookie ${name} ${state}`;
  toast.style.backgroundColor = color;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

function displayCookies() {
  if (document.cookie) {
    const fragment = document.createDocumentFragment();

    const cookies = document.cookie.replace(/\s/g, '').split(';').reverse();

    cookies.forEach((cookie) => {
      fragment.appendChild(createCookieListItem(cookie));
    });
    cookiesList.appendChild(fragment);
  }
}

displayCookies();
