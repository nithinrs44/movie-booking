import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";
import { Link } from "react-router-dom";

function Navbar() {
  var user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function logout() {
    if (user) {
      axios.post(
        "http://127.0.0.1:8000/movie/logout",
        {},
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      dispatch(removeUser());
      navigate("/login");
    }
  }

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="navbar-brand">
        <NavLink
          to={"/"}
          className={
            "nav-link " + ((status) => (status.isActive ? "active" : ""))
          }
        >
          Movie Magic
        </NavLink>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse mr-auto"
        id="navbarNav"
        style={{ float: "left" }}
      >
        <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
          {user ? (
            <>
              <li className="nav-item">
                <NavLink
                  to={
                    user.username === "Nithin" ||
                    user.userType === "admin"
                      ? "/list"
                      : "/viewuser"
                  }
                  className="nav-link"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink to={"/mybookings"} className="nav-link">
                  Booking
                </NavLink>
                </li>
              <li className="nav-item">
                <span className="nav-link cursor-pointer" onClick={logout}>
                  Logout
                </span>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink
                to={"/login"}
                className={
                  "nav-link " + ((status) => (status.isActive ? "active" : ""))
                }
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
