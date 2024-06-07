import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
        <Navbar/>
        <div className="Movie">
          <br/><br/>
          <h1 className="text-center text-danger display-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Welcome To Movie Magic</h1>

          <hr></hr>
          <br/> <br/> <br/> 
          <h3 className="text-center" style={{ fontFamily: 'roboto', color: 'black' }}>Create An Account</h3>

          <br></br>
        <div className="text-center"> 
        <Link to={'register'} className="btn btn-dark ">Register</Link>
        </div>        
        <br></br><br/>
        <div className="text-center"> 
               <h3 className="text-center display-7" style={{ fontFamily: 'roboto', color: 'black' }}>Already Have an Account</h3>
         <Link to={'login'} className="btn btn-dark ">Login</Link>
        </div>
        </div>
    </div>
  );
}

export default App;
