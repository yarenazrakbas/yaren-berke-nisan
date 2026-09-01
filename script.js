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

  // ===== Calendar with 1-day reminder =====
  function formatICSStamp(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function escapeICS(text) {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function buildICS() {
    const alarmText = 'Yaren & Berke Nişanı yarın! 26 Eylül 19:00 — LUN\'ADA DAVET EVİ';

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YarenBerke//Nisan//TR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:yaren-berke-nisan-20260926@yarenazrakbas.github.io',
      'DTSTAMP:' + formatICSStamp(new Date()),
      'DTSTART;TZID=Europe/Istanbul:20260926T190000',
      'DTEND;TZID=Europe/Istanbul:20260926T230000',
      'SUMMARY:' + escapeICS(EVENT_TITLE),
      'DESCRIPTION:' + escapeICS(EVENT_DESCRIPTION),
      'LOCATION:' + escapeICS(EVENT_LOCATION),
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:' + escapeICS(alarmText),
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function addToCalendar() {
    const ics = buildICS();
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      window.location.href = url;
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 10000);
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = 'yaren-berke-nisan.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  document.getElementById('add-calendar').addEventListener('click', addToCalendar);
  document.getElementById('add-reminder').addEventListener('click', addToCalendar);

  // ===== Music Toggle =====
  let isPlaying = false;

  musicToggle.addEventListener('click', function () {
    isPlaying = !isPlaying;
    musicToggle.querySelector('.icon-on').classList.toggle('hidden', !isPlaying);
    musicToggle.querySelector('.icon-off').classList.toggle('hidden', isPlaying);
  });
})();
