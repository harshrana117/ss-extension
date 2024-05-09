function scrollToTop() {
  window.scrollTo(0, 0);
}

(function () {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const totalHeight = document.body.scrollHeight;
  const totalWidth = document.body.scrollWidth;

  const iterations = Math.floor(totalHeight / viewportHeight);

  let remainingHeight = totalHeight % viewportHeight;

  scrollToTop();

  return {
    viewportHeight,
    viewportWidth,
    totalHeight,
    totalWidth,
    iterations,
    remainingHeight,
  };
})();
