export const fetchGiantBomb = async () => {
  try {
    const response = await fetch(
      'https://www.giantbomb.com/api/games/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json',
    );
    //https://www.giantbomb.com/api/characters/?api_key=[YOUR API KEY]
    // To pull more games paginate the url http://www.giantbomb.com/api/games/?api_key=[APIKEY]&format=json&field_list=name&page=2

    if (response.ok) {
      const { results } = await response.json();
      return results;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchGiantBombCharacters = async () => {
  try {
    const response = await fetch(
      'https://www.giantbomb.com/api/characters/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json',
    );

    if (response.ok) {
      const { results } = await response.json();
      return results;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchMoreDetails = async (guid) => {
  console.log(guid);
  try {
    const response = await fetch(
      `https://www.giantbomb.com/api/game/${guid}/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json`,
    );

    if (response.ok) {
      const { results } = await response.json();
      return results;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error);
  }
};

export const searchGiantBomb = async (userText) => {
  // console.log(userText);
  try {
    const response = await fetch(
      `https://www.giantbomb.com/api/search/?api_key=5caa696b41ac3fc2a8a789a382f4337109e98366&format=json&query=%22${userText}%22&resources=game`,
    );

    if (response.ok) {
      const { results } = await response.json();
      return results;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error);
  }
};
