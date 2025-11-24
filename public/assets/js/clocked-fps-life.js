class DigitalClock {
    constructor(element) {
        this.element = element;
    }

    start() {
        this.update();
        setInterval(() => this.update(), 10);
    }

    update() {
        const parts = this.getTimeParts();
        const minuteFormatted = parts.minute.toString().padStart(2, '0');
        const secondFormatted = parts.second.toString().padStart(2, '0');
        const timeFormatted = `${parts.hour}:${minuteFormatted}:${secondFormatted}`;

        this.element.textContent = timeFormatted;
    }
        

    getTimeParts() {
        const now = new Date();
        
        return {
            hour: now.getHours() % 12 || 12,
            minute: now.getMinutes(),
            second: now.getSeconds(),
        };
    }
}

const clockElement = document.querySelector('.clock-time');
const clockObject = new DigitalClock(clockElement);

clockObject.start();

// Simple live FPS tracker using requestAnimationFrame
(function () {
  const fpsEl = document.querySelector('.fps-counter');
  if (!fpsEl) return;

  let last = performance.now();
  let frames = 0;
  let lastUpdate = performance.now();

  function tick(now) {
    frames++;
    const elapsed = now - lastUpdate;
    if (elapsed >= 500) { // update twice a second
      const fps = Math.round((frames * 1000) / elapsed);
      fpsEl.textContent = `${fps} FPS`;
      frames = 0;
      lastUpdate = now;
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

document.addEventListener('DOMContentLoaded', () => {
  const batteryLevelEl = document.querySelector('.battery-level');
  const batteryPercentEl = document.querySelector('.battery-percent');

  // If elements are missing, create them dynamically
  if (!batteryLevelEl || !batteryPercentEl) {
    const container = document.createElement('div');
    container.className = 'battery-container';

    const level = document.createElement('div');
    level.className = 'battery-level';
    level.style.width = '0%';

    const percent = document.createElement('span');
    percent.className = 'battery-percent';
    percent.textContent = '--%';

    container.appendChild(level);
    container.appendChild(percent);
    document.body.appendChild(container);

    // reassign references
    batteryLevelEl = level;
    batteryPercentEl = percent;
  }

  if (typeof navigator.getBattery !== 'function') {
    batteryPercentEl.textContent = 'Battery info not available';
    return;
  }

  navigator.getBattery().then(battery => {
    function updateBattery() {
      const level = Math.round(battery.level * 100);
      batteryPercentEl.textContent = `${level}%`;
      batteryLevelEl.style.width = `${level}%`;
    }

    updateBattery();
    battery.addEventListener('levelchange', updateBattery);
  }).catch(err => {
    console.error('Battery API error:', err);
    batteryPercentEl.textContent = 'Error reading battery';
  });
});