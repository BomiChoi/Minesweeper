const num_r = document.querySelector(".remaining");
const emo = document.querySelector(".emo");
const display = document.querySelector(".time");
const board = document.querySelector(".board");

let btns = new Array(N);
let mList = new Array(m);
let bList = Array.from(Array(N), () => Array(N).fill(""));
let shown = Array.from(Array(N), () => Array(N).fill(""));

let remaining = m;
let opened = 0;

function genRandom(num) {
    const number = Math.floor(Math.random() * num);
    return number;
}

function setMine() {
    for (var i = 0; i < m; i++) {
        rand = genRandom(N*N)
        if (mList.includes(rand)) {
            i--;
            continue;
        }
        mList.push(rand);
        const y = parseInt(rand / N);
        const x = rand % N;
        bList[y][x] = "💣"
    }
}

function calculate() {
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            if(bList[i][j] !== "💣"){
                count = 0;
                if (i > 0) {
                    if (j > 0 && bList[i-1][j-1] === "💣") count++;
                    if (bList[i-1][j] === "💣") count++;
                    if (j < N-1 && bList[i-1][j+1] === "💣") count++;
                }
                if (i < N-1) {
                    if (j > 0 && bList[i+1][j-1] === "💣") count++;
                    if (bList[i+1][j] === "💣") count++;
                    if (j < N-1 && bList[i+1][j+1] === "💣") count++;
                }
                if (j > 0 && bList[i][j-1] === "💣") count++;
                if (j < N-1 && bList[i][j+1] === "💣") count++;

                if (count !== 0) bList[i][j] = count;
            } 
        }
    }
}

function endGame() {
    sw = false;
    if (opened === N*N - m){ // 이겼을 때
        emo.innerText = "😎"
        for (var i = 0; i < N; i++){
            for (var j = 0; j < N; j++){
                btn = btns[i][j];
                if (btn.disable === false && bList[i][j] === "💣") {
                    btn.innerText = "🚩";
                    remaining--;
                }
                btn.removeEventListener("click", handleClick);
                btn.removeEventListener("contextmenu", handleRightClick);
            }
        }
        num_r.innerText = fillZero(remaining);
    } else { // 졌을 때
        emo.innerText = "😫"
        for (var i = 0; i < N; i++){
            for (var j = 0; j < N; j++){
                btn = btns[i][j];
                if (btn.innerText !== "🚩" && bList[i][j] === "💣") btn.innerText = "💣";
                if (btn.innerText === "🚩" && bList[i][j] !== "💣") btn.innerText = "❌";
                btn.removeEventListener("click", handleClick);
                btn.removeEventListener("contextmenu", handleRightClick);
            }
        }
    }
}

function reset() {
    if (!sw) {
        emo.innerText = "🙂";
        for (var i = 0; i < N; i++){
            for (var j = 0; j < N; j++){
                btn = btns[i][j];
                btn.innerText ="";
                btn.setAttribute("class", "btn")
                btn.addEventListener("click", handleClick);
                btn.addEventListener("contextmenu", handleRightClick);
                btn.disabled = false;
                bList[i][j] = "";
            }
        }
        remaining = m;
        opened = 0;
        time = 0;
        num_r.innerText = fillZero(remaining);
        display.innerText = fillZero(time);
        setMine();
        calculate();
    }
}

function open(i, j) {
    btns[i][j].innerText = bList[i][j];
    btns[i][j].disabled = true;
    opened++;
}

function fillEmpty(i, j) {
    open(i, j)
    if (i > 0) {
        if (btns[i-1][j].disabled === false) {
            if(bList[i-1][j] === "") fillEmpty(i-1, j);
            else open(i-1, j);
        } 
        if (j > 0 && bList[i-1][j-1] !== "" && btns[i-1][j-1].disabled === false) open(i-1, j-1);
        if (j < N-1 && bList[i-1][j+1] !== "" && btns[i-1][j+1].disabled === false) open(i-1, j+1);
    }
    if (i < N-1) {
        if (btns[i+1][j].disabled === false) {
            if (bList[i+1][j] === "") fillEmpty(i+1, j);
            else open(i+1, j);
        } 
        if (j > 0 && bList[i+1][j-1] !== "" && btns[i+1][j-1].disabled === false) open(i+1, j-1);
        if (j < N-1 && bList[i+1][j+1] !== "" && btns[i+1][j+1].disabled === false) open(i+1, j+1);
    }
    if (j > 0 && btns[i][j-1].disabled === false){
        if(bList[i][j-1] === "") fillEmpty(i, j-1);
        else open(i, j-1);
    } 
    if (j < N-1 && btns[i][j+1].disabled === false){
        if(bList[i][j+1] === "") fillEmpty(i, j+1);
        else open(i, j+1);
    } 
}

function handleClick(event) {
    if (!sw) sw = true;
    const btn = event.target;
    const id = btn.id;
    const i = parseInt(id / N);
    const j = id % N;
    if (bList[i][j] === "💣"){
        btn.setAttribute("class", "btn mine");
        endGame();
    } else {
        if (bList[i][j] === "") fillEmpty(i, j);
        else {
            open(i, j)
        }
        if (opened === N*N - m) endGame();
    }
    
}

function handleRightClick(event) {
    event.preventDefault();
    if (!sw) sw = true;
    const btn = event.target;
    const id = btn.id;
    const i = parseInt(id / N);
    const j = id % N;
    if(btn.innerText === "🚩") {
        btn.innerText = "";
        btn.addEventListener("click", handleClick);
        remaining++;
    }
    else if (remaining > 0){
        btn.innerText = "🚩";
        btn.removeEventListener("click", handleClick);
        remaining--;
    }
    num_r.innerText = fillZero(remaining);
}

function init() {
    emo.addEventListener("click", reset);
    num_r.innerText = fillZero(remaining);
    display.innerText = fillZero(time);
    for (var i = 0; i < N; i++) {
        var row = document.createElement('div');
        row.setAttribute("class", "row")
        for (var j = 0; j < N; j++) {
            var btn = document.createElement('button');
            btn.setAttribute("class", "btn")
            btn.setAttribute("id", i*N+j)
            btn.addEventListener("click", handleClick);
            btn.addEventListener("contextmenu", handleRightClick);
            row.appendChild(btn);
        }
        board.appendChild(row);
        btns[i] = row.childNodes;
    }
    setMine();
    calculate();
}

init();

