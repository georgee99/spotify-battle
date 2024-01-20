import AboutModal from './modals/AboutModal'
import ContactModal from './modals/ContactModal'

function Navbar() {
  return (
    <div className="navbar">
      <AboutModal modalLinkText="About" modalTitle="How it works" />
      <a href='https://github.com/georgee99/spotify-battle' target="_blank" rel="noreferrer">Github</a>
      <a href='https://open.spotify.com/' target="_blank" rel="noreferrer">Spotify</a>
      <ContactModal />
    </div>
  )
}
export default Navbar