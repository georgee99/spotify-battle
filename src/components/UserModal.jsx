import { useState } from 'react';

// eslint-disable-next-line react/prop-types
function UserModal({ setUser1Name, setUser2Name }) {
    const [input1, setLocalInput1] = useState('');
    const [input2, setLocalInput2] = useState('');

    const handleUsername1Change = (event) => {
        setLocalInput1(event.target.value)
    };
    const handleUsername2Change = (event) => {
        setLocalInput2(event.target.value)
    };

    const handleSaveChanges = () => {
        setUser1Name(input1);
        setUser2Name(input2);
    }
    return (
        <>
            <a type="button" className="username-info-modal-button" data-toggle="modal" data-target="#userNameModal">
                Set usernames
            </a>

            <div className="modal fade" id="userNameModal" tabIndex="-1" role="dialog" aria-labelledby="userNameModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="userNameModalLabel">Usernames</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body username-modal-body">
                            <label>Player 1:</label>
                            <input type="text" className='' onChange={handleUsername1Change}></input>
                            <br />
                            <br />
                            <label>Player 2:</label>
                            <input type="text" className='' onChange={handleUsername2Change}></input>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleSaveChanges}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default UserModal