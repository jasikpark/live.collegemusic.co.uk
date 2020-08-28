function initClock() {
  return {
    time: dayjs().format("ddd. h:mm a"),
    startClock: function () {
      const self = this;
      function updateClock() {
        self.time = dayjs().format("ddd. h:mm a");
      }
      setInterval(() => {
        updateClock();
      }, 1000);
    },
  };
}
