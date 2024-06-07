import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import BookingComponent from "./Booking";

function MovieView() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBooking, setShowBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      fetchMovies();
    } else {
      console.error("User is not logged in.");
    }
  }, [user]);

  const fetchMovies = () => {
    axios
      .get("http://127.0.0.1:8000/movie/viewuser", {
        
        headers: { Authorization: "token " + user.token },
      })
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies data:", error);
      });
  };

  const toggleMovieDetails = (movieId) => {
    if (selectedMovie === movieId) {
      setSelectedMovie(null);
    } else {
      setSelectedMovie(movieId);
    }
  };

  const showBookingDetails = (movieId,moviename) => {
    navigate(`/booking/${movieId}`,{
      state: { moviename:moviename },
      });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/movie/search/${searchQuery}`,
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movies data:", error);
      return []; 
    }
  };

  useEffect(() => {
    const search = async () => {
      if (searchQuery) {
        const searchedMovies = await handleSearch();
        setMovies(searchedMovies);
      } else {
        fetchMovies();
      }
    };

    search();
  }, [searchQuery]);

  return (
    <div className="list">
      <Navbar />
      <div className="container ">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search movie name"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h1 className="text-center"></h1>
        {showBooking && (
          <>
            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowBooking(null)}
            >
              Back to Movies
            </button>
            <BookingComponent movieId={showBooking} />
          </>
        )}
        <div className="row">
          {!showBooking && movies.length === 0 ? (
            <div className="col-md-12 mb-3 mt-5 m-0">
              <h3>No results found</h3>
            </div>
          ) : (
            movies.map((movie) => (
              <div className="col-md-6 mb-3 mt-5" key={movie.id}>
                <div className="row justify-content-center">
                  <div className="card " style={{ width: "300px" }}>
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="card-img-top"
                      style={{ width: "275px", height: "330px" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                    
                      {movie.disabled ? null : (
                        <button
                          className="btn btn-info mr-2"
                          onClick={() => toggleMovieDetails(movie.id)}
                        >
                          {selectedMovie === movie.id
                            ? "Hide Details"
                            : "Show Details"}
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => showBookingDetails(movie.id,movie.title)}
                        disabled={movie.disabled}
                      >
                        {movie.disabled ? "Disabled" : "Book Ticket"}
                      </button>
                    </div>
                    {selectedMovie === movie.id && (
                      <div className="card-footer">
                        <p>About: {movie.about}</p>
                        <p>Category: {movie.category}</p>
                        <p>Show Time: {movie.showTimes}</p>
                        <p>Start Date: {movie.start_date}</p>
                        <p>End Date: {movie.end_date}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default checkAuth(MovieView);
