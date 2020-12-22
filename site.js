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

    songLinkData: {
      now_playing: false,
      song_history: [false, false, false, false, false],
    },

    playing: false,

    songLink: "https://song.link/us/i/1532373384",

    getSongData: function () {
      var self = this;

      let sub = new WebSocket(
        "wss://api.collegemusic.co.uk/static/api/live/nowplaying/cm"
      );
      sub.onmessage = function (event) {
        let newSongData = JSON.parse(event.data);
        let oldNowPlaying = self.songData.now_playing;
        self.songData = newSongData;

        if (newSongData.now_playing.song.id !== oldNowPlaying.song.id) {
          fetch(
            `https://songlink-search.calebjasik.workers.dev/?q=${encodeURIComponent(
              `track:"${self.songData.now_playing.song.title}"artist:"${self.songData.now_playing.song.artist}"`
            )}`
          )
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw Error("Failed to fetch now_playing song link");
              }
            })
            .catch((e) => console.log(e.message || e.toString()))
            .then((data) => {
              if (data?.pageUrl) {
                self.songLinkData.now_playing = data;
              } else {
                self.songLinkData.now_playing = false;
              }
            });

          self.songData.song_history.forEach((item, key) => {
            fetch(
              `https://songlink-search.calebjasik.workers.dev/?q=${encodeURIComponent(
                `track:"${item.song.title}"artist:"${item.song.artist}"`
              )}`
            )
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw Error("Failed to fetch song_history song links");
                }
              })
              .catch((e) => console.log(e.message || e.toString()))
              .then((data) => {
                if (data?.pageUrl) {
                  self.songLinkData.song_history[key] = data;
                } else {
                  self.songLinkData.song_history[key] = false;
                }
              });
          });
        }
      };
      sub.onerror = function () {
        console.log("Could not connect to websocket");
      };
    },

    openSongLink: function () {
      window.open(
        self.songLinkData.now_playing,
        "_blank",
        "noopener,noreferrer"
      );
    },

    shareSong: function () {
      if (navigator.share) {
        navigator
          .share({
            title: "College Music YT",
            text:
              "I'm listening to i love you 3000 by GentleBeatz on College Music",
            url: "https://song.link/s/2UobyorUSwvPuzFhL6YVAJ",
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

    togglePlayback: function () {
      var self = this;
      const player = self.$store.youtube.player;
      if (self.$store.youtube.state === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    },
  };
}

function initVolumeControl() {
  return {
    startVolume: function () {
      const self = this;
      function updateVolume() {
        if (self.$store.youtube.ready) {
          self.$store.youtube.volume = self.$store.youtube.player.getVolume();
          self.$store.youtube.muted = self.$store.youtube.player.isMuted();
        }
        window.requestAnimationFrame(updateVolume);
      }
      window.requestAnimationFrame(updateVolume);
    },
    adjustVolume: function () {
      var self = this;
      self.$store.youtube.player.setVolume(self.$store.youtube.volume);
      self.$store.youtube.muted = false;
    },
    toggleMute: function () {
      var self = this;
      if (self.$store.youtube.muted) {
        self.$store.youtube.player.unMute();
      } else {
        self.$store.youtube.player.mute();
      }
    },
  };
}

function initSearchButton() {
  return {
    focusSearchModal: function () {
      var self = this;
      const main = document.getElementsByTagName("main")[0];

      main.setAttribute("inert", "true");
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
    songLinks: null,
    request_no: Date.now(),

    closeModal: function ($event) {
      var self = this;
      const openButton = document.getElementById("open-search");
      const main = document.getElementsByTagName("main")[0];

      if (openButton.contains($event.target)) {
        return false;
      }

      console.log("before close " + self.$store.search.open);
      self.$store.search.open = false;
      main.removeAttribute("inert");
      console.log("after close " + self.$store.search.open);
      openButton.focus();
    },
    tabEvent: function ($event) {
      var self = this;
      if (self.$store.search.open === false) {
        return;
      }
      const search = document.getElementById("search-modal");
      const focusableEls = search.querySelectorAll(FOCUSABLE_SELECTORS);
      firstFocusableEl = focusableEls[0];
      lastFocusableEl = focusableEls[focusableEls.length - 1];
      if (!search.contains(document.activeElement)) {
        firstFocusableEl.focus();
        $event.preventDefault();
      }
      if ($event.shiftKey && document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        $event.preventDefault();
      } else if (
        !$event.shiftKey &&
        document.activeElement === lastFocusableEl
      ) {
        firstFocusableEl.focus();
        $event.preventDefault();
      }
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
      const url = `https://live-collegemusic-co-uk.netlify.app/api/station/1/requests?current=1&rowCount=${
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

function initFullscreen() {
  return {
    canFullscreen: function () {
      var doc = window.document;
      var docEl = doc.documentElement;

      var requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;

      return requestFullScreen;
    },
    toggleFullscreen: function () {
      var doc = window.document;
      var docEl = doc.documentElement;

      var requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      var cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl);
      } else {
        cancelFullScreen.call(doc);
      }
    },
  };
}

Spruce.store("search", { open: false });

Spruce.store("youtube", {
  apiReady: false,
  player: false,
  state: -1,
  volume: 25,
  muted: false,
  ready: false,
});

/**
 * @returns {boolean}
 */
function IsYoutubeReady() {
  const youtube = Spruce.store("youtube");
  if (!youtube.playerReady && YT.loaded) {
    onYouTubeIframeAPIReady();
    return true;
  } else {
    setTimeout(IsYoutubeReady, 1000);
  }
}

setTimeout(IsYoutubeReady, 1000);

function onYouTubeIframeAPIReady() {
  Spruce.reset("youtube", {
    playerReady: true,
    player: new YT.Player("player", {
      height: "390",
      width: "640",
      target: document.querySelector("link[rel='canonical']").href,
      videoId: "MCkTebktHVc",
      playerVars: { playsinline: 1 },
      events: {
        onStateChange: onPlayerStateChange,
        onReady: onPlayerReady,
      },
    }),
    state: -1,
    volume: 25,
    muted: false,
    ready: false,
  });
}

function onPlayerStateChange() {
  console.log("state changed");
  Spruce.store("youtube").state = Spruce.store(
    "youtube"
  ).player.getPlayerState();
}

function onPlayerReady() {
  Spruce.store("youtube").ready = true;
}
