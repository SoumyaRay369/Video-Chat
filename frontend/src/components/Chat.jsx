import { useRef, useEffect, useState } from "react";
import { Peer } from 'peerjs';

export const Chat = () => {
  const [peer, setPeer] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState('');

  const videoRef = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    // Initialize the Peer instance once
    const newPeer = new Peer();

    newPeer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
    });

    newPeer.on('call', function (call) {
      console.log('Receiving a call...');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          call.answer(stream); // Answer the call with your own stream
          console.log('Answered the call');

          call.on('stream', function (remoteStream) {
            if (videoRef2.current) {
              videoRef2.current.srcObject = remoteStream;
            }
          });
        })
        .catch(err => {
          console.error('Failed to get local stream', err);
        });
    });

    setPeer(newPeer);

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const constraints = {
      video: {
        width: 640,
        height: 480,
      },
      audio: false,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  }, []);

  function callPeer() {
    if (!peer || !remotePeerId) {
      console.error('Peer or Remote Peer ID is missing');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        const call = peer.call(remotePeerId, stream);
        console.log('Calling peer:', remotePeerId);

        call.on('stream', function (remoteStream) {
          console.log('Received remote stream');
          if (videoRef2.current) {
            videoRef2.current.srcObject = remoteStream;
          }
        });

        call.on('error', (err) => {
          console.error('Call error:', err);
        });

      })
      .catch(err => {
        console.error('Failed to get local stream', err);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-5 h-screen bg-gradient-to-br from-indigo-900 to-sky-600">
      <div className="flex flex-col gap-y-5 items-center">
        <video ref={videoRef} autoPlay className="border border-gray-400 rounded-xl w-1/2"></video>
        <video ref={videoRef2} autoPlay className="border border-gray-400 rounded-xl w-1/2"></video>
      </div>
      <div className="flex flex-col gap-y-2">
          <input onChange={(e) => setRemotePeerId(e.target.value)} type="text" className="p-4 text-white rounded-md bg-sky-500 border-none outline-none font-mono placeholder:italic placeholder:text-white" placeholder="Enter PeerId of Friend" />
          <button onClick={callPeer} className="p-4 text-white rounded-md bg-slate-500 hover:bg-black font-mono ">Call Peer</button>
      </div>
    </div>
  );
}

