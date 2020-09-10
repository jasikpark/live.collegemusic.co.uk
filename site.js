function initClock() {
  return {
    time: dayjs().format("ddd. h:mm a"),
    startClock: function () {
      console.log("called startClock");
      const self = this;
      function updateClock() {
        self.time = dayjs().format("ddd. h:mm a");
      }
      setInterval(() => {
        updateClock();
      }, 1000);
    },
  };
}

function initWeather() {
  return {
    weather_icon: "",
    getWeather: function () {
      const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000,
      };
      var self = this;

      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?appid=3074e25313624bc7213df098d33cd414&lat=${latitude}&lon=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            self.weather_icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          });
      }

      function error() {
        console.error("Unable to retrieve your location");
        alert("Allow location for the wee little weather icon plzz");
      }

      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
      } else {
        console.log("Locating…");
        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
      }
    },
    getWeather2: function () {
      var self = this;
      fetch("https://geolocation-db.com/json/")
        .then((response) => response.json())
        .then((data) => {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?appid=3074e25313624bc7213df098d33cd414&lat=${data.latitude}&lon=${data.longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              self.weather_icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            });
        });
    },
  };
}
