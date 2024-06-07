import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/auth/register";
import Login from "./components/auth/Login";
import Create from "./components/movies/create";
import List from "./components/movies/List";
import EditPost from "./components/movies/EditMovie";
import Disable from "./components/movies/Disable";
import View from "./components/user/View";
import BookingComponent from "./components/user/Booking";
import MyBookings from "./components/user/MyBookings";

const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path:'register',element:<Register/>},
    { path:'login',element:<Login/>},
    { path:'list',element:<List/>},
    { path:'create',element:<Create/>},
    { path:'edit/:postId',element:<EditPost/>},
    {path:'disable/:postId',element:<Disable/>},
    {path:'viewuser',element:<View/>},
    { path: 'booking/:movieId', element: <BookingComponent /> },
    {path:'mybookings',element:<MyBookings/>},



]);

export default router;