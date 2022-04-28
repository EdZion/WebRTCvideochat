const popupButton = document.getElementById('popup');
const heroBox = document.getElementById('hero');
const videosBox = document.getElementById('videos');
const buttonsBox = document.getElementById('buttons');
const closeButton = document.getElementById('close');

popupButton.onclick = async () => {
  if (heroBox.style.display === "none") {
    heroBox.style.display = "flex";
    videosBox.style.filter = "brightness(0.8)";
    buttonsBox.style.filter = "brightness(0.8)";
  } else {
    heroBox.style.display = "none";
    videosBox.style.filter = "none";
    buttonsBox.style.filter = "none";
  }
}

closeButton.onclick = async () => {
  heroBox.style.display = "none";
  videosBox.style.filter = "none"
  buttonsBox.style.filter = "none"
}