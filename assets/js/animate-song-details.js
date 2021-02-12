export const animateSongDetails = () => {
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
