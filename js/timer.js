const time_txt = document.querySelector(".time");

let isPlaying = false; // 스위치
let time = 0; // 경과 시간
let interval;

function increaseTime() {
    time++;
    time_txt.innerText = fillZero(time);
}

function runTimer() {
    isPlaying = true;
    interval = setInterval(increaseTime, 1000);
}

function stopTimer() {
    isPlaying = false;
    clearInterval(interval);
}

function resetTimer() {
    stopTimer();
    time = 0;
    time_txt.innerText = fillZero(time);
}

