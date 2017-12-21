const CLIENT_ID = 'eb6dfffda5534bb5996e872487be4321';

const getFromApi = function (endpoint, query = {}) {
  // You won't need to change anything in this function, but you will use this function
  // to make calls to Spotify's different API endpoints. Pay close attention to this
  // function's two parameters.

  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${localStorage.getItem('SPOTIFY_ACCESS_TOKEN')}`);
  headers.set('Content-Type', 'application/json');
  const requestObject = {
    headers
  };

  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  return fetch(url, requestObject).then(function (response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  });
};

let artist;

const getArtist = function (name) {
  console.log("hi");
  return getFromApi('search', {
    q: name,
     limit: 1,
     type: 'artist'
  }).then((data) => {
    artist = data.artists.items[0];
    let id = data.artists.items[0].id;
    console.log(id);
      //ask for more data
    return getFromApi(`artists/${id}/related-artists`);
  }).then((data) => {
    artist.related = data.artists

    //get ids for each related artist
    //make url, give correct url to getFromAPI func
    return Promise.all(data.artists.map((item) => getFromApi(`artists/${item.id}/top-tracks` , {'country': 'US'})));

  }).then((data) => {

    for (x in artist.related){
        artist.related[x].tracks = data[x].tracks;
    }

    return artist;
  })

};

// =========================================================================================================
// IGNORE BELOW THIS LINE - THIS IS RELATED TO SPOTIFY AUTHENTICATION AND IS NOT NECESSARY
// TO REVIEW FOR THIS EXERCISE
// =========================================================================================================
const login = function () {
  const AUTH_REQUEST_URL = 'https://accounts.spotify.com/authorize';
  const REDIRECT_URI = 'http://localhost:8080/auth.html';

  const query = new URLSearchParams();
  query.set('client_id', CLIENT_ID);
  query.set('response_type', 'token');
  query.set('redirect_uri', REDIRECT_URI);

  window.location = AUTH_REQUEST_URL + '?' + query.toString();
};

$(() => {
  $('#login').click(login);
});
