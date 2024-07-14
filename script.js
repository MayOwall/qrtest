// script.js

const video = document.getElementById("video");
const size = document.getElementById("size");
const output = document.getElementById("output");
const startButton = document.getElementById("button");
let videoStream = null;
let scanning = true;

video.addEventListener("loadedmetadata", function () {
  const { videoWidth, videoHeight } = video;
  size.innerHTML = `${videoWidth}, ${videoHeight}`;
});

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "environment",
      },
    })
    .then((stream) => {
      videoStream = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen

      video.play();
      scanning = true;

      requestAnimationFrame(tick);
      startButton.style.display = "none";
    })
    .catch((err) => {
      console.error("Error accessing the camera: ", err);
      output.innerHTML = `Error accessing the camera: ${err}`;
    });
}

function stopVideo() {
  if (videoStream) {
    let tracks = videoStream.getTracks();
    tracks.forEach((track) => track.stop());
  }
  scanning = false;
  startButton.style.display = "block";
}

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA && scanning) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      output.innerHTML = `QR Code Data: ${code.data}`;
      stopVideo();
    } else {
      output.innerHTML = "No QR code detected.";
    }
  }
  if (scanning) {
    requestAnimationFrame(tick);
  }
}

startButton.addEventListener("click", startVideo);

startVideo();
