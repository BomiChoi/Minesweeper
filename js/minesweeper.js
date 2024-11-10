const remaining_txt = document.querySelector(".remaining");
const emoji = document.querySelector(".emoji");
const board = document.querySelector(".board");

let btns; // 버튼 리스트
let mineList; // 지뢰들의 위치
let cellList; // 셀 값

let m_remaining; // 남은 지뢰 수
let c_opened; // 열린 셀 수


// 지뢰 위치 설정
function setMine() {
    for (var i = 0; i < m; i++) {
        rand = genRandom(N*N);
        if (mineList.includes(rand)) {
            i--;
            continue;
        }
        mineList.push(rand);
        const y = parseInt(rand / N);
        const x = rand % N;
        cellList[y][x] = "💣"
    }
}

// 보드 계산
function calculate() {
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            if(cellList[i][j] !== "💣"){
                count = 0; // 주위의 지뢰 개수
                if (i > 0) {
                    if (j > 0 && cellList[i-1][j-1] === "💣") count++;
                    if (cellList[i-1][j] === "💣") count++;
                    if (j < N-1 && cellList[i-1][j+1] === "💣") count++;
                }
                if (i < N-1) {
                    if (j > 0 && cellList[i+1][j-1] === "💣") count++;
                    if (cellList[i+1][j] === "💣") count++;
                    if (j < N-1 && cellList[i+1][j+1] === "💣") count++;
                }
                if (j > 0 && cellList[i][j-1] === "💣") count++;
                if (j < N-1 && cellList[i][j+1] === "💣") count++;

                if (count !== 0) cellList[i][j] = count;
            } 
        }
    }
}

// 셀 열기
function open(i, j) {
    btns[i][j].innerText = cellList[i][j];
    btns[i][j].disabled = true;
    c_opened++;
}

// 빈 셀 한꺼번에 열기
function fillEmpty(i, j) {
    open(i, j)
    if (i > 0) {
        if (btns[i-1][j].disabled === false) {
            if(cellList[i-1][j] === "") fillEmpty(i-1, j);
            else open(i-1, j);
        } 
        if (j > 0 && cellList[i-1][j-1] !== "" && btns[i-1][j-1].disabled === false) open(i-1, j-1);
        if (j < N-1 && cellList[i-1][j+1] !== "" && btns[i-1][j+1].disabled === false) open(i-1, j+1);
    }
    if (i < N-1) {
        if (btns[i+1][j].disabled === false) {
            if (cellList[i+1][j] === "") fillEmpty(i+1, j);
            else open(i+1, j);
        } 
        if (j > 0 && cellList[i+1][j-1] !== "" && btns[i+1][j-1].disabled === false) open(i+1, j-1);
        if (j < N-1 && cellList[i+1][j+1] !== "" && btns[i+1][j+1].disabled === false) open(i+1, j+1);
    }
    if (j > 0 && btns[i][j-1].disabled === false){
        if(cellList[i][j-1] === "") fillEmpty(i, j-1);
        else open(i, j-1);
    } 
    if (j < N-1 && btns[i][j+1].disabled === false){
        if(cellList[i][j+1] === "") fillEmpty(i, j+1);
        else open(i, j+1);
    } 
}

// 좌클릭
function handleClick(event) {
    if (!isPlaying) {
        // 타이머 시작
        runTimer();
    }
    const btn = event.target;
    const id = btn.id;
    const i = parseInt(id / N);
    const j = id % N;

    if (cellList[i][j] === "💣"){
        // 지뢰를 눌렀을 경우
        btn.setAttribute("class", "btn mine");
        endGame();
        vibrate();
    } else {
        if (cellList[i][j] === "") fillEmpty(i, j);
        else open(i, j);
        
        // 모든 셀이 열렸을 때
        if (c_opened === N*N - m) endGame();
    }
    
}

