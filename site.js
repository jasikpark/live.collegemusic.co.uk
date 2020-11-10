const FOCUSABLE_SELECTORS =
  "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

function initClock() {
  return {
    time: new Intl.DateTimeFormat("default", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(),
    startClock: function () {
      const self = this;
      function updateClock() {
        self.time = new Intl.DateTimeFormat("default", {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        }).format();
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
    weather_description: "",
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
              console.log(data);
              self.weather_icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
              self.weather_description = data.weather[0].description;
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

    playing: false,

    songLink: "https://song.link/us/i/1532373384",

    getSongData: function () {
      var self = this;

      let sub = new WebSocket(
        "wss://api.collegemusic.co.uk/static/api/live/nowplaying/cm"
      );
      sub.onmessage = function (event) {
        let data = JSON.parse(event.data);
        self.songData = data;
      };
    },

    openSongLink: function () {
      window.open(
        "https://song.link/us/i/1532373384",
        "_blank",
        "noopener,noreferrer"
      );
    },

    shareSong: function () {
      if (navigator.share) {
        navigator
          .share({
            title: "College Music YT",
            text: "Check out the College Music Youtube.",
            url: "https://youtube.com/collegemusic",
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        window.open(
          "https://youtube.com/collegemusic",
          "_blank",
          "noopener,noreferrer"
        );
      }
    },
  };
}

function initSearch() {
  return {
    open: false,
    query: "",
    rowCount: 10,
    data: null,
    request_no: Date.now(),
    focusSearchModal: function () {
      var self = this;
      self.open = true;
      const modal = document.getElementById("search-modal");

      const button = modal.querySelector(FOCUSABLE_SELECTORS);

      self.$nextTick(() => button.focus());
    },
    closeModal: function () {
      var self = this;
      self.open = false;

      const openButton = document.getElementById("open-search");

      openButton.focus();
    },
    fetchSearch: function () {
      var self = this;
      self.data = null;
      self.data = { loading: true };
      const url = `https://cors-anywhere.herokuapp.com/https://api.collegemusic.co.uk/api/station/1/requests?current=1&rowCount=${
        self.rowCount
      }&searchPhrase=${encodeURI(self.query)}&_=${self.request_no}`;

      fetch(url, {
        credentials: "omit",
        mode: "cors",
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          self.data = data;
          console.log(data);
        });
      self.request_no += 1;
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
