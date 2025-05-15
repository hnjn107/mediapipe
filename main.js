import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

// Initialize the drawing canvas
const videoElement = document.getElementById('input-video');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');

// Set up canvas dimensions
function onResize() {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
}

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Process results from MediaPipe
hands.onResults((results) => {
  // Clear canvas
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  // Draw hand landmarks
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      // Draw hand connections
      drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 5
      });
      // Draw landmark points
      drawLandmarks(canvasCtx, landmarks, {
        color: '#FF0000',
        lineWidth: 2
      });
    }
  }
  canvasCtx.restore();
});

// Initialize camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

// Start camera
camera.start();

// Handle resize events
videoElement.addEventListener('loadedmetadata', onResize);