// 우클릭
function handleRightClick(event) {
    if (!isPlaying) {
        runTimer();
    }
    const btn = event.target;
    const id = btn.id;
    const i = parseInt(id / N);
    const j = id % N;
    if(btn.innerText === "🚩") {
        btn.innerText = "";
        btn.addEventListener("click", handleClick);
        m_remaining++;
    }
    else if (m_remaining > 0 && btn.innerText === ""){
        btn.innerText = "🚩";
        btn.removeEventListener("click", handleClick);
        m_remaining--;
    }
    remaining_txt.innerText = fillZero(m_remaining);
}

// 모바일은 우클릭 대신 긴 터치
let longtouch = false;
let touchInterval;
function onTouchStart(event) {
    touchInterval = setInterval(function(){longtouch = true}, 1000);
}
function onTouchEnd(event) {
    clearInterval(touchInterval);
    if (longtouch) {
        handleRightClick(event);
        longtouch = false;
        vibrate();
    }
}

// 게임 종료
function endGame() {
    stopTimer();
    if (c_opened === N*N - m){ // 지뢰를 제외한 모든 셀이 열렸을 경우 이김
        emoji.innerText = "😎"
        for (var i = 0; i < N; i++){
            for (var j = 0; j < N; j++){
                btn = btns[i][j];
                // 아직 안 열린 지뢰에 깃발 꽂기
                if (btn.disable === false && cellList[i][j] === "💣") {
                    btn.innerText = "🚩";
                    m_remaining--;
                }
                btn.removeEventListener("click", handleClick);
                btn.removeEventListener("contextmenu", handleRightClick);
            }
        }
        remaining_txt.innerText = fillZero(m_remaining);
    } else { // 졌을 때
        emoji.innerText = "😫"
        for (var i = 0; i < N; i++){
            for (var j = 0; j < N; j++){
                btn = btns[i][j];
                // 지뢰 위치 공개
                if (btn.innerText !== "🚩" && cellList[i][j] === "💣") btn.innerText = "💣";
                if (btn.innerText === "🚩" && cellList[i][j] !== "💣") btn.innerText = "❌";
                btn.removeEventListener("click", handleClick);
                btn.removeEventListener("contextmenu", handleRightClick);
            }
        }
    }
}

//게임 리셋
function reset() {
    if (!isPlaying) {
        emoji.innerText = "🙂";
        for (var i = 0; i < N; i++){
            for (var j = 0; j < N; j++){
                btn = btns[i][j];
                btn.innerText ="";
                btn.setAttribute("class", "btn");
                btn.addEventListener("click", handleClick);
                btn.addEventListener("contextmenu", handleRightClick);
                btn.disabled = false;
                cellList[i][j] = "";
            }
        }

        mineList = new Array(m);
        cellList = Array.from(Array(N), () => Array(N).fill(""));

        m_remaining = m;
        c_opened = 0;
        remaining_txt.innerText = fillZero(m_remaining);
        time_txt.innerText = fillZero(time);

        resetTimer();
        setMine();
        calculate();
    }
}

// 게임 초기화
function init() {
    btns = new Array(N);
    mineList = new Array(m);
    cellList = Array.from(Array(N), () => Array(N).fill(""));

    m_remaining = m;
    c_opened = 0;

    emoji.addEventListener("click", reset);
    remaining_txt.innerText = fillZero(m_remaining);
    time_txt.innerText = fillZero(time);

    for (var i = 0; i < N; i++) {
        var row = document.createElement('div');
        row.setAttribute("class", "row")
        for (var j = 0; j < N; j++) {
            var btn = document.createElement('button');
            btn.setAttribute("class", "btn");
            btn.setAttribute("id", i*N+j);
            btn.addEventListener("click", handleClick);
            btn.addEventListener("contextmenu", handleRightClick);
            btn.addEventListener("touchstart", onTouchStart);
            btn.addEventListener("touchend", onTouchEnd);
            row.appendChild(btn);
        }
        board.appendChild(row);
        btns[i] = row.childNodes;
    }
    setMine();
    calculate();
}

init();

