// script.js

const video = document.getElementById("video");
const output = document.getElementById("output");

navigator.mediaDevices
  .getUserMedia({
    video: {
      facingMode: "environment",
      width: { ideal: 1280 }, // ideal 해상도를 설정합니다.
      height: { ideal: 720 }, // ideal 해상도를 설정합니다.
    },
  })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  })
  .catch((err) => {
    console.error("Error accessing the camera: ", err);
    output.innerHTML = `Error accessing the camera: ${err}`;
  });

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      output.innerHTML = `QR Code Data: ${code.data}`;
    } else {
      output.innerHTML = "No QR code detected.";
    }
  }
  requestAnimationFrame(tick);
}
