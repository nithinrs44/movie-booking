import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import Select from "react-select";

function EditPost() {
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showtime, setShowtime] = useState([]);
  const [posterUrl, setPosterUrl] = useState("");
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/movie/view/${postId}`, {
        headers: { Authorization: "token " + user.token },
      })
      .then((response) => {
        setTitle(response.data.title);
        setAbout(response.data.about);
        setCategory(response.data.category);
        setStartDate(response.data.start_date);
        setEndDate(response.data.end_date);
        setShowtime(
          response.data.showTimes.map((time) => ({
            value: time,
            label: `${time} AM`,
          }))
        );

        setPosterUrl(response.data.poster_url);
      })
      .catch((error) => console.error("There was an error!", error));
  }, [postId, user.token]);

  function updatePost() {
    axios
      .put(
        `http://127.0.0.1:8000/movie/update/${postId}`,
        {
          title: title,
          about: about,
          category: category,
          start_date: startDate,
          end_date: endDate,
          showTimes: showtime.map((time) => time.value),
          poster_url: posterUrl,
        },
        { headers: { Authorization: "token " + user.token } }
      )
      .then((response) => {
        alert("Edited Successfully");
        navigate("/list"); 
      })
      .catch((error) => console.error("There was an error!", error));
  }

  const showTimeoptions = [
    { value: "11:30 AM", label: "11:30 AM" },
    { value: "02:30 PM", label: "02:30 PM" },
    { value: "05:00 PM", label: "05:00 PM" },
    { value: "09:00 PM", label: "09:00 PM" },
  ];
  const handletimeChange = (selectedShowtime) => {
    setShowtime(selectedShowtime);
  };

  return (
    <div className="add">
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2 mt-4">
            <h1 className="text-center">Edit Movies</h1>
            <hr></hr>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>About:</label>
              <textarea
                className="form-control"
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label >Show Time</label>
              <Select
                isMulti
                options={showTimeoptions}
                value={showtime}
                onChange={handletimeChange}
                className="genre-select"
              />
            </div>
            <div className="form-group">
              <label>Poster URL:</label>
              <input
                type="url"
                className="form-control"
                value={posterUrl}
                onChange={(event) => setPosterUrl(event.target.value)}
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary  btn-block float-right"
                onClick={updatePost}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
