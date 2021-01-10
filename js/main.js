const N = 10;
const m = 20;

let sw = false;
let time = 0;

function fillZero(num){
    return num.toString().length >= 3 ? num : new Array(3-num.toString().length+1).join('0') + num.toString();//남는 길이만큼 0으로 채움
}