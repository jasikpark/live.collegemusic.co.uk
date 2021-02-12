import LRUCache from "mnemonist/lru-cache";

const FOCUSABLE_SELECTORS =
  "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

window.initClock = () => {
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
};

window.initWeather = () => {
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

window.initSongData = () => {
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
      now_playing: { pageUrl: false },
      song_history: [
        { pageUrl: false },
        { pageUrl: false },
        { pageUrl: false },
        { pageUrl: false },
        { pageUrl: false },
      ],
    },

    playing: false,

    songLink: "https://song.link/us/i/1532373384",

    getSongData: function () {
      let self = this;

      let sub = new WebSocket(
        "wss://api.collegemusic.co.uk/static/api/live/nowplaying/cm"
      );
      sub.onmessage = function (event) {
        let newSongData = JSON.parse(event.data);
        let oldNowPlaying = self.songData.now_playing;
        self.songData = newSongData;

        if (newSongData.now_playing.song.id !== oldNowPlaying.song.id) {
          requestIdleCallback(animateSongDetails, { timeout: 1000 });
          // Log missing song data to console
          if (
            self.songData.now_playing.song.title === "" ||
            self.songData.now_playing.song.artist === "" ||
            self.songData.now_playing.song.title === undefined ||
            self.songData.now_playing.song.artist === undefined
          ) {
            console.log(
              `Missing Song Data: id ${self.songData.now_playing.song.id} title ${self.songData.now_playing.song.title} artist ${self.songData.now_playing.song.artist}`
            );
          }
          if (self.$store.songLinks.has(self.songData.now_playing.song.id)) {
            self.songLinkData.now_playing = self.$store.songLinks.get(
              self.songData.now_playing.song.id
            );
          } else {
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
                  self.$store.songLinks.set(
                    self.songData.now_playing.song.id,
                    data
                  );
                } else {
                  self.songLinkData.now_playing.pageUrl = null;
                  self.$store.songLinks.set(
                    self.songData.now_playing.song.id,
                    null
                  );
                }
              });
          }

          self.songData.song_history.forEach((item, key) => {
            if (self.$store.songLinks.has(item.song.id)) {
              self.songLinkData.song_history[key] = self.$store.songLinks.get(
                item.song.id
              );
            } else {
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
                    self.$store.songLinks.set(item.song.id, data);
                  } else {
                    self.songLinkData.song_history[key] = null;
                    self.$store.songLinks.set(item.song.id, null);
                  }
                });
            }
          });
        }
      };
      sub.onerror = function () {
        console.log("Could not connect to websocket");
      };
      requestIdleCallback(animateSongDetails, { timeout: 1000 });
      // Call animateSongDetails on debounced window resize
      let timeout = false;
      window.addEventListener("resize", () => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          requestIdleCallback(animateSongDetails, { timeout: 1000 });
        });
        250;
      });
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
      let self = this;
      const player = self.$store.youtube.player;
      if (self.$store.youtube.state === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    },
  };
};

window.animateSongDetails = () => {
  // Construct a Web Animations API Object for each song that is long enough here.

  const truncateAndAnimate = Array.from(
    document.querySelectorAll(".truncate-and-animate")
  );

  // Reset the state of all elements we are watching for truncation
  for (const index in truncateAndAnimate) {
    // Cancel all of the old animations
    const x = truncateAndAnimate[index];
    // Get either the element or the first child of the element
    const el = x?.firstElementChild || x;
    if (el.animation) {
      el.animation.cancel();
    }
    el.style.setProperty("--content", null);
    // Unset mask on parent
    x.classList.remove("animating");
  }

  const filterTruncateAndAnimate = truncateAndAnimate.filter((x) => {
    // Get all elements that are currently truncated.
    return x.scrollWidth > x.clientWidth;
  });

  filterTruncateAndAnimate.forEach((x) => {
    // Animate either the element or the first child of the element
    const el = x?.firstElementChild || x;
    el.style.setProperty("--content", `"${el.textContent}"`);
    // Set mask on parent
    x.classList.add("animating");
    // We may have to calculate both the total amount of time to show the length of the element at a reasonable speed + what percentage of that is 2 seconds of waiting at the start.
    // Let's work with a good default.. and have an upper bound too.
    const duration = Math.min(el.scrollWidth * 20, 100000);
    el.animation = el.animate(
      [
        { transform: "translateX(0)", offset: 0 },
        { transform: "translateX(0)", offset: 0.5 },
        { transform: "translateX(calc(-50% - 0.25rem))", offset: 1 },
      ],
      { duration: duration, iterations: Infinity, easing: "linear" }
    );
  });
};

