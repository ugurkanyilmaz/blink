/*
  Video signalling routes (REST adjuncts to WebRTC signaling over sockets)

  Planned endpoints (examples):
  - POST /video/call-request -> optional REST endpoint to request a call
  - POST /video/token        -> issue temporary tokens for TURN/STUN (if used)
  - WebRTC signaling will primarily be handled in `sockets/video.socket.ts`
*/
