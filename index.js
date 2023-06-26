function handleAudioFile(event) {
  var files = event.target.files;
  $("#audio_src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
}

document
  .getElementById("audioFile")
  .addEventListener("change", handleAudioFile, false);

const audioCtx = new (window.AudioContext || window.AudioContext)();
const audioElement = document.querySelector("audio");
const canvasElement = document.querySelector("canvas");
const canvasCtx = canvasElement.getContext("2d");
const playPauseButton = document.querySelector(".play-pause");
const seekbar = document.querySelector(".seekbar");
const volumeBar = document.querySelector(".volume");

const pauseIcon = `<span class="material-icons">pause</span>`;
const playIcon = `<span class="material-icons">play_arrow</span>`;
const replayIcon = `<span class="material-icons">replay</span>`;

const width = canvasElement.clientWidth;
const height = canvasElement.clientHeight;
seekbar.value = 0;
volumeBar.value = 100;

playPauseButton.addEventListener("click", togglePlayPause);

audioElement.addEventListener("timeupdate", setProgress);
audioElement.addEventListener("ended", onEnd);
audioElement.addEventListener("canplay", setDuration);

seekbar.addEventListener("input", onSeek);

const source = audioCtx.createMediaElementSource(audioElement);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

source.connect(analyser);
analyser.connect(audioCtx.destination);

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let audioState = {
  isReplay: false,
  isPaused: true,
};

function draw() {
  analyser.getByteFrequencyData(dataArray);
  canvasCtx.fillStyle = "rgb(2,2,2)";
  canvasCtx.fillRect(0, 0, width, height);
  const barWidth = (width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2.8;
    canvasCtx.fillStyle = "rgb(50,50, 200)";
    canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
  requestAnimationFrame(draw);
}
draw();

function togglePlayPause() {
  audioCtx.resume().then(() => {
    if (audioState.isPaused) {
      playPauseButton.innerHTML = pauseIcon;
      audioElement.play();
    } else {
      if (audioState.isReplay) {
        playPauseButton.innerHTML = pauseIcon;
        audioElement.play();
        audioState.isReplay = false;
        return;
      }
      playPauseButton.innerHTML = playIcon;
      audioElement.pause();
    }
    audioState.isPaused = !audioState.isPaused;
  });
}

function setProgress() {
  seekbar.value = audioElement.currentTime;
}

function setDuration() {
  seekbar.max = audioElement.duration;
}

function onEnd() {
  playPauseButton.innerHTML = replayIcon;
  audioElement.currentTime = 0;
  seekbar.value = 0;
  audioState.isReplay = true;
}

function onSeek(event) {
  audioElement.currentTime = event.target.value;
}
