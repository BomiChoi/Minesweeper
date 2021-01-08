function runTimer() {
    if (sw) {
        time++;
        display.innerText = time;
    }
}
setInterval(runTimer, 1000);