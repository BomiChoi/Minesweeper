function runTimer() {
    if (sw) {
        time++;
        display.innerText = fillZero(time);
    }
}
setInterval(runTimer, 1000);