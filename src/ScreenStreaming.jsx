import React, { useState, useRef } from "react";

const ScreenStreaming = () => {
  const videoElem = useRef(null);
  const logElem = useRef(null);
  const [displayMediaStream, setDisplayMediaStream] = useState(null);

  const displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  const startCapture = () => {
    logElem.current.innerHTML = "";
    try {
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((stream) => {
          videoElem.current.srcObject = stream;
          videoElem.current.onloadedmetadata = () => {
            videoElem.current.play();
          };
          setDisplayMediaStream(stream);
        });
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const stopCapture = () => {
    if (displayMediaStream) {
      const tracks = displayMediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      dumpOptionsInfo();
      videoElem.current.srcObject = null;
      setDisplayMediaStream(null);
    }
  };

  const dumpOptionsInfo = () => {
    if (displayMediaStream) {
      const videoTrack = displayMediaStream.getVideoTracks()[0];
      console.info("Track settings:");
      console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
      console.info("Track constraints:");
      console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    }
  };

  return (
    <div>
      <h1>Realtime communication with WebRTC</h1>
      <p>
        This example shows you the contents of the selected part of your
        display. Click the Start Capture button to begin.
      </p>
      <p>
        <button onClick={startCapture}>Start Capture</button>
        &nbsp;
        <button onClick={stopCapture}>Stop Capture</button>
      </p>
      <video ref={videoElem} autoPlay></video>
      <br />
      <strong>Log:</strong>
      <br />
      <pre ref={logElem}></pre>
    </div>
  );
};

export default ScreenStreaming;
