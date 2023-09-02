import { defineOpenpppSidebar } from "../components/sidebar";

/** @type {MediaStreamConstraints} */
const VID_CONSTRAINTS = {
  video: true,
};

async function startLiveVideoFeed() {
  /** @type {HTMLVideoElement} */
  // @ts-ignore
  const videoElement = document.querySelector("video");
  const stream = await window.navigator.mediaDevices.getUserMedia(
    VID_CONSTRAINTS
  );
  videoElement.srcObject = stream;
}

// on page parsed:

defineOpenpppSidebar();
startLiveVideoFeed();
