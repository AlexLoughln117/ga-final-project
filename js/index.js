import {
  fetchGiantBomb,
  fetchGiantBombCharacters,
  fetchMoreDetails,
  searchGiantBomb,
} from './giantbomb.js';

// Connect to Firebase

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  child,
  orderByChild,
  orderByValue,
  limitToLast,
  equalTo,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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
const gameResultsDB = ref(db, 'gameResults');

// FIRESTORE DATABASE

const firebasedb = getFirestore();

const sendGamesToDB = async () => {
  // use the push method to save data to the messages
  // https://firebase.google.com/docs/reference/js/database#push

  const games = await fetchGiantBomb();

  for (const game of games) {
    const platforms = game.platforms; //Replace the platforms foreach with a filter
    const platformNames = [];
    platforms.forEach((platform) => {
      platformNames.push(platform.name);
    });

    const guid = game.guid;
    // const specificGame = await fetchMoreDetails(guid);
    // const genres = specificGame.genres; //Replace the platforms foreach with a filter
    // const genreNames = [];
    // genres.forEach((genre) => {
    //   genreNames.push(genre.name);
    // });
    // console.log(genreNames);

    // Send games to Firebase Database
    // push(gamesDatabase, {
    //   name: game.name,
    //   platforms: platformNames,
    //   description: game.description,
    //   date: game.original_release_date,
    //   guid: game.guid,
    //   id: game.id,
    //   image: game.image.small_url,
    //   giantbombLink: game.site_detail_url,
    iPhone;
    iPhone;
    // });

    //  Send games to FireStore Database
    const docRef = addDoc(collection(firebasedb, 'games'), {
      name: game.name,
      platforms: platformNames,
      description: game.description,
      date: game.original_release_date,
      guid: game.guid,
      id: game.id,
      image: game.image.small_url,
      giantbombLink: game.site_detail_url,
      //genres: genreNames,
    });

    if (game == 5) {
      break;
    }
  }
};

