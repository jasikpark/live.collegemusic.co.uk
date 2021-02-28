import LRUCache from "mnemonist/lru-cache";
import { animateSongDetails } from "../animate-song-details.js";
import Spruce from "@ryangjchandler/spruce";

Spruce.store("songLinks", new LRUCache(1000));

export const SongData = () => {
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

    getSongData() {
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
      let timeout;
      window.addEventListener("resize", () => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          requestIdleCallback(animateSongDetails, { timeout: 1000 });
        });
        250;
      });
    },

    shareSong($event) {
      var self = this;

      const songId = $event.currentTarget.getAttribute("data-song-id");
      console.log(`songId = ${songId}`);
      // Return early if the song id value doesn't exist
      if (!songId) {
        return false;
      }
      let song;
      if (songId === self.songData.now_playing.song.id) {
        song = self.songData.now_playing.song;
      } else {
        for (const songElement of self.songData.song_history) {
          if (songId === songElement.song.id) {
            song = songElement.song;
            break;
          }
        }
      }
      console.log({ song });
      if (!song) {
        return false;
      }
      const songLink = (self.$store.songLinks.peek(songId)
        ? self.$store.songLinks.get(songId).pageUrl
        : self.$store.youtube.player.getVideoUrl()
      ).toString();
      console.log({ songLink });
      if (navigator.share) {
        navigator
          .share({
            title: "College Music YT",
            text: `I'm listening to ${song.title} by ${song.artist} on College Music`,
            url: songLink,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        window.open(songLink, "_blank", "noopener,noreferrer");
      }
    },

    togglePlayback() {
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
