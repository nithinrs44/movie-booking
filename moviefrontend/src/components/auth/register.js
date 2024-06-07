import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

function Register() {
  var [name, setName] = useState("");
  var [password, setPassword] = useState("");
  var [passwordConf, setPasswordConf] = useState("");
  var [errorMessage, setErrorMessage] = useState("");
  var navigate = useNavigate();
  function registerUser(event) {
    
    event.preventDefault();
    var user = {
      username: name,
      password1: password,
      password2: passwordConf,
    };
    axios
      .post("http://127.0.0.1:8000/movie/register", user)
      .then((response) => {
        setErrorMessage("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error)
        if (error.response.data.password2 ||error.response.data.username) {
          setErrorMessage(error.response.data.username ? error.response.data.username : error.response.data.password2);
        } if (error.response.data.errors){
          setErrorMessage(Object.values(error.response.data.errors).join(" "));
        }else{
          setErrorMessage("Unexpected error occured") 
        }
        
      });
  }
  return (
    <div className="Movie">
      <Navbar />
      <div className="container card mt-5 p-3 jumbotron ">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">Register</h1>
            <hr></hr>
            {errorMessage ? (
              <div className="alert alert-danger">{errorMessage}</div>
            ) : (
              ""
            )}
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onInput={(event) => setName(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onInput={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={passwordConf}
                onInput={(event) => setPasswordConf(event.target.value)}
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                onClick={registerUser}
              >
                Submit
              </button>
              <p className="text-center">
                Already Have An Account?<Link to={"/login"}>Login</Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
