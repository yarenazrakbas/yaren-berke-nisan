(function () {
  'use strict';

  // ===== Merkezi etkinlik config =====
  const engagementEvent = {
    title: 'Yaren & Berke Nişan Töreni',
    description: 'Nişanımıza Hoşgeldiniz — Yaren & Berke',
    location: "LUN'ADA DAVET EVİ, Bağlar Mah. Yavuz Selim Cad. No:106/1B, Erenler/Sakarya",
    start: '2026-09-26T19:00:00+03:00',
    end: '2026-09-26T22:00:00+03:00',
    timezone: 'Europe/Istanbul'
  };

  const EVENT_DATE = new Date(engagementEvent.start);

  // ===== Background Music (Android / iOS uyumlu) =====
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let musicToggleLock = false;
  let userMuted = false;
  let envelopeOpened = false;
  let musicUnlocked = false;

  function isMusicPlaying() {
    return !!(bgMusic && !bgMusic.paused && !bgMusic.ended);
  }

  function syncMusicUI() {
    if (!musicToggle || !bgMusic) return;

    var playing = isMusicPlaying();
    musicToggle.querySelector('.icon-on').classList.toggle('hidden', !playing);
    musicToggle.querySelector('.icon-off').classList.toggle('hidden', playing);
    musicToggle.setAttribute('aria-label', playing ? 'Müziği kapat' : 'Müziği aç');
    musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicToggle.classList.toggle('is-muted', !playing);
  }

  function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    syncMusicUI();
  }

  // play() kullanıcı dokunuşu içinde senkron çağrılmalı
  function unlockAndStartMusic() {
    if (!bgMusic || userMuted) return;

    if (window.__ybMusicBooted && !bgMusic.paused) {
      syncMusicUI();
      return;
    }

    var targetVolume = 0.45;

    try {
      bgMusic.muted = false;

      // Android / iOS: önce çok düşük sesle başlat, sonra aç
      bgMusic.volume = 0.001;
      bgMusic.play();
      bgMusic.volume = targetVolume;

      if (bgMusic.paused) {
        bgMusic.muted = true;
        bgMusic.play();
        bgMusic.muted = false;
        bgMusic.volume = targetVolume;
      }

      if (bgMusic.paused) {
        bgMusic.volume = targetVolume;
        bgMusic.play();
      }

      musicUnlocked = true;
      window.__ybMusicBooted = true;
    } catch (err) {
      /* Tarayıcı sesi engelledi */
    }

    syncMusicUI();
  }

  function toggleMusic() {
    if (!bgMusic || musicToggleLock) return;

    musicToggleLock = true;
    window.setTimeout(function () {
      musicToggleLock = false;
    }, 400);

    if (isMusicPlaying()) {
      userMuted = true;
      stopMusic();
      return;
    }

    userMuted = false;
    unlockAndStartMusic();
  }

  if (bgMusic) {
    bgMusic.volume = 0.45;
    bgMusic.addEventListener('play', syncMusicUI);
    bgMusic.addEventListener('pause', syncMusicUI);
    bgMusic.addEventListener('ended', syncMusicUI);
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleMusic();
    });

    syncMusicUI();
  }

  // ===== Envelope Open =====
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainContent = document.getElementById('main-content');
  const openBtn = document.getElementById('open-envelope');
  const envelope = document.querySelector('.envelope');

  document.body.classList.add('envelope-locked');

  function openEnvelope() {
    if (envelopeOpened || openBtn.disabled) return;
    envelopeOpened = true;
    openBtn.disabled = true;

    envelope.classList.add('opened');

    if (musicToggle) {
      musicToggle.classList.add('visible');
    }

    setTimeout(function () {
      mainContent.classList.remove('hidden');
      document.body.classList.remove('envelope-locked');
      window.scrollTo(0, 0);
      requestAnimationFrame(function () {
        mainContent.classList.add('revealed');
        envelopeScreen.classList.add('fading');
      });
      startCountdown();
    }, 2500);

    setTimeout(function () {
      envelopeScreen.classList.add('hidden');
    }, 3500);
  }

  function handleIntroTap() {
    if (envelopeOpened) return;

    unlockAndStartMusic();
    openEnvelope();
  }

  if (envelopeScreen) {
    envelopeScreen.addEventListener('touchstart', handleIntroTap, {
      passive: true,
      capture: true
    });

    envelopeScreen.addEventListener('click', function (event) {
      event.preventDefault();
      handleIntroTap();
    }, true);
  }

  // ===== Countdown =====
  let countdownInterval;

  function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const now = new Date();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      setCountdownValues(0, 0, 0, 0);
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountdownValues(days, hours, minutes, seconds);
  }

  function setCountdownValues(days, hours, minutes, seconds) {
    document.getElementById('days').textContent = pad(days);
    document.getElementById('hours').textContent = pad(hours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }
})();
