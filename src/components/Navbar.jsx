import AboutModal from './modals/AboutModal'
import ContactModal from './modals/ContactModal'

function Navbar() {
  return (
    <div className="navbar">
      <AboutModal modalLinkText="About" modalTitle="How it works" className="modal-link" />
      <a href='https://open.spotify.com/' target="_blank" rel="noreferrer">Spotify</a>
      <ContactModal className="modal-link" />
    </div>
  )
}
export default Navbar