const sendCharactersToDB = async () => {
  const characters = await fetchGiantBombCharacters();

  characters.forEach((character) => {
    const docRef = addDoc(collection(firebasedb, 'characters'), {
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

// On click of pull games to the DB

document.getElementById('dbDump').addEventListener('click', sendGamesToDB);
document
  .getElementById('dbCharactersDump')
  .addEventListener('click', sendCharactersToDB);

// On click of Random Button show a game

document.getElementById('randomButton').addEventListener('click', randomButton);

async function randomButton() {
  clearSearchResult();

  onValue(gamesDatabase, (snapShot) => {
    const savedGames = snapShot.val();
    pickRandomGame(savedGames);
  });

  // Code to convert to use FireStore DB

  // const gamesRef = collection(firebasedb, 'games');
  // const querySnapshot = await getDocs(gamesRef);
  // pickRandomGame(querySnapshot);
}

// Render a random Game

const createElementTemplateWrapper = document.querySelector('#gameName');

async function pickRandomGame(savedGames) {
  // This uses the Realtime Database (not Firestore) as I was not able to replace the randomise part of it in time

  // querySnapshot.forEach((doc) => {
  //   const data = doc.data();
  //   const name = data.name;
  //   // console.log(name);
  // });

  const gameValues = Object.values(savedGames);
  const singleGame = gameValues[Math.floor(Math.random() * gameValues.length)];

  const platforms = singleGame.platforms;
  const guid = singleGame.guid;
  const id = singleGame.id;
  const name = singleGame.name;

  const specificGame = await fetchMoreDetails(guid);
  const genres = specificGame.genres;

  const divElement = document.createElement('div');
  const h3Element = document.createElement('h3');
  const mainImg = document.createElement('img');
  const genreList = document.createElement('ul');
  const platformList = document.createElement('ul');
  const buttonElement = document.createElement('button');

  divElement.classList.add('singlegame-random');
  h3Element.innerText = `${name}`;
  mainImg.src = singleGame.image;
  genres.forEach(function (genre) {
    console.log(genre.name);
    var genreLi = document.createElement('LI');
    var genreLiText = document.createTextNode(genre.name);
    genreLi.appendChild(genreLiText);
    genreList.appendChild(genreLi);
  });
  platforms.forEach(function (platform) {
    var platformLi = document.createElement('LI');
    var platformLiText = document.createTextNode(platform);
    platformLi.appendChild(platformLiText);
    platformList.appendChild(platformLi);
  });
  buttonElement.textContent = 'Share to Feed';
  buttonElement.setAttribute('data-id', id);
  buttonElement.setAttribute('data-gameName', name);
  buttonElement.dataset.gameKey = id;
  buttonElement.dataset.gameNameKey = name;
  buttonElement.addEventListener('click', chooseGame);

  divElement.appendChild(h3Element);
  divElement.appendChild(mainImg);
  divElement.appendChild(genreList);
  divElement.appendChild(platformList);
  divElement.appendChild(buttonElement);

  createElementTemplateWrapper.appendChild(divElement);
}

// Show all Game Results on the Sidebar
// ----------------------------------------------------------

window.addEventListener('DOMContentLoaded', getGameResults);
const resultsTemplate = document.querySelector('#game-results-template');
const resultsPostList = document.querySelector('.message-board');

async function getGameResults() {
  resultsPostList.innerHTML = '';

  const gamesResultsRef = collection(firebasedb, 'gameResults');
  const resultsQuerySnapshot = await getDocs(gamesResultsRef);
  resultsQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const time = data.time;
    const key = doc.id;
    console.log(key);

    const clone = resultsTemplate.content.cloneNode(true);
    const p = clone.querySelector('#result-name');
    const pTime = clone.querySelector('#result-time');
    const deleteElement = clone.querySelector('#delete');
    p.innerText = name;
    pTime.innerText = time;
    deleteElement.setAttribute('data-id', key);
    deleteElement.addEventListener('click', deleteGameResult);

    resultsPostList.append(clone);
  });
}

// Delete Game results in the database
//--------------------------------------------------

function getGameResultId(event) {
  const {
    currentTarget: {
      dataset: { id },
    },
  } = event;

  return id;
}

async function deleteGameResult(event) {
  const gameId = getGameResultId(event);

  await deleteDoc(doc(firebasedb, 'gameResults', gameId));
  getGameResults();
}

// Clear User's Search Result
// ------------------------------------------------------------

function clearSearchResult() {
  createElementTemplateWrapper.innerHTML = '';
}

// Get a random character from the database
// -----------------------------------------------------------------
function getCharacterOfTheDay() {
  // This uses the Realtime Database (not Firestore) as I was not able to replace the randomise part of it in time
  onValue(charactersDatabase, (snapShot) => {
    const savedCharacter = snapShot.val();
    pickRandomCharacter(savedCharacter);
  });
}

const createCharacterTemplateWrapper =
  document.querySelector('#characterDayCtn');

// Display random character to the sidebar
// -----------------------------------------------------------------

function pickRandomCharacter(savedCharacter) {
  const characterValues = Object.values(savedCharacter);
  const singleCharacter =
    characterValues[Math.floor(Math.random() * characterValues.length)];
  const characterBirthday = singleCharacter.birthday;
  const characterDescription = singleCharacter.description;

  const sectionElement = document.createElement('section');
  const h2Element = document.createElement('h2');
  const description = document.createElement('div');
  const birthday = document.createElement('p');
  h2Element.innerText = `${singleCharacter.name}`;
  if (characterBirthday !== undefined) {
    birthday.innerText = `Birthday: ${characterBirthday}`;
  }
  if (characterDescription !== undefined) {
    description.innerHTML = `${characterDescription}`;
  }

  sectionElement.appendChild(h2Element);
  sectionElement.appendChild(birthday);
  sectionElement.appendChild(description);

  createCharacterTemplateWrapper.appendChild(sectionElement);
}

// Function to check if one day has passed - does not work?
// ----------------------------------------------------
function hasOneDayPassed() {
  var date = new Date().toLocaleDateString();

  if (localStorage.yourapp_date == date) return false;

  localStorage.yourapp_date = date;
  return true;
}

// If one day has passed run get character again
function runOncePerDay() {
  if (!hasOneDayPassed()) return false;
  getCharacterOfTheDay();
}

runOncePerDay();
getCharacterOfTheDay();

// Get Users birthday and match to Character
//
// Pull the date that is entered into the input / CREATE
//-------------------------------------------------------------------------------------------

const bdForm = document.querySelector('#birthday-form');
const birthday = document.querySelector('#birthday');
// Event
bdForm.addEventListener('submit', getUserBirthday);

// Execution
function getUserBirthday(event) {
  event.preventDefault();

  const userBirthday = birthday.value;
  matchBirthdays(userBirthday);

  birthday.value = '';
}

async function matchBirthdays(userBirthday) {
  const q = query(
    collection(firebasedb, 'characters'),
    where('birthday', '==', userBirthday),
  );
  const birthdayQuerySnapshot = await getDocs(q);

  renderBirthdayMatch(birthdayQuerySnapshot);
}

const birthdayResultsTemplate = document.querySelector(
  '#birthday-results-template',
);
const birthdayResultsPostList = document.querySelector('.birthday-match-ctn');

function renderBirthdayMatch(birthdayQuerySnapshot) {
  birthdayResultsPostList.innerHTML = '';
  birthdayQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const img = data.image;
    const id = data.id;
    const guid = data.guid;

    console.log(name);

    const clone = birthdayResultsTemplate.content.cloneNode(true);
    const nameElement = clone.querySelector('#birthday-result-name');
    const imgElement = clone.querySelector('#birthday-result-image');
    const buttonElement = clone.querySelector('#birthday-result-btn');
    nameElement.innerText = name;
    imgElement.src = img;
    buttonElement.setAttribute('data-id', id);
    buttonElement.setAttribute('data-gameName', name);
    buttonElement.dataset.gameKey = id;
    buttonElement.dataset.gameNameKey = name;
    buttonElement.addEventListener('click', chooseGame);

    birthdayResultsPostList.append(clone);
  });
}

// Text Search
// Get text entered into input and compare to database and return rseults
// Can't use the database for this as Firestore does not have a 'Contains' option.
// -----------------------------------------------------------------------------------------------

const textSearchForm = document.querySelector('#textSearch-form');
const textInput = document.querySelector('#userTextInput');
// Event
textSearchForm.addEventListener('submit', getUserTextInput);

// Execution
function getUserTextInput(event) {
  event.preventDefault();

  let userText = textInput.value;
  userText = encodeURIComponent(userText);
  console.log(userText);
  matchTextSearch(userText);

  textInput.value = '';
}

const textSearchResultsTemplate = document.querySelector(
  '#text-search-results-template',
);
const textSearchResultsPostList = document.querySelector(
  '.text-search-result-ctn',
);

async function matchTextSearch(userText) {
  const giantbombSearchResults = await searchGiantBomb(userText);
  textSearchResultsPostList.innerHTML = '';
  giantbombSearchResults.forEach((giantbombSearchResult) => {
    console.log(giantbombSearchResult.name);
    const name = giantbombSearchResult.name;
    let img = giantbombSearchResult.image;
    img = img.small_url;
    let resultId = giantbombSearchResult.id;
    resultId = resultId.toString();
    console.log(img);
    const clone = textSearchResultsTemplate.content.cloneNode(true);
    const nameElement = clone.querySelector('#text-result-name');
    const buttonElement = clone.querySelector('#text-result-btn');
    const imgElement = clone.querySelector('#text-result-img');
    nameElement.innerText = name;
    imgElement.src = img;
    buttonElement.setAttribute('data-id', resultId);
    buttonElement.setAttribute('data-gameName', name);
    buttonElement.dataset.gameKey = resultId;
    buttonElement.dataset.gameNameKey = name;
    buttonElement.addEventListener('click', chooseGame);
    textSearchResultsPostList.append(clone);
  });
  //https://www.giantbomb.com/api/search/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json&query=%22elder%20scrolls%20online%22&resources=game
}

//Function to search and match database with what the user has selected from the Dropdowns
// -------------------------------------------------------------------------------------------------------

const gamesForm = document.querySelector('#find-game-form');
const userPlatformInput = document.querySelector('#selectPlatform');
const userGenreInput = document.querySelector('#selectGenre');

gamesForm.addEventListener('submit', getUserPlatform);

function getUserPlatform(event) {
  event.preventDefault();

  clearSearchResult();
  const userPlatform = userPlatformInput.value;
  const userGenre = userGenreInput.value;
  matchPlatforms(userPlatform, userGenre);

  userPlatformInput.value = 'Platform';
  userGenreInput.value = 'Genre';
}

async function matchPlatforms(userPlatform, userGenre) {
  console.log(userGenre);
  const q = query(
    collection(firebasedb, 'games'),
    where('platforms', 'array-contains', userPlatform),
    // where('genres', 'array-contains', userGenre),
  );
  const filterQuerySnapshot = await getDocs(q);

  renderFilterGame(filterQuerySnapshot);
}

function renderFilterGame(filterQuerySnapshot) {
  filterQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const id = data.id;
    const guid = data.guid;
    const imgURL = data.image;
    const divElement = document.createElement('div');
    const h3Element = document.createElement('h3');
    const selectButton = document.createElement('button');
    const mainImg = document.createElement('img');

    h3Element.innerText = name;
    selectButton.innerHTML = 'Choose this game';
    divElement.setAttribute('data-guid', guid);
    selectButton.setAttribute('data-id', id);
    selectButton.setAttribute('data-gameName', name);
    selectButton.dataset.gameKey = id;
    selectButton.dataset.gameNameKey = name;
    selectButton.addEventListener('click', chooseGame);

    mainImg.src = imgURL;

    divElement.appendChild(mainImg);
    divElement.appendChild(h3Element);
    divElement.appendChild(selectButton);

    createElementTemplateWrapper.appendChild(divElement);
  });
}

function getGameId(event) {
  return event.target.dataset.gameKey;
}
function getGameName(event) {
  return event.target.dataset.gameNameKey;
}

function chooseGame(event, gameName) {
  // const selectedGameId = getGameId(event);
  const selectedGameName = getGameName(event);
  let d = new Date();
  let date = d.getDate();
  let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  let year = d.getFullYear();
  let dateStr = date + '/' + month + '/' + year;

  console.log(selectedGameName);

  const docRef = addDoc(collection(firebasedb, 'gameResults'), {
    name: selectedGameName,
    time: dateStr,
  });

  getGameResults();
}

const gamesResultsRef = collection(firebasedb, 'games');
const resultsQuerySnapshot = await getDocs(gamesResultsRef);
resultsQuerySnapshot.forEach((doc) => {
  const data = doc.data();
  console.log(data.name);
});
