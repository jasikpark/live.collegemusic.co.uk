const FOCUSABLE_SELECTORS =
  "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

function initClock() {
  return {
    time: new Intl.DateTimeFormat("default", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(),
    unix: new Date().toISOString(),
    startClock: function () {
      const self = this;
      function updateClock() {
        self.time = new Intl.DateTimeFormat("default", {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        }).format();
        self.unix = new Date().toISOString();
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
    weather_link: "",
    getWeather: function () {
      const self = this;
      function updateWeather() {
        fetch("https://geolocation-db.com/json/")
          .then((response) => response.json())
          .then((data) => {
            if (data?.latitude && data?.longitude) {
              fetch(
                `https://api.openweathermap.org/data/2.5/weather?appid=3074e25313624bc7213df098d33cd414&lat=${data.latitude}&lon=${data.longitude}`
              )
                .then((response) => response.json())
                .then((data) => {
                  self.weather_icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                  self.weather_description = data.weather[0].description;
                  self.weather_link = `https://openweathermap.org/city/${data.id}`;
                });
            } else {
              return;
            }
          });
      }
      updateWeather();
      setInterval(() => {
        updateWeather();
      }, 30 * 60 * 1000);
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

function initSearchButton() {
  return {
    focusSearchModal: function () {
      var self = this;
      console.log("before open " + self.$store.search.open);
      self.$store.search.open = true;
      console.log("after open " + self.$store.search.open);
      const modal = document.getElementById("search-modal");

      const button = modal.querySelector(FOCUSABLE_SELECTORS);

      self.$nextTick(() => button.focus());
    },
  };
}

function initSearchModal() {
  return {
    query: "",
    prev_query: "",
    loading: false,
    rowCount: 10,
    data: null,
    request_no: Date.now(),

    closeModal: function ($event) {
      var self = this;
      const openButton = document.getElementById("open-search");

      if (openButton.contains($event.target)) {
        return false;
      }
      console.log("before close " + self.$store.search.open);
      self.$store.search.open = false;
      console.log("after close " + self.$store.search.open);
      openButton.focus();
    },
    fetchSearch: function () {
      var self = this;
      if (self.query.trim() === "") {
        this.data = null;
        return false;
      }
      if (self.query.trim() === self.prev_query.trim()) {
        return false;
      }
      self.loading = true;
      self.prev_query = self.query;
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
          self.loading = false;
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

Spruce.store("search", { open: "false" });
