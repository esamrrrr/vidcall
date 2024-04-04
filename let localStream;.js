let localStream;
let remoteStream;
let pc;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');

startButton.addEventListener('click', startCall);
hangupButton.addEventListener('click', hangUp);

async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    pc = new RTCPeerConnection();
    pc.addStream(localStream);
    pc.onaddstream = (event) => {
      remoteVideo.srcObject = event.stream;
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer to the other peer (signaling server needed)
  } catch (error) {
    console.error('Error starting call:', error);
  }
}

function hangUp() {
  pc.close();
  localStream.getTracks().forEach(track => track.stop());
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}
