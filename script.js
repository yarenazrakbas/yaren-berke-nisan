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

  function openEnvelope() {
    if (openBtn.disabled) return;
    openBtn.disabled = true;

    envelope.classList.add('opened');

    setTimeout(function () {
      envelopeScreen.classList.add('opening');
    }, 600);

    setTimeout(function () {
      envelopeScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      musicToggle.classList.add('visible');
      startCountdown();
    }, 1400);
  }

  openBtn.addEventListener('click', openEnvelope);
  openBtn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    openEnvelope();
  }, { passive: false });

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

  // ===== Add to Calendar =====
  document.getElementById('add-calendar').addEventListener('click', function () {
    const start = formatICSDate(EVENT_DATE);
    const end = formatICSDate(new Date(EVENT_DATE.getTime() + 4 * 60 * 60 * 1000));

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YarenBerke//Nişan//TR',
      'BEGIN:VEVENT',
      'DTSTART:' + start,
      'DTEND:' + end,
      'SUMMARY:' + EVENT_TITLE,
      'DESCRIPTION:' + EVENT_DESCRIPTION,
      'LOCATION:' + EVENT_LOCATION,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'yaren-berke-nisan.ics';
    link.click();
    URL.revokeObjectURL(url);
  });

  function formatICSDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  // ===== RSVP Form =====
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');

  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      attendance: formData.get('attendance'),
      guests: formData.get('guests'),
      message: formData.get('message')
    };

    const responses = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
    data.timestamp = new Date().toISOString();
    responses.push(data);
    localStorage.setItem('rsvp_responses', JSON.stringify(responses));

    rsvpForm.classList.add('hidden');
    rsvpSuccess.classList.remove('hidden');
  });

  // ===== Music Toggle (placeholder — add your own audio file) =====
  let isPlaying = false;

  musicToggle.addEventListener('click', function () {
    isPlaying = !isPlaying;
    musicToggle.querySelector('.icon-on').classList.toggle('hidden', !isPlaying);
    musicToggle.querySelector('.icon-off').classList.toggle('hidden', isPlaying);

    // To enable background music, uncomment and add an audio file:
    // if (isPlaying) { audio.play(); } else { audio.pause(); }
  });
})();
