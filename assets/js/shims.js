import "focus-visible";

// Shim requestIdleCallback()
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };

// Make button-links function like buttons
(function () {
  "use strict";
  function a11yClick(link) {
    link.addEventListener("keydown", function (event) {
      var code = event.charCode || event.keyCode;
      if (code === 32) {
        event.preventDefault();
        link.click();
      }
    });
  }
  var a11yLink = document.querySelectorAll('a[role="button"]');
  for (var i = 0; i < a11yLink.length; i++) {
    a11yClick(a11yLink[i]);
  }
})();
