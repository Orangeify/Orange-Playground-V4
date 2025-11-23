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

const batteryLevelEl = document.querySelector('battery-level');

navigator.getBattery().then(function(battery) {
    function updateBatteryLevel() {
        const level = battery.level;
        const status = level * 100 + "%";
        console.log(status);
        batteryLevelEl.style.width = status;
        batteryLevelEl.innerHTML = status;
    }
});