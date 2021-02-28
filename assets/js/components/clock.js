export const Clock = () => {
  return {
    time: new Intl.DateTimeFormat("default", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(),
    unix: new Date().toISOString(),
    startClock() {
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
