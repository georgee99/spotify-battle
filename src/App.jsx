import { useState } from 'react'
import spotifyBattleLogo from './assets/spotify-battle-logo.jpeg'
import './App.css'
import Navbar from './components/Navbar'
import { determineImagePixelCount, getBearerToken, getNumberOfTracks, getPlaylistDescription, getPlaylistFollowerCount, getPlaylistImage, getPlaylistName, retrieveSpotifyPlaylistIDFromURL } from './helper/helper'

const getPlaylistDetails = async (spotifyLink1) => {
  try {
    const headers = {
      // eslint-disable-next-line no-undef
      'Authorization': await getBearerToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET),
    }
    const response = await fetch(API_ENDPOINT + await retrieveSpotifyPlaylistIDFromURL(spotifyLink1), {
      method: "GET",
      headers: headers
    });
    const spotifyPlaylist = await response.json()
    return spotifyPlaylist
  } catch (err) {
    console.error("Error: " + err)
  }
}

const determineWinner = async (playlist1, playlist2) => {
  let user1Score = 0;
  let user2Score = 0;

  // TRACK CALCULATION
  let playlist1TrackCount = await getNumberOfTracks(playlist1)
  let playlist2TrackCount = await getNumberOfTracks(playlist2)

  playlist1TrackCount > playlist2TrackCount ? user1Score++ : user2Score++;

  console.log(`ROUND 1. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // IMAGE CALCULATION
  let playlist1Image = await getPlaylistImage(playlist1)
  let playlist2Image = await getPlaylistImage(playlist2)

  if (!playlist1Image && !playlist2Image) { /* empty */ }
  else if (playlist1Image && !playlist2Image) {
    user1Score++
  } else if (!playlist1Image && playlist2Image) {
    user2Score++
  } else {
    // Calculating pixels in each image
    const image1Pixels = await determineImagePixelCount(playlist1Image)
    const image2Pixels = await determineImagePixelCount(playlist2Image)

    image1Pixels > image2Pixels ? user1Score++ : image1Pixels < image2Pixels ? user2Score++ : "" //Nothing if they're equal;
  }

  console.log(`ROUND 2. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // DESCRIPTION CALCULATION
  const playlist1Description = await getPlaylistDescription(playlist1)
  const playlist2Description = await getPlaylistDescription(playlist2)

  if (playlist1Description && playlist2Description) {
    playlist1Description.length > playlist2Description.length ? user1Score++ : playlist1Description.length < playlist2Description.length ? user2Score++ : ""
  } else if (playlist1Description && !playlist2Description) {
    user1Score++
  } else if (!playlist1Description && playlist2Description) {
    user2Score++
  } else {
    // Nothing
  }

  console.log(`ROUND 3. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // FOLLOWERS CALCULATION
  const playlist1FollowerCount = await getPlaylistFollowerCount(playlist1)
  const playlist2FollowerCount = await getPlaylistFollowerCount(playlist2)

  if (playlist1FollowerCount && playlist2FollowerCount) {
    playlist1FollowerCount > playlist2FollowerCount ? user1Score++ : playlist1FollowerCount < playlist2FollowerCount ? user2Score++ : "";

  } else if (playlist1FollowerCount && !playlist2FollowerCount) {
    user1Score++;
  } else if (!playlist1FollowerCount && playlist2FollowerCount) {
    user2Score++;
  } else {
    // Nothing
  }
  console.log(`ROUND 4. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // FINAL ROUND: PLAYLIST NAME
  const playlist1Name = await getPlaylistName(playlist1)
  const playlist2Name = await getPlaylistName(playlist2)

  playlist1Name.length > playlist2Name.length ? user1Score++ : playlist1Name.length < playlist2Name.length ? user2Score++ : "";

  console.log("User 1 score: " + user1Score)
  console.log("User 2 score: " + user2Score)
}

const API_ENDPOINT = "https://api.spotify.com/v1/playlists/"

function App() {
  const [spotifyLink1, setSpotifyLink1] = useState('');
  const [spotifyLink2, setSpotifyLink2] = useState('');
  const [winner, setWinner] = useState('');

  const [spotifyPlaylist1Details, setSpotifyPlaylist1Details] = useState('');
  const [spotifyPlaylist2Details, setSpotifyPlaylist2Details] = useState('');

  const handleInputChangeS1 = (event) => {
    setSpotifyLink1(event.target.value);
  };
  const handleInputChangeS2 = (event) => {
    setSpotifyLink2(event.target.value);
  };

  const handleButtonClick = async () => {
    let spotifyPlaylist1 = await getPlaylistDetails(spotifyLink1)
    setSpotifyPlaylist1Details(spotifyPlaylist1)

    let spotifyPlaylist2 = await getPlaylistDetails(spotifyLink2)
    setSpotifyPlaylist2Details(spotifyPlaylist2)

    setWinner(await determineWinner(spotifyPlaylist1, spotifyPlaylist2))
  };

  return (
    <>
      <Navbar />
      <div className='header-container'>
        <div className=''>
          <h1>Spotify Battle</h1>
          <img src={spotifyBattleLogo} className='logo spotify-battle'></img>
        </div>
      </div>
      <div className='test-css'>
        <input type="text" placeholder="Enter spotify link" className='test-input' onChange={handleInputChangeS1}></input>
        <input type="text" placeholder="Enter spotify link" className='test-input' onChange={handleInputChangeS2}></input>
      </div>
      <button onClick={handleButtonClick} className="button-50">
        GO!
      </button>
      {spotifyPlaylist1Details && spotifyPlaylist2Details &&
        <div>
          <h3>
            Winner: {winner}
          </h3>
        </div>
      }
    </>
  )
}

export default App
