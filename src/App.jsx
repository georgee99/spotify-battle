import { useState } from 'react'
import spotifyBattleLogo from './assets/spotify-battle-logo.jpeg'
import './App.css'
import Navbar from './components/Navbar'
import { determineImagePixelCount, getBearerToken, getNumberOfTracks, getPlaylistDescription, getPlaylistFollowerCount, getPlaylistImage, getPlaylistName, retrieveSpotifyPlaylistIDFromURL } from './helper/helper'
import UserModal from './components/UserModal'

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
    console.log(spotifyPlaylist)
    return spotifyPlaylist
  } catch (err) {
    console.error("Error: " + err)
  }
}

const determineWinner = async (playlist1, playlist2, user1Name, user2Name) => {
  let user1Score = 0;
  let user2Score = 0;
  let roundWinnersArr = []

  // TRACK CALCULATION
  let playlist1TrackCount = await getNumberOfTracks(playlist1)
  let playlist2TrackCount = await getNumberOfTracks(playlist2)

  if (playlist1TrackCount > playlist2TrackCount) {
    user1Score++;
    roundWinnersArr.push(user1Name)
  } else if (playlist1TrackCount < playlist2TrackCount) {
    user2Score++
    roundWinnersArr.push(user2Name)
  } else {
    roundWinnersArr.push("Tied Round")
  }

  console.log(`ROUND 1. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // IMAGE CALCULATION
  let playlist1Image = await getPlaylistImage(playlist1)
  let playlist2Image = await getPlaylistImage(playlist2)

  if (!playlist1Image && !playlist2Image) {
    roundWinnersArr.push("Tied Round")
  }
  else if (playlist1Image && !playlist2Image) {
    user1Score++
    roundWinnersArr.push(user1Name)
  } else if (!playlist1Image && playlist2Image) {
    user2Score++
    roundWinnersArr.push(user2Name)
  } else {
    // Calculating pixels in each image
    const image1Pixels = await determineImagePixelCount(playlist1Image)
    const image2Pixels = await determineImagePixelCount(playlist2Image)
    if (image1Pixels > image2Pixels) {
      user1Score++
      roundWinnersArr.push(user1Name)
    } else if (image1Pixels < image2Pixels) {
      user2Score++;
      roundWinnersArr.push(user2Name)
    } else {
      roundWinnersArr.push("Tied Round")
    }
  }

  console.log(`ROUND 2. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // DESCRIPTION CALCULATION
  const playlist1Description = await getPlaylistDescription(playlist1)
  const playlist2Description = await getPlaylistDescription(playlist2)

  if (playlist1Description && playlist2Description) {
    if (playlist1Description.length > playlist2Description.length) {
      user1Score++
      roundWinnersArr.push(user1Name)
    } else if (playlist1Description.length < playlist2Description.length) {
      user2Score++
      roundWinnersArr.push(user2Name)
    } else {
      roundWinnersArr.push("Tied Round")
    }
  } else if (playlist1Description && !playlist2Description) {
    user1Score++
    roundWinnersArr.push(user1Name)
  } else if (!playlist1Description && playlist2Description) {
    user2Score++
    roundWinnersArr.push(user2Name)
  } else {
    roundWinnersArr.push("Tied Round")
  }

  console.log(`ROUND 3. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // FOLLOWERS CALCULATION
  const playlist1FollowerCount = await getPlaylistFollowerCount(playlist1)
  const playlist2FollowerCount = await getPlaylistFollowerCount(playlist2)

  if (playlist1FollowerCount > playlist2FollowerCount) {
    user1Score++
    roundWinnersArr.push(user1Name)
  } else if (playlist1FollowerCount < playlist2FollowerCount) {
    user2Score;
    roundWinnersArr.push(user2Name)
  } else {
    roundWinnersArr.push("Tied Round")
  }

  console.log(`ROUND 4. User 1: ${user1Score}.  User 2: ${user2Score}`)

  // FINAL ROUND: PLAYLIST NAME
  const playlist1Name = await getPlaylistName(playlist1)
  const playlist2Name = await getPlaylistName(playlist2)

  if (playlist1Name.length > playlist2Name.length) {
    user1Score++;
    roundWinnersArr.push(user1Name)
  } else if (playlist1Name.length < playlist2Name.length) {
    user2Score++
    roundWinnersArr.push(user2Name)
  } else {
    roundWinnersArr.push("Tied Round")
  }

  console.log("User 1 score: " + user1Score)
  console.log("User 2 score: " + user2Score)

  let winningUser = user1Score > user2Score ? "User 1" : user1Score < user2Score ? "User 2" : "Draw";
  let winnerObj = {
    winningUser,
    roundWinners: roundWinnersArr
  }

  return winnerObj
}

const API_ENDPOINT = "https://api.spotify.com/v1/playlists/"

function App() {
  const [spotifyLink1, setSpotifyLink1] = useState('');
  const [spotifyLink2, setSpotifyLink2] = useState('');
  const [spotifyPlaylist1Details, setSpotifyPlaylist1Details] = useState('');
  const [spotifyPlaylist2Details, setSpotifyPlaylist2Details] = useState('');
  const [winner, setWinner] = useState('');
  const [user1Name, setUser1Name] = useState('');
  const [user2Name, setUser2Name] = useState('');
  const [roundWinners, setRoundWinners] = useState([]);

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

    let winnerObj = await determineWinner(spotifyPlaylist1, spotifyPlaylist2, user1Name, user2Name)
    let winnerByUserID = winnerObj.winningUser;
    let winningRounds = winnerObj.roundWinners;

    const winner = (winnerByUserID == "User 1" ? user1Name : winnerByUserID == "User 2" ? user2Name : "It's a draw &#128125")

    setWinner(winner)
    setRoundWinners(winningRounds)
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
      <UserModal setUser1Name={setUser1Name} setUser2Name={setUser2Name} />
      {
        user1Name && user2Name &&
        <div>
          <div className='link-input-area'>
            <div className='link-input-container'>
              <label className='username-label'>{user1Name}:</label>
              <input type="text" placeholder="Enter spotify link" className='spotify-input-link' onChange={handleInputChangeS1}></input>
            </div>
            <div className='link-input-container'>
              <label className='username-label'>{user2Name}:</label>
              <input type="text" placeholder="Enter spotify link" className='spotify-input-link' onChange={handleInputChangeS2}></input>
            </div>
          </div>
          <button onClick={handleButtonClick} className="button-50">
            GO!
          </button>
        </div>
      }
      {spotifyPlaylist1Details && spotifyPlaylist2Details &&
        <div>
          <h3 className='winner-header'>
            Winner: {winner}
          </h3>
          <h4>
            Results by round
          </h4>
          {
            roundWinners.map((rw, index) =>
              <p key={index}>
                Round {index + 1}: {rw}
              </p>
            )
          }
        </div>
      }
    </>
  )
}

export default App