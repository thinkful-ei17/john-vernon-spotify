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
  // Edit me!
  // (Plan to call `getFromApi()` several times over the whole exercise from here!)
};

const createTemplate = function (data) {

}

const renderHTML = function (template) {

}
//testing logs
//#1
getFromApi('search', {
  q: "Drake",
   limit: 1,
   type: 'artist'
}).then((data) => console.log(data));

//#2 error
getFromApi('search', {
  q: "Drake",
   limit: -1,
   type: 'artist'
}).then((data) => console.log(data)
).catch((err) => console.log(err));

//#3 additional request
getFromApi('search', {

  q: "James Blake",
   limit: 1,
   type: 'artist'

}).then((data) => {

  console.log(data)
  /*
  only one item and obj layout looks like
  data
  - artists
  -- items
  --- [0]
  ---- id
  ---- name ,etc, etc
  --- [0] to [limit]
  -- etc
  */
  let id = data.artists.items[0].id;
  console.log(id);
  //ask for more data
  return getFromApi(`artists/${id}/related-artists`);

}).then((data) => {

  console.log("Second Data: ");
  console.log(data);

});

//#4

getFromApi('search', {

  q: "James Blake",
   limit: 1,
   type: 'artist'

}).then((data) => {

  let id = data.artists.items[0].id;
  return getFromApi(`artists/${id}/related-artists`);

}).then((data) => {

  console.log(data.artists);
  //return getFromApi("artists/43ZHCT0cAZBISjO8DG9PnE/top-tracks?country=US");
  //return getFromApi(`artists/${data.artists[0].id}/top-tracks?country=US`);

  let urlArr = data.artists.map((item) => {
    return `artists/${item.id}/top-tracks?country=US`;
  });

  console.log(urlArr);

  return Promise.all(urlArr.map((url) => getFromApi(url)));
}).then((data) => {
  console.log("Last one");
  console.log(data)
});
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
