/* ==========================================================================
   『停滞都市のノイズ ―The 71% Illusion―』 コアゲームエンジン
   ========================================================================== */

const GAME_DURATION = 90 * 60; // 90分 (5400秒)

class MetisGameEngine {
  constructor() {
    this.initStorage();
    this.audioCtx = null;
    this.timerInterval = null;
    this.init();
  }

  initStorage() {
    if (!localStorage.getItem('metis_time')) {
      localStorage.setItem('metis_time', GAME_DURATION);
    }
    if (!localStorage.getItem('metis_phase')) {
      localStorage.setItem('metis_phase', '1');
    }
    if (!localStorage.getItem('metis_buffer')) {
      localStorage.setItem('metis_buffer', '0');
    }
  }

  init() {
    this.startTimer();
    this.updateUI();
  }

  // --- Sound Effects via Web Audio API ---
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playBeep(freq = 440, type = 'sine', duration = 0.1) {
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay restrictions safety
    }
  }

  playGlitchSound() {
    try {
      this.initAudio();
      const bufferSize = this.audioCtx.sampleRate * 0.15;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
      noise.connect(gain);
      gain.connect(this.audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  // --- Timer Management ---
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      let timeRemaining = parseInt(localStorage.getItem('metis_time'), 10);
      
      // Stop timer on ending pages
      if (window.location.pathname.includes('ending')) {
        clearInterval(this.timerInterval);
        return;
      }

      if (timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        window.location.href = 'ending_bad_a.html';
        return;
      }

      timeRemaining -= 1;
      localStorage.setItem('metis_time', timeRemaining);
      this.renderTimer(timeRemaining);
    }, 1000);
  }

  renderTimer(seconds) {
    const timerElem = document.getElementById('metis-timer');
    if (!timerElem) return;

    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timerElem.textContent = `${m}:${s}`;

    if (seconds < 600) { // 10 minutes left
      timerElem.classList.add('warning');
    }
  }

  updateUI() {
    const timeRemaining = parseInt(localStorage.getItem('metis_time'), 10);
    this.renderTimer(timeRemaining);
  }

  resetGame() {
    localStorage.removeItem('metis_time');
    localStorage.removeItem('metis_phase');
    localStorage.removeItem('metis_buffer');
    window.location.href = 'index.html';
  }
}

const game = new MetisGameEngine();
