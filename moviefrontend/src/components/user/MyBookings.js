import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import { Document, Page, View, Text, Image, pdf } from '@react-pdf/renderer'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/movie/booking', {
        headers: { Authorization: 'token ' + user.token },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const generateQRCode = async (booking) => {
    try {
      const qrText = `Movie: ${booking.movie_details.title}, Booking ID: ${booking.id}, Showtime:${booking.show_time}`;
      const dataUrl = await QRCode.toDataURL(qrText);
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const handleDownloadPDF = async (booking) => {
    try {
      const qrDataUrl = await generateQRCode(booking);
      const styles = {
        container: {
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        
        },
        title: {
          fontSize: 40,
          marginBottom: 40,
          fontWeight: 'bold',
          textAlign: 'center',

        },
        text: {
          fontSize: 24,
          marginBottom: 10,
          textAlign: 'center',
        },
        image: {
        
          marginTop: 10,
          width: 250,
          height: 250,
         
        },
      };
      
      const pdfContent = (
       <Document> 
          <Page>
            <View style={styles.container}>
              <Text style={styles.title}>Movie Magic</Text>
              <Text style={styles.text}>Booking ID: {booking.id}</Text>
              <Text style={styles.text}>Movie Name: {booking.movie_details.title}</Text>
              <Text style={styles.text}>Show Time: {booking.show_time}</Text>
              <Text style={styles.text}>Total Amount: {booking.total_price}</Text>
              <Text style={styles.text}>Booking date : {booking.booking_date}</Text>
              <Image src={qrDataUrl} style={styles.image} />
              <Text style={styles.text}>Happy Booking</Text>
              <Text style={styles.text}>Be On Time:)</Text>
            </View>
          </Page>
        </Document>
      );

      const pdfBlob = await pdf(pdfContent).toBlob();   
      saveAs(pdfBlob, `ticket_${booking.id}.pdf`);
    } catch (error) {
      console.error('Error handling PDF download:', error);
    }
  };

  return (
    <div >
      <Navbar />
      <h1 className="text-center mb-4 ">My Bookings</h1>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Booking ID</th>
            <th>Movie Name</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.movie_details.title}</td>
              <td>{booking.total_price}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleDownloadPDF(booking)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;
