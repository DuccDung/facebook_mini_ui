// Call overlay integration for Messenger clone
// Provides simple UI flows for: incoming call, audio call, video call, and call ended.
// This is UI-only (no real signaling). It mirrors behaviors from the demo pages in this repo.

(function(){
  const qs = (sel) => document.querySelector(sel);
  const $ = (id) => document.getElementById(id);

  // Header buttons
  const btnVoiceCall = $('btnVoiceCall');
  const btnVideoCall = $('btnVideoCall');

  // Overlays
  const incomingModal = $('incomingCallModal');
  const audioOverlay = $('audioCallOverlay');
  const videoOverlay = $('videoCallOverlay');
  const endedOverlay = $('callEndedOverlay');

  // Incoming controls
  const incomingCloseBtn = $('incomingCloseBtn');
  const incomingDeclineBtn = $('incomingDeclineBtn');
  const incomingAcceptBtn = $('incomingAcceptBtn');

  // Audio call controls
  const acMuteBtn = $('acMuteBtn');
  const acHangupBtn = $('acHangupBtn');
  const acFullscreenBtn = $('acFullscreenBtn');

  // Video call controls
  const vcToggleVideoBtn = $('vcToggleVideoBtn');
  const vcMuteBtn = $('vcMuteBtn');
  const vcHangupBtn = $('vcHangupBtn');
  const vcFullscreenBtn = $('vcFullscreenBtn');
  const vcLocalThumb = $('vcLocalThumb');
  const vcLocal = $('vcLocal');
  const vcLocalFull = $('vcLocalFull');
  const vcRemote = $('vcRemote');
  const vcRemoteThumb = $('vcRemoteThumb');
  const vcRemoteThumbVideo = $('vcRemoteThumbVideo');

  // Ended overlay controls
  const ceRedialBtn = $('ceRedialBtn');
  const ceCloseBtn = $('ceCloseBtn');

  // Peer info from current chat header
  const peerAvatar = $('peerAvatar');
  const peerName = $('peerName');

  // State
  let cameraStream = null;
  let cameraEnabled = false;
  let audioMuted = true; // mute by default
  let localFocused = false;

  const VIDEO_OFF_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-off">
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"/>
      <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/>
      <path d="m2 2 20 20"/>
    </svg>`.trim();
  const VIDEO_ON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-on">
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"/>
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
      <rect x="2" y="6" width="14" height="12" rx="2"/>
    </svg>`.trim();

  function setHidden(el, v){ if (!el) return; v ? el.setAttribute('hidden','') : el.removeAttribute('hidden'); }
  function requestFS(){
    const doc = document;
    const el = doc.documentElement;
    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
    if (!isFs) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }

  function updateVideoBtn(){
    if (!vcToggleVideoBtn) return;
    if (cameraEnabled) {
      vcToggleVideoBtn.innerHTML = VIDEO_ON_SVG;
      vcToggleVideoBtn.setAttribute('aria-pressed','true');
    } else {
      vcToggleVideoBtn.innerHTML = VIDEO_OFF_SVG;
      vcToggleVideoBtn.setAttribute('aria-pressed','false');
    }
  }

  async function startCamera(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      cameraStream = stream;
      if (vcLocal) vcLocal.srcObject = stream;
      if (vcLocalFull) vcLocalFull.srcObject = stream;
      await vcLocal?.play().catch(()=>{});
      await vcLocalFull?.play().catch(()=>{});
      if (vcLocalThumb) vcLocalThumb.style.display = 'block';
      cameraEnabled = true; updateVideoBtn();
      // honor mute state
      if (audioMuted) stream.getAudioTracks().forEach(t=>t.enabled=false);
    } catch (e){
      console.warn('getUserMedia failed', e);
      stopCamera();
    }
  }
  function stopCamera(){
    if (cameraStream) cameraStream.getTracks().forEach(t=>t.stop());
    cameraStream = null;
    if (vcLocal) vcLocal.srcObject = null;
    if (vcLocalFull) vcLocalFull.srcObject = null;
    if (vcLocalThumb) vcLocalThumb.style.display = 'none';
    cameraEnabled = false; updateVideoBtn();
    toggleLocalFocus(false);
  }
  async function toggleCamera(){
    if (cameraEnabled) stopCamera(); else await startCamera();
  }
  function toggleMute(){
    audioMuted = !audioMuted;
    if (cameraStream) cameraStream.getAudioTracks().forEach(t => t.enabled = !audioMuted);
    if (vcMuteBtn) vcMuteBtn.setAttribute('aria-pressed', String(!audioMuted));
    if (acMuteBtn) acMuteBtn.setAttribute('aria-pressed', String(!audioMuted));
  }
  function toggleLocalFocus(force){
    if (typeof force === 'boolean') localFocused = force; else localFocused = !localFocused;
    document.body.classList.toggle('local-focused', localFocused);
    if (!vcLocalThumb || !vcRemoteThumb) return;
    if (localFocused) {
      if (vcLocalFull) vcLocalFull.style.display = 'block';
      vcRemoteThumb.style.display = 'block';
      vcLocalThumb.style.display = 'none';
    } else {
      if (vcLocalFull) vcLocalFull.style.display = 'none';
      vcRemoteThumb.style.display = 'none';
      if (cameraEnabled) vcLocalThumb.style.display = 'block';
    }
  }

  // Overlay open/close helpers
  function openIncoming(name, avatar){
    $('incomingName').textContent = name;
    $('incomingAvatar').src = avatar;
    setHidden(incomingModal, false);
  }
  function closeIncoming(){ setHidden(incomingModal, true); }

  function openAudioCall(name, avatar){
    $('acName').textContent = name;
    $('acAvatar').src = avatar;
    $('acStatus').textContent = 'Đang gọi...';
    setHidden(audioOverlay, false);
  }
  function closeAudioCall(){ setHidden(audioOverlay, true); }

  async function openVideoCall(name, avatar){
    // Ensure initial UI
    updateVideoBtn();
    toggleLocalFocus(false);
    setHidden(videoOverlay, false);
    await startCamera();
  }
  function closeVideoCall(){
    stopCamera();
    setHidden(videoOverlay, true);
  }

  function showEnded(name, avatar){
    $('ceName').textContent = name;
    $('ceAvatar').src = avatar;
    setHidden(endedOverlay, false);
  }
  function hideEnded(){ setHidden(endedOverlay, true); }

  function currentPeer(){
    return {
      name: peerName?.textContent || 'Bạn bè',
      avatar: peerAvatar?.getAttribute('src') || 'assets/images/avatar-default.png',
    };
  }

  // Wire header buttons
  btnVoiceCall?.addEventListener('click', () => {
    const { name, avatar } = currentPeer();
    openAudioCall(name, avatar);
  });
  btnVideoCall?.addEventListener('click', async () => {
    const { name, avatar } = currentPeer();
    await openVideoCall(name, avatar);
  });

  // Incoming modal buttons
  incomingCloseBtn?.addEventListener('click', closeIncoming);
  incomingDeclineBtn?.addEventListener('click', () => {
    closeIncoming();
    // show ended quickly
    const { name, avatar } = currentPeer();
    showEnded(name, avatar);
  });
  incomingAcceptBtn?.addEventListener('click', async () => {
    const { name, avatar } = currentPeer();
    closeIncoming();
    await openAudioCall(name, avatar);
  });

  // Audio call handlers
  acMuteBtn?.addEventListener('click', toggleMute);
  acHangupBtn?.addEventListener('click', () => {
    closeAudioCall();
    const { name, avatar } = currentPeer();
    showEnded(name, avatar);
  });
  acFullscreenBtn?.addEventListener('click', requestFS);

  // Video call handlers
  vcToggleVideoBtn?.addEventListener('click', toggleCamera);
  vcMuteBtn?.addEventListener('click', toggleMute);
  vcHangupBtn?.addEventListener('click', () => {
    closeVideoCall();
    const { name, avatar } = currentPeer();
    showEnded(name, avatar);
  });
  vcFullscreenBtn?.addEventListener('click', requestFS);

  // Swap focus
  vcLocalThumb?.addEventListener('click', () => toggleLocalFocus(true));
  vcLocalThumb?.addEventListener('keydown', (e) => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleLocalFocus(true);} });
  vcRemoteThumb?.addEventListener('click', () => toggleLocalFocus(false));
  vcRemoteThumb?.addEventListener('keydown', (e) => { if (e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleLocalFocus(false);} });

  // Ended overlay buttons
  ceRedialBtn?.addEventListener('click', () => {
    hideEnded();
    const { name, avatar } = currentPeer();
    openAudioCall(name, avatar);
  });
  ceCloseBtn?.addEventListener('click', hideEnded);

  // Expose minimal API
  window.callUI = {
    openIncoming,
    openAudioCall,
    closeAudioCall,
    openVideoCall,
    closeVideoCall,
    showEnded,
    hideEnded,
    toggleMute,
    toggleCamera,
    toggleLocalFocus,
  };
})();
