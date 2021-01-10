let interval;

function increaseTime() {
    time++;
    display.innerText = fillZero(time);
}

function runTimer() {
    interval = setInterval(increaseTime, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function resetTimer() {
    time = 0;
    display.innerText = fillZero(time);
}

