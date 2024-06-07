import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function Disable() {
    const [errorMessage, setErrorMessage] = useState(null);
    const { postId } = useParams();
    const user = useSelector(state => state.auth.user);
    console.log(postId)

    const disableMovieShow = () => {
        axios.put(`http://127.0.0.1:8000/movie/disable/${postId}`, null, {
            headers: { 'Authorization': "token " + user.token }
        }).then(response => {
            alert('Disabled Succesufully');
            // Refresh the list of movie shows
        }).catch(error => {
            setErrorMessage("Failed to disable movie show. Please try again.");
            console.error("Error disabling movie show:", error);
        });
    };
    

    return (
        <div>
            <button onClick={disableMovieShow}>Disable Movie Show</button>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}

export default Disable;
