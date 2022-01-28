// import { fetchGiantBomb } from './giantbomb.js';

const fetchGiantBomb = async () => {
  try {
    const response = await fetch(
      'https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/games/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json',
    );
    //https://www.giantbomb.com/api/characters/?api_key=[YOUR API KEY]
    // To pull more games paginate the url http://www.giantbomb.com/api/games/?api_key=[APIKEY]&format=json&field_list=name&page=2

    if (response.ok) {
      const { results } = await response.json();
      console.log(results);
      return results;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error);
  }
};

const fetchGiantBombCharacters = async () => {
  try {
    const response = await fetch(
      'https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/characters/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json',
    );
    //https://www.giantbomb.com/api/characters/?api_key=[YOUR API KEY]
    // To pull more games paginate the url http://www.giantbomb.com/api/games/?api_key=[APIKEY]&format=json&field_list=name&page=2

    if (response.ok) {
      const { results } = await response.json();
      console.log(results);
      return results;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error);
  }
};

// await fetchGiantBomb();

// Connect to Firebase

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlhr8a4-0-RiTZhok706mnO54kv2zWZ_E',
  authDomain: 'ga-test-project-d8949.firebaseapp.com',
  projectId: 'ga-test-project-d8949',
  storageBucket: 'ga-test-project-d8949.appspot.com',
  messagingSenderId: '261257422600',
  appId: '1:261257422600:web:80f12bb45a5e04806eeebd',
  databaseURL:
    'https://ga-test-project-d8949-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const gamesDatabase = ref(db, 'games');
const charactersDatabase = ref(db, 'characters');

console.log(gamesDatabase);

const sendGamesToDB = async () => {
  // use the push method to save data to the messages
  // https://firebase.google.com/docs/reference/js/database#push

  const games = await fetchGiantBomb();

  games.forEach((game) => {
    push(gamesDatabase, {
      name: game.name,
      platforms: game.platforms,
      description: game.description,
      date: game.original_release_date,
      guid: game.guid,
      id: game.id,
      image: game.image.small_url,
      giantbombLink: game.site_detail_url,
    });
  });
};
const sendCharactersToDB = async () => {
  // use the push method to save data to the messages
  // https://firebase.google.com/docs/reference/js/database#push

  const characters = await fetchGiantBombCharacters();

  characters.forEach((character) => {
    push(charactersDatabase, {
      name: character.name,
      real_name: character.real_name,
      description: character.description,
      birthday: character.birthday,
      guid: character.guid,
      id: character.id,
      gender: character.gender,
      image: character.image.small_url,
    });
  });
};

// Show all games in the DB
//Event
window.addEventListener('DOMContentLoaded', getPostsFromDb);

//Execution
function getPostsFromDb() {
  //  https:firebase.google.com/docs/reference/js/database#onvalue
  onValue(gamesDatabase, (snapShot) => {
    const savedGames = snapShot.val();
    renderGames(savedGames);
    // renderRandomGame(savedGames);
  });
}

function updateGameEntries(savedGames) {}

function renderGames(savedGames) {
  Object.entries(savedGames).forEach(([key, value]) => {
    const { name, guid, image } = value;

    renderGame({ key, name, guid, image });
  });
}

function renderGame({ key, name, guid, image }) {
  console.log(`${name}:${guid},image:${image}`);
}

// On click of pull games to the DB

document.getElementById('dbDump').addEventListener('click', sendGamesToDB);
document
  .getElementById('dbCharactersDump')
  .addEventListener('click', sendCharactersToDB);

// On click of Random Button show a game

document.getElementById('randomButton').addEventListener('click', randomButton);
// const gamesListElement = document.getElementById('gameName');

function randomButton() {
  clearSearchResult();
  onValue(gamesDatabase, (snapShot) => {
    const savedGames = snapShot.val();
    pickRandomGame(savedGames);
  });
}

// Render a random Game

const createElementTemplateWrapper = document.querySelector('#gameName');

function pickRandomGame(savedGames) {
  const gameValues = Object.values(savedGames);
  const singleGame = gameValues[Math.floor(Math.random() * gameValues.length)];
  const platforms = singleGame.platforms;

  const guid = singleGame.guid;
  const name = singleGame.name;

  const sectionElement = document.createElement('section');
  const h2Element = document.createElement('h2');
  const mainImg = document.createElement('img');

  h2Element.innerText = `Name: ${singleGame.name.toUpperCase()}`;
  mainImg.src = singleGame.image;

  sectionElement.appendChild(h2Element);
  sectionElement.appendChild(mainImg);

  createElementTemplateWrapper.appendChild(sectionElement);
}

function clearSearchResult() {
  createElementTemplateWrapper.innerHTML = '';
}

// Show a new character every day

function getCharacterOfTheDay() {
  onValue(charactersDatabase, (snapShot) => {
    const savedCharacter = snapShot.val();
    pickRandomCharacter(savedCharacter);
  });
}

const createCharacterTemplateWrapper =
  document.querySelector('#characterDayCtn');

function pickRandomCharacter(savedCharacter) {
  const characterValues = Object.values(savedCharacter);
  const singleCharacter =
    characterValues[Math.floor(Math.random() * characterValues.length)];

  const sectionElement = document.createElement('section');
  const h2Element = document.createElement('h2');
  const description = document.createElement('div');
  const birthday = document.createElement('p');
  h2Element.innerText = `${singleCharacter.name}`;
  birthday.innerText = `${singleCharacter.birthday}`;
  description.innerHTML = `${singleCharacter.description}`;
  sectionElement.appendChild(h2Element);
  sectionElement.appendChild(birthday);
  sectionElement.appendChild(description);

  createCharacterTemplateWrapper.appendChild(sectionElement);
}

// checks if one day has passed.
function hasOneDayPassed() {
  // get today's date. eg: "7/37/2007"
  var date = new Date().toLocaleDateString();

  // if there's a date in localstorage and it's equal to the above:
  // inferring a day has yet to pass since both dates are equal.
  if (localStorage.yourapp_date == date) return false;

  // this portion of logic occurs when a day has passed
  localStorage.yourapp_date = date;
  return true;
}

// some function which should run once a day
function runOncePerDay() {
  if (!hasOneDayPassed()) return false;

  // your code below
  getCharacterOfTheDay();
}

runOncePerDay();
getCharacterOfTheDay();

// Get Users birthday and match to Character
//
// Pull the date that is entered into the input / CREATE
//
const bdForm = document.querySelector('#birthday-form');
const birthday = document.querySelector('#birthday');
// Event
bdForm.addEventListener('submit', getPostFromTextArea);

// Execution
function getPostFromTextArea(event) {
  event.preventDefault();

  const userBirthday = birthday.value;
  console.log(userBirthday);
  matchBirthdays(userBirthday);

  birthday.value = '';
}

function matchBirthdays(userBirthday) {
  onValue(charactersDatabase, (snapShot) => {
    const savedCharacter = snapShot.val();
    const characterValues = Object.values(savedCharacter);
    const convertBirthday = userBirthday.toDateString();

    let result = characterValues.filter((obj) => {
      return obj.birthday === userBirthday;
    });
    console.log(convertBirthday);
  });
}
