/// Let's extract the style of `search.njk`/`search.js` and create a wrapper element that will allow us to extract the modal design...
/// Maybe it should be a web component lol or we should use the <dialog> polyfill
/// Or maybe it should just be a collection of mixins: `{ openModal(id), closeModal(id) }`
/// What might make the most sense is putting the modal in a <template> and creating it outside of <main> when viewing it???s

import Spruce from "@ryangjchandler/spruce";

const FOCUSABLE_SELECTORS =
  "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

export const Modal = () => {
  return {
    /**
     *
     * @param {string} modalId id name of the modal to be opened
     * @param {string} storeName store name that manages whether the modal is open
     */
    openModal(modalId, storeName) {
      console.log("called liveCM.mixins.modal().openModal");
      let self = this;
      const main = document.getElementsByTagName("main")[0];
      const body = document.getElementsByTagName("body")[0];

      main.setAttribute("inert", "true");
      main.setAttribute("aria-hidden", "true");
      self.$store[storeName].open = true;
      body.classList.remove("overflow-auto");
      body.classList.add("overflow-hidden");
      const modal = document.getElementById(modalId);
      const focusableSelector = modal.querySelector(FOCUSABLE_SELECTORS);

      self.$nextTick(() => focusableSelector.focus());
    },
    /**
     *
     * @param {string} modalButtonId
     * @param {string} storeName
     * @param {Event} $event
     */
    closeModal(modalButtonId, storeName, $event) {
      console.log("called liveCM.mixins.modal().closeModal");
      let self = this;
      const modalButton = document.getElementById(modalButtonId);
      const main = document.getElementsByTagName("main")[0];
      const body = document.getElementsByTagName("body")[0];

      if (modalButton.contains($event.target)) {
        return false;
      }

      self.$store[storeName].open = false;
      main.removeAttribute("inert");
      main.removeAttribute("aria-hidden");
      body.classList.remove("overflow-hidden");
      body.classList.add("overflow-auto");
      modalButton.focus();
    },
    /**
     *
     * @param {string} modalId
     * @param {string} storeName
     * @param {Event} $event
     */
    tabEvent(modalId, storeName, $event) {
      console.log("called liveCM.mixins.modal().tabEvent");
      let self = this;
      if (self.$store[storeName].open === false) {
        return;
      }
      const modal = document.getElementById(modalId);
      const focusableElements = modal.querySelectorAll(FOCUSABLE_SELECTORS);
      const firstFocusableEl = focusableElements[0];
      const lastFocusableEl = focusableElements[focusableElements.length - 1];

      if (!modal.contains(document.activeElement)) {
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
  };
};
