export const Weather = () => {
  return {
    weather_icon: "",
    weather_description: "Open Weather API",
    weather_link: "https://openweatherapi.org",
    getWeather: function () {
      const self = this;
      function updateWeather() {
        fetch("https://geolocation-db.com/json/")
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw Error("Location data did not load");
            }
          })
          .then((data) => {
            const fourOhFour = "Not%20Found";
            if (
              data &&
              data.latitude &&
              data.latitude !== fourOhFour &&
              data.longitude &&
              data.longitude !== fourOhFour
            ) {
              fetch(
                `https://api.openweathermap.org/data/2.5/weather?appid=3074e25313624bc7213df098d33cd414&lat=${data.latitude}&lon=${data.longitude}`
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  } else {
                    throw Error("Weather data did not load");
                  }
                })
                .then((data) => {
                  self.weather_icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                  self.weather_description = data.weather[0].description;
                  self.weather_link = `https://openweathermap.org/city/${data.id}`;
                })
                .catch((e) => console.log(e.message || e.toString()));
            } else {
              return;
            }
          })
          .catch((e) => console.log(e.message || e.toString()));
      }
      updateWeather();
      setInterval(() => {
        updateWeather();
      }, 30 * 60 * 1000);
    },
  };
};
