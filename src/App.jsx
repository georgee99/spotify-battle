import { useState } from 'react'
import spotifyBattleLogo from './assets/battle-logo.png'
import './App.css'
import Navbar from './components/Navbar'
import { determineImagePixelCount, didAPIReturnError, getNumberOfTracks, getPlaylistDescription, getPlaylistDetailsFromAPI, getPlaylistFollowerCount, getPlaylistImage, getPlaylistName } from './helper/helper'
import UserModal from './components/modals/UserModal'
import LoadingSpinner from './components/LoadingSpinner'
import ImageFightComponent from './components/ImageFightComponent'

const determineWinner = async (playlist1, playlist2, user1Name, user2Name) => {
  let user1Score = 0;
  let user2Score = 0;
  let roundWinnersArr = []

  const determineRoundWinner = async (value1, value2) => {
    if (value1 > value2) {
      user1Score++;
      roundWinnersArr.push(user1Name);
    } else if (value1 < value2) {
      user2Score++;
      roundWinnersArr.push(user2Name);
    } else {
      roundWinnersArr.push("Tied Round");
    }
  };

  // ROUND 1: TRACK CALCULATION
  await determineRoundWinner(await getNumberOfTracks(playlist1), await getNumberOfTracks(playlist2))

  // ROUND 2: IMAGE CALCULATION
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
    const image1PixelCount = await determineImagePixelCount(playlist1Image)
    const image2PixelCount = await determineImagePixelCount(playlist2Image)
    await determineRoundWinner(image1PixelCount, image2PixelCount)
  }

  // ROUND 3: DESCRIPTION CALCULATION
  const playlist1Description = await getPlaylistDescription(playlist1)
  const playlist2Description = await getPlaylistDescription(playlist2)

  if (playlist1Description && playlist2Description) {
    await determineRoundWinner(playlist1Description, playlist2Description)
  } else if (playlist1Description && !playlist2Description) {
    user1Score++
    roundWinnersArr.push(user1Name)
  } else if (!playlist1Description && playlist2Description) {
    user2Score++
    roundWinnersArr.push(user2Name)
  } else {
    roundWinnersArr.push("Tied Round")
  }

  // ROUND 4: FOLLOWERS CALCULATION
  await determineRoundWinner(await getPlaylistFollowerCount(playlist1), await getPlaylistFollowerCount(playlist2))


  // ROUND 5: PLAYLIST NAME
  const p1Name = await getPlaylistName(playlist1)
  const p2Name = await getPlaylistName(playlist2)
  await determineRoundWinner(p1Name.length, p2Name.length)

  let winningUser = user1Score > user2Score ? "User 1" : user1Score < user2Score ? "User 2" : "Draw";
  let winnerObj = {
    winningUser,
    roundWinners: roundWinnersArr
  }

  return winnerObj
}

function App() {
  const [spotifyLink1, setSpotifyLink1] = useState('');
  const [spotifyLink2, setSpotifyLink2] = useState('');
  const [spotifyPlaylist1Details, setSpotifyPlaylist1Details] = useState('');
  const [spotifyPlaylist2Details, setSpotifyPlaylist2Details] = useState('');
  const [winner, setWinner] = useState('');
  const [user1Name, setUser1Name] = useState('');
  const [user2Name, setUser2Name] = useState('');
  const [roundWinners, setRoundWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleInputChangeS1 = (event) => {
    setSpotifyLink1(event.target.value);
  };
  const handleInputChangeS2 = (event) => {
    setSpotifyLink2(event.target.value);
  };

  const handleButtonClick = async () => {
    setIsError(false)
    setLoading(true)
    let spotifyPlaylist1 = await getPlaylistDetailsFromAPI(spotifyLink1)
    setSpotifyPlaylist1Details(spotifyPlaylist1)

    let spotifyPlaylist2 = await getPlaylistDetailsFromAPI(spotifyLink2)
    setSpotifyPlaylist2Details(spotifyPlaylist2)


    if (await didAPIReturnError(spotifyPlaylist1) || await didAPIReturnError(spotifyPlaylist2)) {
      setIsError(true);
      return;
    }

    let winnerObj = await determineWinner(spotifyPlaylist1, spotifyPlaylist2, user1Name, user2Name)
    let winnerByUserID = winnerObj.winningUser;
    let winningRounds = winnerObj.roundWinners;

    const winner = (winnerByUserID == "User 1" ? user1Name : winnerByUserID == "User 2" ? user2Name : "It's a draw 👽")

    setWinner(winner)
    setRoundWinners(winningRounds)
    setLoading(false)
  };

  return (
    <>
      <Navbar />
      <div className='header-container'>
        <div className=''>
          <h1 className='landing-page-title'>Spotify Battle</h1>
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
              <input type="text" placeholder="Enter spotify playlist link" className='spotify-input-link' onChange={handleInputChangeS1}></input>
            </div>
            <div className='link-input-container'>
              <label className='username-label'>{user2Name}:</label>
              <input type="text" placeholder="Enter spotify playlist link" className='spotify-input-link' onChange={handleInputChangeS2}></input>
            </div>
          </div>
          <button onClick={handleButtonClick} className="button-50">
            GO!
          </button>
        </div>
      }
      {
        loading && !isError && <LoadingSpinner />
      }
      {
        isError &&
        <div className='error-message-api'>
          <p>Something went wrong! ❤️</p>
          <p>Double check the URLs are correct</p>
        </div>
      }
      {spotifyPlaylist1Details && spotifyPlaylist2Details && !loading &&
        <>
          <div className='full-results-container'>
            <ImageFightComponent image1={spotifyPlaylist1Details.images != null ? spotifyPlaylist1Details.images[0].url : null}
              image2={spotifyPlaylist2Details.images != null ? spotifyPlaylist2Details.images[0].url : null}
              name1={spotifyPlaylist1Details.name} name2={spotifyPlaylist2Details.name} />
            <h3 className='winner-header'>
              Winner: {winner}
            </h3>
            {
              roundWinners.map((rw, index) =>
                <div key={index} className='round-results-container'>
                  <p className='fadeInText' style={{ animationDelay: `${index * 0.5}s` }}>
                    Round {index + 1}: {rw}
                  </p>
                </div>

              )
            }
          </div>
        </>
      }
    </>
  )
}

export default App