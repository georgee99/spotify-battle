export const getPlaylistDetailsFromAPI = async (spotifyLink) => {
  const API_ENDPOINT = "https://api.spotify.com/v1/playlists/";

  try {
    const headers = {
      Authorization: await getBearerToken(
        // eslint-disable-next-line no-undef
        process.env.CLIENT_ID,
        // eslint-disable-next-line no-undef
        process.env.CLIENT_SECRET
      ),
    };
    const response = await fetch(
      API_ENDPOINT + (await retrieveSpotifyPlaylistIDFromURL(spotifyLink)),
      {
        method: "GET",
        headers: headers,
      }
    );
    const spotifyPlaylist = await response.json();
    return spotifyPlaylist;
  } catch (err) {
    console.error("Error: " + err);
    return null;
  }
};

export const getBearerToken = async (clientID, clientSecret) => {
  const url = "https://accounts.spotify.com/api/token";
  try {
    const authHeader = `Basic ${btoa(`${clientID}:${clientSecret}`)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return "Bearer " + data.access_token;
  } catch (error) {
    console.error(error);
  }
};

const retrieveSpotifyPlaylistIDFromURL = async (url) => {
  url = removeQueryString(url);
  const regex = /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)$/;

  const match = url.match(regex);

  if (match) {
    const playlistId = match[1];
    return playlistId;
  } else {
    return null;
  }
};

const removeQueryString = (url) => {
  return url.indexOf("?") !== -1 ? url.split("?")[0] : url;
};

export const getNumberOfTracks = async (playlist) => {
  return playlist.tracks != null ? playlist.tracks.total : 0;
};

export const getPlaylistImage = async (playlist) => {
  return playlist.images != null ? playlist.images[0].url : null;
};

export const getPlaylistDescription = async (playlist) => {
  return playlist.description != null ? playlist.description : null;
};

export const getPlaylistFollowerCount = async (playlist) => {
  return playlist.followers != null ? playlist.followers.total : 0;
};

export const getPlaylistName = async (playlist) => {
  return playlist.name;
};

export const determineImagePixelCount = async (imageURL) => {
  try {
    const response = await fetch(imageURL);
    const data = await response.blob();
    const imageBitmap = await createImageBitmap(data);
    const width = imageBitmap.width;
    const height = imageBitmap.height;
    const pixelCount = width * height;

    return pixelCount;
  } catch (error) {
    console.error(error);
  }
};

export const didAPIReturnError = async (returnedSpotifyObj) => {
  return Object.prototype.hasOwnProperty.call(returnedSpotifyObj, "error");
};
