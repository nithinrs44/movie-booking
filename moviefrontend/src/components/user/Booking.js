import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import checkAuth from "../auth/checkAuth";

const BookingComponent = () => {
  const { movieId} = useParams();
  const location= useLocation();
  const{moviename}=location.state;
  const user = useSelector((store) => store.auth.user);
  const [formData, setFormData] = useState({
    movie: "",
    movietitle:"",
    booking_date: "",
    show_time: "",
    number_of_tickets: 1,
    total_price: 0,
  });
  const [showTimes, setShowTimes] = useState([]);
  let navigate = useNavigate();
  const [bookingId, setBookingId] = useState(null);
  const [rzp, setRzp] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [confirmationScreen, setConfirmationScreen] = useState(false);

  useEffect(() => {
    if (movieId && moviename) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        movie: movieId,
        movietitle: moviename
      }));
      console.log(movieId,moviename);
      fetchShowTimes(movieId);
    }
  }, [movieId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchShowTimes = async (movieId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/movie/showtimes/${movieId}/`
      );
      setShowTimes(response.data.showtimes || []);
      console.log("Show Times:", response.data.showtimes || []);
    } catch (error) {
      console.error("Error fetching show times:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setPaymentInProgress(true);

      // Payment initiation logic goes here
      const paymentRes = await axios.post(
        "http://127.0.0.1:8000/movie/api/initiate-payment/",
        {
          amount: formData.total_price,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      console.log("Payment initiated:", paymentRes.data);

      const rzpInstance = new window.Razorpay({
        key: "rzp_test_JRq2o3chfPfzcG",
        amount: formData.total_price * 100,
        currency: "INR",
        name: "MOVIE MAGIC",
        description: "Movie Ticket Booking",
        image: "https://example.com/your_logo.png",
        order_id: paymentRes.data.order_id,
        handler: handlePaymentSuccess,
        prefill: {
          name: user.name,
          contact: user.phone_number,
        },
        theme: {
          color: "#3399cc",
        },
      });
      setRzp(rzpInstance);
      rzpInstance.open();
    } catch (err) {
      console.error("Error:", err);
      alert("Error initiating payment. Please try again later.");
      setPaymentInProgress(false);
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.number_of_tickets]);

  const handlePaymentSuccess = async (response) => {
    try {
      console.log("Payment success:", response);

      const razorpayPaymentId = response?.razorpay_payment_id;
      const handlePaymentRes = await axios.post(
        "http://127.0.0.1:8000/movie/api/handle-payment/",
        {
          razorpay_payment_id: razorpayPaymentId,
          amount: formData.total_price,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      console.log("Payment handled:", handlePaymentRes.data);

      
      const bookingRes = await axios.post(
        "http://127.0.0.1:8000/movie/book",
        formData,
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      console.log("Booking successful:", bookingRes.data);
      const bookingId = bookingRes.data.booking_id;
      console.log(bookingId);
      setBookingId(bookingId);
      await sendEmail(bookingId);

      setConfirmationScreen(true);
      setPaymentInProgress(false);
    } catch (err) {
      console.error("Error handling payment:", err);
      alert("Error handling payment. Please contact support.");
      setPaymentInProgress(false);
    }
  };

  const calculateTotalPrice = () => {
    const PRICE_PER_TICKET = 250;
    const totalPrice = formData.number_of_tickets * PRICE_PER_TICKET;
    setFormData((prevFormData) => ({
      ...prevFormData,
      total_price: totalPrice,
    }));
  };

  const sendEmail = async (booking_id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/movie/email/${booking_id}`,
        null,
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  if (paymentInProgress) {
    return <div>Processing Payment...</div>;
  }

  if (confirmationScreen) {
    return (
      <>
        <Navbar />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="booking-confirmation card container text-center">
          <h2 className="text-center">Booking Confirmation</h2>
          <p className="text-center">Your booking ID is: {bookingId}</p>
          <Link to="/mybookings">My Bookings</Link>
        </div>
      </>
    );
  }
  console.log("Show Times:", showTimes);

  return (
    <div className="">
      <Navbar />
      <div className="booking-container text-center add">
        <h2>Book Movie Ticket</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <label className="form-label">
            Movie:
            <input
              type="text"
              name="movie"
              value={formData.movietitle}
              onChange={handleChange}
              disabled={!!movieId}
              className="form-input"
            />
          </label>
          <label className="form-label" >
            Booking Date:
            <input
              required
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Show Time:
            <select
              required
              name="show_time"
              value={formData.show_time}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Show Time</option>
              {showTimes &&
                showTimes.map((time) => (
                  <option  value={time}>
                    {time}
                  </option>
                ))}
            </select>
          </label>

          <label className="form-label">
            Number of Tickets:
            <input
              type="number"
              name="number_of_tickets"
              min="1"
              value={formData.number_of_tickets}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Total Price:
            <input
              type="text"
              value={formData.total_price.toFixed(2)}
              readOnly
              className="form-input"
            />
          </label>
          <button type="submit" className="form-button">
            Book Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default checkAuth(BookingComponent);
