function handleAudioFile(event) {
  var files = event.target.files;
  $("#audio_src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
}

document
  .getElementById("audioFile")
  .addEventListener("change", handleAudioFile, false);
