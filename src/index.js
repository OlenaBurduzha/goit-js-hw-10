import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector("#search-box");
const list = document.querySelector(".country-list");
const div = document.querySelector(".country-info");

let searchCountryName = '';

input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function clearAll() {
  list.innerHTML = '';
  div.innerHTML = '';
};

function onInput() {
  clearAll();
    searchCountryName = input.value.trim();
    if (searchCountryName === '') {
        clearAll();
        return;
    } else fetchCountries(searchCountryName).
      then(countryNames => {
        if (countryNames.length < 2) {
            createCountryCard(countryNames);
        } else if (countryNames.length < 10 && countryNames.length > 1) {
            createCountriesList(countryNames);
        } else {
            clearAll();
            Notify.info("Too many matches found. Please enter a more specific name.");
        };
    }).catch(() => {
      clearAll();
      Notify.failure("Oops, there is no country with that name");
    });
};

function createCountryCard(country) {
    clearAll();
    const  newCountry= country[0];
    const markup = `<div class="country-card">
        <div class="country-card--header">
            <img src="${newCountry.flags.svg}" alt="Country flag" width="50", height="30">
            <h2 class="country-card--name"> ${newCountry.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${newCountry.capital}</span></p>
            <p class="country-card--field">Population: <span class="country-value">${newCountry.population}</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(newCountry.languages).join(',')}</span></p>
    </div>`
    div.innerHTML = markup;
};

function createCountriesList(country) {
    clearAll();
    const countryList = country.map((newCountry) => 
        `<li class="country-list--item">
            <img src="${newCountry.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${newCountry.name.official}</span>
        </li>`)
        .join("");
    list.insertAdjacentHTML('beforeend', countryList);
};

