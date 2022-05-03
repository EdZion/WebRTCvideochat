const popupButton = document.getElementById('popup');
const heroBox = document.getElementById('hero');
const videosBox = document.getElementById('videos');
const buttonsBox = document.getElementById('buttons');
const closeButton = document.getElementById('close');

const muteButton = document.getElementById('muteButton');
const webcamButton = document.getElementById('webcamButton');
const soundButton = document.getElementById('soundButton');

const camImage = document.getElementById('camImage');
const muteImage = document.getElementById('muteImage');
const soundImage = document.getElementById('soundImage');

popupButton.onclick = () => {
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

closeButton.onclick = () => {
  heroBox.style.display = "none";
  videosBox.style.filter = "none"
  buttonsBox.style.filter = "none"
}

webcamButton.onclick = () => {
  if(camImage.src.match("/images/cam.svg")){
    camImage.src = "/images/camdisabled.svg";
  }else{
    camImage.src = "/images/cam.svg";
  }
}

muteButton.onclick = () => {
  if(muteImage.src.match("/images/microphone.svg")){
    muteImage.src = "/images/microphonedisabled.svg";
  }else{
    muteImage.src = "/images/microphone.svg";
  }
}

soundButton.onclick = () => {
  if(soundImage.src.match("/images/Speaker.svg")){
    soundImage.src = "/images/Speakeroff.svg";
  }else{
    soundImage.src = "/images/Speaker.svg";
  }
}
