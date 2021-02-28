export const Volume = () => {
  return {
    startVolume() {
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
    adjustVolume() {
      let self = this;
      self.$store.youtube.player.setVolume(self.$store.youtube.volume);
      self.$store.youtube.muted = false;
    },
    toggleMute() {
      let self = this;
      if (self.$store.youtube.muted) {
        self.$store.youtube.player.unMute();
      } else {
        self.$store.youtube.player.mute();
      }
    },
  };
};
