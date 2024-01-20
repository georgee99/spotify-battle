/* eslint-disable react/prop-types */
function ImageFightComponent({ image1, image2, name1, name2 }) {
    return (
        <div className="image-fight">
            <div>
                <img src={image1} alt="Spotify Playlist 1" className="playlist-fight-image" />
                <p className="playlist-fight-name">{name1}</p>
            </div>
            <p>Versus</p>
            <div>
                <img src={image2} alt="Spotify Playlist 2" className="playlist-fight-image" />
                <p className="playlist-fight-name">{name2}</p>
            </div>
        </div>
    )
}

export default ImageFightComponent