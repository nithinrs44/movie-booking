import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import checkAuth from "../auth/checkAuth";
import Select from "react-select";

function Create() {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showtime,setShowtime]=useState([])
  const [posterUrl, setPosterUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  const showTimeoptions=[
    {value:'11:30 AM',label:'11:30 AM'},
    {value:'02:30 PM',label:'02:30 PM'},
    {value:'05:00 PM',label:'05:00 PM'},
    {value:'09:00 PM',label:'09:00 PM'} 
]

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMovie = {
      title: title,
      about: about,
      category: category,
      start_date: startDate,
      end_date: endDate,
      showTimes:showtime.map((time)=>time.value),
      poster_url: posterUrl,
    };
   

    axios
      .post("http://127.0.0.1:8000/movie/create", newMovie, {
        headers: { Authorization: "token " + user.token },
      })
      .then((response) => {
        console.log("Movie added successfully:", response.data);
        navigate("/list");
      })
      .catch((error) => {
        console.error("Error adding movie:", error);
        setErrorMessage("Failed to add movie. Please try again.");
      });
  };
  const handletimeChange=(selectedShowtime)=>{
    setShowtime(selectedShowtime)
}

  return (
    <div className="add">
      <Navbar />
      <div className="container">
        <h2 className="text-center mt-4 mb-3">Add Movie</h2>
        <hr></hr>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="about" className="form-label">
              About:
            </label>
            <textarea
              className="form-control"
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Start Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              max={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="form-group">
                        <label >Show Time</label>
                        <Select isMulti options={showTimeoptions}
                        value={showtime}
                        onChange={handletimeChange} className="basic-multi-select"
                        classNamePrefix="select"/>
                    </div>
          <div className="mb-3">
            <label htmlFor="posterUrl" className="form-label">
              Poster URL:
            </label>
            <input
              type="url"
              className="form-control"
              id="posterUrl"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default checkAuth(Create);
