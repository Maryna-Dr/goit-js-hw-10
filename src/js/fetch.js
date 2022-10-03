import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages',
  });

  return fetch(
    `https://restcountries.com/v3.1/name/${name}?${searchParams}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(
        Notify.failure('Oops, there is no country with that name')
      );
    }
    return response.json();
  });
}
