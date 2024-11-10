const N = 10; // 보드 사이즈
const m = 20; // 지뢰 수

// 난수 생성
function genRandom(num) {
    const number = Math.floor(Math.random() * num);
    return number;
}

// 숫자 3자리로 맞춤
function fillZero(num){
    return num.toString().length >= 3 ? num : new Array(3-num.toString().length+1).join('0') + num.toString(); //남는 길이만큼 0으로 채움
}

// 진동
function vibrate() {
    window.navigator.vibrate(200); // 진동을 울리게 한다. 1000ms = 1초
}

