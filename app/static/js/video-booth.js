let ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
};

ready(() => {
  // preload shutter audio clip
  let shutter = new Audio();
  shutter.autoplay = false;
  shutter.src = navigator.userAgent.match(/Firefox/)
    ? "/static/audio/shutter.ogg"
    : "/static/audio/shutter.mp3";

  function preview_snapshot() {
    // play sound effect
    try {
      shutter.currentTime = 0;
    } catch (e) {} // fails in IE
    shutter.play();

    // freeze camera so user can preview current frame
    Webcam.freeze();

    // swap button sets
    document.getElementById("pre-capture-buttons").style.display = "none";
    document.getElementById("post-capture-buttons").style.display = "";
  }

  function cancel_preview() {
    // cancel preview freeze and return to live camera view
    Webcam.unfreeze();

    // swap buttons back to first set
    document.getElementById("pre_take_buttons").style.display = "";
    document.getElementById("post_take_buttons").style.display = "none";
  }

  function save_capture() {
    // actually snap a photo from preview freeze.
    Webcam.snap(function (data_uri) {
      // display results in page
      console.log(data_uri);

      // shut down camera, stop capturing
      Webcam.reset();

      // Example POST method implementation:
      async function postData(url = "", data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      postData("/photo_capture", { photo_cap: data_uri }).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
      });
    });
  }
  /* Do things after DOM has fully loaded */
  Webcam.set({
    // live preview size
    width: 320,
    height: 240,

    // device capture size
    dest_width: 640,
    dest_height: 480,

    // final cropped size
    crop_width: 480,
    crop_height: 480,

    // format and quality
    image_format: "jpeg",
    jpeg_quality: 90,

    // flip horizontal (mirror mode)
    flip_horiz: true,
  });
  Webcam.attach("#capture-camera");
});
