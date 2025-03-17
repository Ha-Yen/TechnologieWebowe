const bannerGifs = document.querySelectorAll(".banner-gif");

bannerGifs.forEach((gif) => {
  gif.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
});
