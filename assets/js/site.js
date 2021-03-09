import "./sentry.js";
import "./shims.js";
import "@ryangjchandler/spruce";

import "./youtube.js";

import { Clock } from "./components/clock.js";
import { Fullscreen } from "./components/fullscreen.js";
import { SearchButton, SearchModal } from "./components/search.js";
import { SongData } from "./components/song-data.js";
import { Volume } from "./components/volume.js";
import { Weather } from "./components/weather.js";
import { Modal } from "./mixins/modal.js";

// @ts-ignore
window.liveCM = {
  components: {
    clock: Clock,
    fullscreen: Fullscreen,
    searchButton: SearchButton,
    searchModal: SearchModal,
    songData: SongData,
    volume: Volume,
    weather: Weather,
  },
  mixins: {
    modal: Modal,
  },
};

import "alpinejs";
