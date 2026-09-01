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

  // Google Calendar API ile OAuth entegrasyonu eklendiğinde kullanılacak hatırlatma ayarı.
  // eventedit URL'si reminder parametresini resmi olarak desteklemez; API ile:
  // reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 1440 }] }
  const calendarReminderConfig = {
    useDefault: false,
    overrides: [{ method: 'popup', minutes: 1440 }]
  };

  const EVENT_DATE = new Date(engagementEvent.start);

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

  // ===== Takvime Ekle — gerçek <a href>, JS navigation yok =====
  const GOOGLE_CALENDAR_EVENT_BASE =
    'https://calendar.google.com/calendar/r/eventedit';

  function formatGoogleCalendarDate(isoString, timezone) {
    var date = new Date(isoString);
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(date);

    function part(type) {
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === type) {
          return parts[i].value;
        }
      }
      return '';
    }

    return part('year') + part('month') + part('day') +
      'T' + part('hour') + part('minute') + part('second');
  }

  function createGoogleCalendarUrl(event) {
    var start = formatGoogleCalendarDate(event.start, event.timezone);
    var end = formatGoogleCalendarDate(event.end, event.timezone);

    var params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: start + '/' + end,
      details: event.description,
      location: event.location,
      stz: event.timezone,
      etz: event.timezone
    });

    return GOOGLE_CALENDAR_EVENT_BASE + '?' + params.toString();
  }

  function initCalendarLinks() {
    var googleCalendarUrl = createGoogleCalendarUrl(engagementEvent);

    if (typeof console !== 'undefined' && console.log) {
      console.log('Calendar URL:', googleCalendarUrl);
    }

    document.querySelectorAll('.calendar-link').forEach(function (link) {
      link.href = googleCalendarUrl;
    });
  }

  initCalendarLinks();

  // ===== Background Music =====
  const bgMusic = document.getElementById('bg-music');
  let isPlaying = false;

  if (bgMusic) {
    bgMusic.volume = 0.45;
  }

  function setMusicPlaying(playing) {
    isPlaying = playing;
    musicToggle.querySelector('.icon-on').classList.toggle('hidden', !isPlaying);
    musicToggle.querySelector('.icon-off').classList.toggle('hidden', isPlaying);
    musicToggle.setAttribute('aria-label', isPlaying ? 'Müziği kapat' : 'Müziği aç');
  }

  musicToggle.addEventListener('click', function () {
    if (!bgMusic) return;

    if (isPlaying) {
      bgMusic.pause();
      setMusicPlaying(false);
      return;
    }

    bgMusic.play().then(function () {
      setMusicPlaying(true);
    }).catch(function () {
      setMusicPlaying(false);
    });
  });
})();
