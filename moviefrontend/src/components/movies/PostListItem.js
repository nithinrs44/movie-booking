import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function PostListItem({ post, refresh }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const user = useSelector(state => state.auth.user);

    function deletePost() {
        axios.delete(`http://127.0.0.1:8000/movie/${post.id}/delete`, {
            headers: { 'Authorization': "token " + user.token }
        }).then(response => {
            alert("Deleted Successfully");
            refresh();
        }).catch(error => {
            console.error("Error deleting post:", error);
        });
    }

    function disableMovieShow() {
        axios.put(`http://127.0.0.1:8000/movie/disable/${post.id}`, null, {
            headers: { 'Authorization': "token " + user.token }
        }).then(response => {
            if (response.data.disabled ==true){
                alert(`${response.data.title} is disabled`)
            }
            else{
                alert(`${response.data.title} is enabled`)
            }
            refresh();
        }).catch(error => {
            setErrorMessage("Failed to disable movie show. Please try again.");
            console.error("Error disabling movie show:", error);
        });
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="card" style={{ width: "300px" }}>
                <img className="card-img-top" src={post.poster_url} alt={post.title} style={{ width: "300px", height: "320px" }} />
                <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>
                    <Link to={`/edit/${post.id}`} className="btn btn-primary mr-2">Edit</Link>
                    <button className="btn btn-danger mr-2" onClick={deletePost}>Delete</button>
                    <button className="btn btn-info mr-2" onClick={disableMovieShow}>{post.disabled ? 'ENABLE' : 'DISABLE'}</button>
                    {errorMessage && <div>{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}

export default PostListItem;
