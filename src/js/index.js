import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetch.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener(
  'input',
  debounce(onInputFieldChange, DEBOUNCE_DELAY)
);

function onInputFieldChange(e) {
  const value = e.target.value.trim();

  if (value === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(data => {
      changeInterface(data);
    })
    .catch(e => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    });
}

function changeInterface(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countries.length >= 2) {
    refs.countryList.innerHTML = '';
    const markup = countries
      .map(({ name, flags }) => {
        return getCountryListMarkup(flags.svg, name);
      })
      .join('');

    refs.countryList.insertAdjacentHTML('beforeend', markup);
    return;
  }

  if (countries.length === 1) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    const { name, capital, population, flags, languages } = countries[0];

    const markup = getCountryInfoMarkup(
      flags.svg,
      name,
      capital,
      population,
      languages
    );

    refs.countryInfo.insertAdjacentHTML('beforeend', markup);
    return;
  }
}

function getCountryListMarkup(flag, name) {
  return `<li class="country"> 
        <img src="${flag}" alt="Country flag" width=25px height=auto>
    <p class="country-name">${name.official}</p></li>`;
}

function getCountryInfoMarkup(flag, name, capital, population, language) {
  const languages = Object.values(language).join(', ');
  return `<p class="country"> 
        <img src="${flag}" alt="Country flag" width=25px height=auto>
    <span class="country-name info">${name.official}</span></p>
  <ul>
        <li class="country-details"><span class="detail-bold">Capital:</span> ${capital}</li>
        <li class="country-details"><span class="detail-bold">Population:</span> ${population}</li>
        <li class="country-details"><span class="detail-bold">Languages:</span> ${languages}</li>
      </ul>`;
}
