import Spruce from "@ryangjchandler/spruce";

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
const IsYoutubeReady = () => {
  const youtube = Spruce.store("youtube");
  if (!youtube.playerReady && window.YT && window.YT.loaded) {
    onYouTubeIframeAPIReady();
    return true;
  } else {
    setTimeout(IsYoutubeReady, 1000);
    return false;
  }
};

window.addEventListener("DOMContentLoaded", IsYoutubeReady);

// Sets up the youtube api object within Spruce
const onYouTubeIframeAPIReady = () => {
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

// Update `youtube.state` stored within Spruce when it changes
const onPlayerStateChange = () => {
  console.log("state changed");
  Spruce.store("youtube").state =
    Spruce.store("youtube").player.getPlayerState();
};

const onPlayerReady = () => {
  Spruce.store("youtube").ready = true;
};
