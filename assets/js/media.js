// ─── SPOTIFY ─────────────────────────────────────────────
function loadSpotify(){
  let url = document.getElementById('spotifyUrl').value.trim();
  if(!url){ showToast('⚠ PASTE URL SPOTIFY DULU!'); return; }
  const match = url.match(/spotify\.com\/(playlist|track|album|artist)\/([a-zA-Z0-9]+)/);
  if(match){
    const embedUrl = 'https://open.spotify.com/embed/'+match[1]+'/'+match[2]+'?utm_source=generator&theme=0';
    document.getElementById('spotifyContainer').innerHTML =
      '<iframe style="border:3px solid #0d0d0d;display:block" src="'+embedUrl+'" width="100%" height="152" allow="autoplay;clipboard-write;encrypted-media;fullscreen;picture-in-picture" loading="lazy"></iframe>';
    localStorage.setItem('focusOS_spotify', url);
    showToast('♪ MUSIC LOADED!');
  } else {
    showToast('⚠ URL TIDAK VALID!<br>Gunakan link dari Spotify.');
  }
}

// ─── MEDIA TABS & YOUTUBE ─────────────────────────────────
function switchMediaTab(tab, btnEl){
  document.querySelectorAll('.media-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.media-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('media-'+tab).classList.add('active');
  btnEl.classList.add('active');
}

function extractYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (url.trim().length === 11) {
    return url.trim();
  }
  return null;
}

function buildYtSlot(containerId, videoId) {
  const wrapper = document.getElementById(containerId);
  if (!wrapper) return;

  // Reset slot
  wrapper.innerHTML = '';

  // Buat div target untuk player
  const playerDiv = document.createElement('div');
  playerDiv.style.width = '100%';
  playerDiv.style.aspectRatio = '16/9';
  wrapper.appendChild(playerDiv);

  new YT.Player(playerDiv, {
    videoId: videoId,
    width: '100%',
    playerVars: { rel: 0, modestbranding: 1 },
    events: {
      onError: function(e) {
        // 101 & 150 = embedding dilarang oleh pemilik video
        const msg = (e.data === 101 || e.data === 150)
          ? '🚫 VIDEO INI<br>TIDAK BISA<br>DI-EMBED<br><br>COBA VIDEO LAIN'
          : '⚠ GAGAL LOAD<br>VIDEO<br>(ERROR '+e.data+')';
        wrapper.innerHTML = `
          <div style="aspect-ratio:16/9;border:3px solid var(--black);background:#f0ece0;
               display:flex;align-items:center;justify-content:center;text-align:center;
               font-family:'Press Start 2P',monospace;font-size:7px;color:var(--red);
               line-height:2;padding:12px">${msg}</div>`;
      }
    }
  });
}

let ytApiReady = false;
let ytApiLoading = false;
let ytQueue = [];

window.onYouTubeIframeAPIReady = function() {
  ytApiReady = true;
  ytQueue.forEach(fn => fn());
  ytQueue = [];
};

function ensureYtApi(callback) {
  if (ytApiReady) { callback(); return; }
  ytQueue.push(callback);
  if (!ytApiLoading) {
    ytApiLoading = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
}

function loadYoutube(){
  let url1 = document.getElementById('ytUrl1').value.trim();
  let url2 = document.getElementById('ytUrl2').value.trim();

  if(!url1 && !url2){
    showToast('⚠ PASTE MINIMAL SATU URL YOUTUBE!');
    return;
  }

  const id1 = extractYoutubeId(url1);
  const id2 = extractYoutubeId(url2);

  if((url1 && !id1) || (url2 && !id2)){
    showToast('⚠ URL YOUTUBE TIDAK VALID!');
    return;
  }

  localStorage.setItem('focusOS_yt1', url1);
  localStorage.setItem('focusOS_yt2', url2);

  const container = document.getElementById('ytContainer');
  // Setup slot div
  container.innerHTML = '';
  if (id1 && id2) {
    container.style.gridTemplateColumns = '1fr 1fr';
    container.innerHTML = '<div id="ytSlot1"></div><div id="ytSlot2"></div>';
  } else {
    container.style.gridTemplateColumns = '1fr';
    container.innerHTML = `<div id="${id1 ? 'ytSlot1' : 'ytSlot2'}"></div>`;
  }

  showToast('📺 LOADING YOUTUBE...');

  ensureYtApi(() => {
    if (id1) buildYtSlot('ytSlot1', id1);
    if (id2) buildYtSlot('ytSlot2', id2);
  });
}
