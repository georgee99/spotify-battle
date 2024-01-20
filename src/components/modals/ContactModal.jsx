import { contactData } from "../../data/data"

function ContactModal() {
    return (
        <>
            <a type="button" className="" data-toggle="modal" data-target="#contactModal">
                Contact
            </a>

            <div className="modal fade" id="contactModal" tabIndex="-1" role="dialog" aria-labelledby="contactModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="contactModalLabel">Contact me</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {contactData.contact}
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

export default ContactModal