window.initVolumeControl = () => {
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
      let self = this;
      self.$store.youtube.player.setVolume(self.$store.youtube.volume);
      self.$store.youtube.muted = false;
    },
    toggleMute: function () {
      let self = this;
      if (self.$store.youtube.muted) {
        self.$store.youtube.player.unMute();
      } else {
        self.$store.youtube.player.mute();
      }
    },
  };
};

window.initSearchButton = () => {
  return {
    focusSearchModal: function () {
      let self = this;
      const main = document.getElementsByTagName("main")[0];
      const body = document.getElementsByTagName("body")[0];

      main.setAttribute("inert", "true");
      console.log("before open " + self.$store.search.open);
      self.$store.search.open = true;
      body.classList.remove("overflow-auto");
      body.classList.add("overflow-hidden");
      console.log("after open " + self.$store.search.open);
      const modal = document.getElementById("search-modal");

      const button = modal.querySelector(FOCUSABLE_SELECTORS);

      self.$nextTick(() => button.focus());
    },
  };
};

window.initSearchModal = () => {
  return {
    query: "",
    prev_query: "",
    loading: false,
    rowCount: 10,
    data: null,
    songLinks: null,
    request_no: Date.now(),

    closeModal: function ($event) {
      let self = this;
      const openButton = document.getElementById("open-search");
      const main = document.getElementsByTagName("main")[0];
      const body = document.getElementsByTagName("body")[0];

      if (openButton.contains($event.target)) {
        return false;
      }

      console.log("before close " + self.$store.search.open);
      self.$store.search.open = false;
      main.removeAttribute("inert");
      console.log("after close " + self.$store.search.open);
      body.classList.remove("overflow-hidden");
      body.classList.add("overflow-auto");
      openButton.focus();
    },
    tabEvent: function ($event) {
      let self = this;
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
      let self = this;
      if (self.query.trim() === "") {
        this.data = null;
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
};

window.initFullscreen = () => {
  return {
    canFullscreen: function () {
      let doc = window.document;
      let docEl = doc.documentElement;

      let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;

      return requestFullScreen;
    },
    toggleFullscreen: function () {
      let doc = window.document;
      let docEl = doc.documentElement;

      let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      let cancelFullScreen =
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
    /**
     * @returns {boolean}
     */
    isFullscreen: function () {
      let doc = window.document;
      let docEl = doc.documentElement;
      return (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      );
    },
  };
};

Spruce.store("songLinks", new LRUCache(1000));

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
window.IsYoutubeReady = () => {
  const youtube = Spruce.store("youtube");
  if (!youtube.playerReady && YT && YT.loaded) {
    onYouTubeIframeAPIReady();
    return true;
  } else {
    setTimeout(IsYoutubeReady, 1000);
  }
};

setTimeout(IsYoutubeReady, 1000);

window.onYouTubeIframeAPIReady = () => {
  Spruce.reset("youtube", {
    playerReady: true,
    player: new YT.Player("player", {
      height: "390",
      width: "640",
      target: window.location.origin,
      videoId: "MCkTebktHVc",
      playerVars: { playsinline: 1, rel: 0 },
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
};

window.onPlayerStateChange = () => {
  console.log("state changed");
  Spruce.store("youtube").state = Spruce.store(
    "youtube"
  ).player.getPlayerState();
};

function onPlayerReady() {
  Spruce.store("youtube").ready = true;
}
