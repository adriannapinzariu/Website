import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [count, setClick] = useState(parseInt(localStorage.getItem("count")));
  const [location, setLocation] = useState(null);
  const [clickCountsByLocation, setClickCountsByLocation] = useState({});
  

  var fetch = require('node-fetch');
  var requestOptions = {
  method: 'GET',
  };

  useEffect(() => {localStorage.setItem("count", count)}, [count]) 

  function handleClick() {
    console.log('This is a test');
    localStorage.setItem("count", count);
    setClick((parseInt(count)) + 1);
    getLocation();
    setClickCountsByLocation(prevState => ({
    ...prevState,
    [location]: (prevState[location] || 0) + 1
  }));
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=658d08a4c4cd461f93c54292f61db232`, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                setLocation(data.features[0].properties.formatted);
              } else {
                setLocation('Location not found');
              }
            })
            .catch(error => {
              console.log(error);
            });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div className="App">
      <button onClick={handleClick}>
        Click here {count} {location && `(${location})`}
      </button>
      <div>
        <h2>Click Counts by Location</h2>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Click Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(clickCountsByLocation).map(location => (
              <tr key={location}>
                <td>{location}</td>
                <td>{clickCountsByLocation[location]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
