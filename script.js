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

  // ===== Telefon takvim uygulamasını aç =====
  const EVENT_BEGIN_MS = new Date('2026-09-26T19:00:00+03:00').getTime();
  const EVENT_END_MS = new Date('2026-09-26T22:00:00+03:00').getTime();
  const ICS_FILE_URL =
    'https://yarenazrakbas.github.io/yaren-berke-nisan/event.ics?v=14';

  function getICSContent() {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YarenBerke//Nisan//TR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:yaren-berke-nisan-20260926@yarenazrakbas.github.io',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART;TZID=Europe/Istanbul:20260926T190000',
      'DTEND;TZID=Europe/Istanbul:20260926T220000',
      'SUMMARY:Yaren & Berke Nişan',
      'DESCRIPTION:Nişanımıza Hoşgeldiniz — Yaren & Berke',
      'LOCATION:LUN\'ADA DAVET EVİ\\, Bağlar Mah. Yavuz Selim Cad. No:106/1B\\, Erenler/Sakarya',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Yaren & Berke Nişanı yarın! 26 Eylül 19:00',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  }

  function isAndroidDevice() {
    return /Android/i.test(navigator.userAgent || '');
  }

  function isIOSDevice() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || '') ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function buildAndroidIntentUrl() {
    const fallback = encodeURIComponent(ICS_FILE_URL);
    return [
      'intent://#Intent',
      'action=android.intent.action.INSERT',
      'type=vnd.android.cursor.item/event',
      'S.title=' + encodeURIComponent(EVENT_TITLE),
      'S.description=' + encodeURIComponent(EVENT_DESCRIPTION),
      'S.eventLocation=' + encodeURIComponent(EVENT_LOCATION),
      'i.beginTime=' + EVENT_BEGIN_MS,
      'i.endTime=' + EVENT_END_MS,
      'S.browser_fallback_url=' + fallback,
      'end'
    ].join(';');
  }

  function openCalendarWithICSData() {
    const blob = new Blob([getICSContent()], { type: 'text/calendar;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    window.location.assign(blobUrl);
    setTimeout(function () {
      URL.revokeObjectURL(blobUrl);
    }, 5000);
  }

  function openCalendarWithICSFile() {
    window.location.href = ICS_FILE_URL;
  }

  function openPhoneCalendar(event) {
    event.preventDefault();

    if (!isMobileDevice()) {
      window.alert('Takvime eklemek için davetiyeyi telefonunuzdan açın.');
      return;
    }

    if (isAndroidDevice()) {
      window.location.href = buildAndroidIntentUrl();
      return;
    }

    if (isIOSDevice()) {
      openCalendarWithICSData();
      return;
    }

    openCalendarWithICSFile();
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
