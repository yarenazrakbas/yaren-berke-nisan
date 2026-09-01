(function () {
  'use strict';

  const EVENT_DATE = new Date('2026-09-26T19:00:00+03:00');
  const EVENT_TITLE = 'Yaren & Berke Nişan';
  const EVENT_LOCATION = "LUN'ADA DAVET EVİ, Bağlar Mah. Yavuz Selim Cad. No:106/1B, Erenler/Sakarya";
  const EVENT_DESCRIPTION = 'Nişanımıza Hoşgeldiniz — Yaren & Berke';

  // ===== Envelope Open =====
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainContent = document.getElementById('main-content');
  const openBtn = document.getElementById('open-envelope');
  const envelope = document.querySelector('.envelope');
  const musicToggle = document.getElementById('music-toggle');

  document.body.classList.add('envelope-locked');

  function openEnvelope() {
    if (openBtn.disabled) return;
    openBtn.disabled = true;

    envelope.classList.add('opened');

    setTimeout(function () {
      mainContent.classList.remove('hidden');
      document.body.classList.remove('envelope-locked');
      window.scrollTo(0, 0);
      requestAnimationFrame(function () {
        mainContent.classList.add('revealed');
        envelopeScreen.classList.add('fading');
      });
      musicToggle.classList.add('visible');
      startCountdown();
    }, 2500);

    setTimeout(function () {
      envelopeScreen.classList.add('hidden');
    }, 3500);
  }

  openBtn.addEventListener('click', openEnvelope);

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

  // ===== Open the phone's calendar application =====
  const calendarFileUrl =
    'https://yarenazrakbas.github.io/yaren-berke-nisan/event.ics?v=11';

  function openPhoneCalendar() {
    const userAgent = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS) {
      // iOS opens a text/calendar response in the Calendar event preview.
      window.location.assign(calendarFileUrl);
      return;
    }

    if (isAndroid) {
      const beginTime = new Date('2026-09-26T19:00:00+03:00').getTime();
      const endTime = new Date('2026-09-26T22:00:00+03:00').getTime();
      const intent = [
        'intent://#Intent',
        'action=android.intent.action.INSERT',
        'type=vnd.android.cursor.item/event',
        'S.title=' + encodeURIComponent(EVENT_TITLE),
        'S.description=' + encodeURIComponent(EVENT_DESCRIPTION),
        'S.eventLocation=' + encodeURIComponent(EVENT_LOCATION),
        'l.beginTime=' + beginTime,
        'l.endTime=' + endTime,
        'end'
      ].join(';');

      window.location.href = intent;
      return;
    }

    window.alert('Takvime eklemek için bu davetiyeyi telefonunuzdan açın.');
  }

  document.querySelectorAll('.calendar-button').forEach(function (button) {
    button.addEventListener('click', openPhoneCalendar);
  });

  // ===== Music Toggle =====
  let isPlaying = false;

  musicToggle.addEventListener('click', function () {
    isPlaying = !isPlaying;
    musicToggle.querySelector('.icon-on').classList.toggle('hidden', !isPlaying);
    musicToggle.querySelector('.icon-off').classList.toggle('hidden', isPlaying);
  });
})();
