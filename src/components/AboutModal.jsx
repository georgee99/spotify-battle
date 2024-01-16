import { aboutData } from "../data/data"

// eslint-disable-next-line react/prop-types
function AboutModal() {
    return (
        <>
            <a type="button" className="about-modal-button" data-toggle="modal" data-target="#exampleModal">
                About
            </a>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">How it works</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {aboutData.description}
                            <br />
                            <br />
                            {aboutData.instructions}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AboutModal