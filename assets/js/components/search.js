import Spruce from "@ryangjchandler/spruce";

const FOCUSABLE_SELECTORS =
  "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

Spruce.store("search", { open: false });

export const SearchButton = () => {
  return {
    focusSearchModal() {
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

export const SearchModal = () => {
  return {
    query: "",
    prev_query: "",
    loading: false,
    rowCount: 10,
    data: null,
    songLinks: null,
    request_no: Date.now(),
    /**
     *
     * @param {Event} $event
     */
    closeModal($event) {
      let self = this;
      const openButton = document.getElementById("search-button");
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
    /**
     *
     * @param {Event} $event
     */
    tabEvent($event) {
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
    fetchSearch() {
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
