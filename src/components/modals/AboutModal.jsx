import { aboutData } from "../../data/data"

function AboutModal() {
    return (
        <>
            <a type="button" className="about-modal-button" data-toggle="modal" data-target="#aboutModal">
                About
            </a>

            <div className="modal fade" id="aboutModal" tabIndex="-1" role="dialog" aria-labelledby="aboutModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="aboutModalLabel">How it works</h5>
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