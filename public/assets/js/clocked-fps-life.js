class DigitalClock {
    constructor(element) {
        this.element = element;
    }

    update() {
        const parts = this.getTimeParts();
        const minuteFormatted = parts.minute.toString().padStart(2, '0');
        const secondFormatted = parts.second.toString().padStart(2, '0');
        const timeFormatted = `${parts.hour}:${minuteFormatted}:${secondFormatted}`;

        console.log(timeFormatted);

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