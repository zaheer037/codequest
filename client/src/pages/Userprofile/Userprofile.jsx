import React, { useState } from 'react'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Avatar from '../../Comnponent/Avatar/Avatar'
import Editprofileform from './Edirprofileform'
import Profilebio from './Profilebio'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake, faPen } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"

const Userprofile = ({ slidein }) => {
  const { id } = useParams()
  const [Switch, setswitch] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [mapUrl, setMapUrl] = useState(null);

  const weatherEmojis = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "☁️",
    "broken clouds": "☁️",
    "shower rain": "🌧️",
    "rain": "🌧️",
    "thunderstorm": "⛈️",
    "snow": "❄️",
    "mist": "🌫️"
  };

  const users = useSelector((state)=>state.usersreducer)
  const currentprofile = users.filter((user) => user._id === id)[0]
  const currentuser = useSelector((state)=>state.currentuserreducer)
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2bb6a6380def2fbcd296df492ca0c194`
          );
          const weatherDescription = weatherResponse.data.weather[0].description;
          const temperature = (weatherResponse.data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
          const weatherEmoji = weatherEmojis[weatherDescription] || "";
          setWeather(`Condition: ${weatherDescription} ${weatherEmoji}, Temperature: ${temperature} °C`);
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=AIzaSyBGKDXL6AnpRWHn0rtW_bBXc1jpUhzkRlA&q=${latitude},${longitude}`
          );
        } catch (error) {
          console.error('Error fetching location or weather data:', error);
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  // console.log(currentuser._id)
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar backgroundColor="purple" color="white" fontSize="50px" px="40px" py="30px">{currentprofile.name.charAt(0).toUpperCase()}</Avatar>
              <div className="user-name">
                <h1>{currentprofile?.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> Joined{" "} {moment(currentprofile?.joinedon).fromNow()}
                </p>
              </div>
            </div>
            {currentuser?.result?._id === id && ( 
              <button className="edit-profile-btn" type='button' onClick={() => setswitch(true)}><FontAwesomeIcon icon={faPen} /> Edit Profile</button>
            )}
            <div>
            <h1>User Profile</h1>
            <button onClick={getLocation} className="location-btn">Obtain Location</button>
            {weather && (
              <div>
                <p><strong>Weather Condition:</strong> {weather}</p>
                {mapUrl && (
                  <iframe
                    width="600"
                    height="450"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                )}
              </div>
      )}
    </div>
          </div>
          <>
            {Switch ? (
              <Editprofileform currentuser={currentuser} setswitch={setswitch} />
            ) : (
              <Profilebio currentprofile={currentprofile} />
            )}
          </>
        </section>
      </div></div>
  )
}

export default Userprofile