export const retrieveSpotifyPlaylistIDFromURL = async (url) => {
  url = removeQueryString(url);
  console.log(url);
  const regex = /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)$/;

  const match = url.match(regex);

  if (match) {
    const playlistId = match[1];
    console.log(playlistId);
    return playlistId;
  } else {
    console.log("INVALID ID");
    return null;
  }
};

const removeQueryString = (url) => {
  return url.indexOf("?") !== -1 ? url.split("?")[0] : url;
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

export const getNumberOfTracks = async (playlist) => {
  return playlist.tracks != null ? playlist.tracks.items.length : 0;
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
    console.log("Getting image");
    const response = await fetch(imageURL);
    const data = await response.blob();
    const imageBitmap = await createImageBitmap(data);
    const width = imageBitmap.width;
    const height = imageBitmap.height;
    const pixelCount = width * height;

    console.log(`Total pixel count: ${pixelCount}`);
    return pixelCount;
  } catch (error) {
    console.error(error);
  }
};

export const findWinningUserForCategory = async (user1Length, user2Length) => {
  // use this later
  return user1Length > user2Length
    ? "user1"
    : user1Length < user2Length
    ? "user2"
    : ""; //Nothing if they're equal;
};
