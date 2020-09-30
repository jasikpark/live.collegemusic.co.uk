function initClock() {
  return {
    time: dayjs().format("ddd. h:mm a"),
    startClock: function () {
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

function initSongData() {
  return {
    songData: {
      now_playing: {
        elapsed: 78,
        remaining: 33,
        sh_id: 51197,
        played_at: 1600545484,
        duration: 111,
        playlist: "default",
        streamer: "",
        is_request: false,
        song: {
          id: "",
          text: "-- --",
          artist: "--",
          title: "--",
          album: "--",
          lyrics: "",
          art: "/static/default_album_art.png",
          custom_fields: [],
        },
      },
      playing_next: false,
      song_history: false,
    },

    getSongData: function () {
      var self = this;

      let sub = new WebSocket(
        "wss://api.collegemusic.co.uk/static/api/live/nowplaying/cm"
      );
      sub.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log(data);
        self.songData = data;
      };
    },

    shareSong: function () {
      if (navigator.share) {
        navigator
          .share({
            title: "live.collegemusic.co.uk",
            text: "Check out live.collegemusic.co.uk.",
            url: "https://live.collegemusic.co.uk",
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        alert("Check out live.collegemusic.co.uk.");
      }
    },
  };
}

function initArtistHero() {
  return {
    setupArtistLink: function ($el) {
      let up,
        down,
        link = $el.querySelector("a");
      $el.onmousedown = () => (down = +new Date());
      $el.onmouseup = () => {
        up = +new Date();
        if (up - down < 200) {
          link.click();
        }
      };
    },
  };
}
