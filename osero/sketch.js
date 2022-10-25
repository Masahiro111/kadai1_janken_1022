class GBOARD {
    constructor(parent) {
        this.parent = document.getElementById(parent);

        // 64マスの情報を保持する配列
        this.sq = new Array(64);

        for (let i = 0; i < 64; i++) {
            // １つのマスを表現する div 要素
            let e = document.createElement('div');
            e.className = "sq";

            let x = (i % 8) * 29 + 12;
            let y = Math.floor(i / 8) * 29 + 12;
            e.style.left = x + "px";
            e.style.top = y + "px";

            e.parent = this;
            e.myid = i;
            e.addEventListener("click", function () { this.parent.OnClick(this.myid); });

            // 石を表現する div 要素
            let d = document.createElement('div');
            d.className = "disc";
            d.style.display = "none";
            e.appendChild(d);
            e.disc = d;

            this.parent.appendChild(e);

            this.sq[i] = e;
        }
    }
    // (x,y) のマスに石を置く
    //    d=0 : 石を消す
    //    d=1 : 黒石を置く
    //    d=2 : 白石を置く
    setDisc(x, y, d) {
        let p = y * 8 + x;

        // d==0 の場合は非表示に
        this.sq[p].disc.style.display = d == 0 ? "none" : "block";

        if (d > 0) {
            // 石の色の指定によって背景色を切り替える
            this.sq[p].disc.style.backgroundColor = d == 1 ? "black" : "white";
        }
    }

    // Othello bd を渡すことで盤面を表示
    update(bd) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                this.setDisc(x, y, bd.get(x, y));
            }
        }
    }

    OnClick(id) {
        //    Log( "click #" + id );
        OnClickBoard(id);
    }
}

// 着手に関する情報を表現するクラス
class MoveInfo {
    constructor() {
        this.turn = 0;  // 手番
        this.pos = 0;  // 打った場所
        this.flips = 0;  // 裏返した石の数
        this.disc = new Array(20);  // 裏返した石の座標
    }
    clear() {
        this.turn = 0;
        this.pos = 0;
        this.flips = 0;
    }
    addFlipDisc(p) { this.disc[this.flips++] = p; }
}

const VECT = [-10, -9, -8, -1, 1, 8, 9, 10];

class Othello {
    constructor() {
        this.bd = new Array(91);
        for (let i = 0; i < this.bd.length; i++) { this.bd[i] = 8; }
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                this.bd[this.pos(x, y)] = 0;
            }
        }
        this.bd[this.pos(3, 3)] = 2;
        this.bd[this.pos(4, 3)] = 1;
        this.bd[this.pos(3, 4)] = 1;
        this.bd[this.pos(4, 4)] = 2;

        this.moveinfo = new Array(60);
        this.mp = 0;
        this.mpmax = 0;

        this.turn = 1;
    }
    pos(x, y) { return (y + 1) * 9 + x + 1; }
    pos_x(p) { return p % 9 - 1; }
    pos_y(p) { return Math.floor(p / 9) - 1; }

    posStr(p) {
        let x = this.pos_x(p);
        let y = this.pos_y(p);
        return "abcdefgh".substring(x, x + 1) + "12345678".substring(y, y + 1);
    }
    // 盤面の初期化
    init() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                this.bd[this.pos(x, y)] = 0;
            }
        }
        this.bd[this.pos(3, 3)] = 2;
        this.bd[this.pos(4, 3)] = 1;
        this.bd[this.pos(3, 4)] = 1;
        this.bd[this.pos(4, 4)] = 2;

        this.mp = 0;
        this.mpmax = 0;

        this.turn = 1;
    }

    // (x,y) のマスの状態を取得
    get(x, y) {
        return this.bd[this.pos(x, y)];
    }

    // (x,y) のマスに打つ
    move(x, y) {
        let p = this.pos(x, y);
        if (this.bd[p] != 0) {     // 空きマスでなければ、
            return 0;                // ここには打てない
        }
        let moveinfo = new MoveInfo();
        let flipdiscs = 0;
        let oppdisc = this.turn == 2 ? 1 : 2;
        for (let v = 0; v < VECT.length; v++) {  // 8方向全てについて；
            let vect = VECT[v];

            let n = p + vect;      // vect方向の隣のマス
            let flip = 0;
            while (this.bd[n] == oppdisc) {  // 連続する相手の石を
                n += vect;
                flip++;                      // カウントする
            }

            // 1個以上相手の石が連続しており、その先に自分の石がある場合、
            if (flip > 0 && this.bd[n] == this.turn) {
                for (let i = 0; i < flip; i++) {  // その相手の石を自分の石にする
                    this.bd[n -= vect] = this.turn;

                    moveinfo.addFlipDisc(n);
                }
                flipdiscs += flip;           // 返した石の数を足し込む
            }
        }
        if (flipdiscs > 0) {        // 打てた場合
            this.bd[p] = this.turn;   // 打ったマスを自分の石にする

            moveinfo.pos = p;
            moveinfo.turn = this.turn;
            this.moveinfo[this.mp++] = moveinfo;
            this.mpmax = this.mp;

            this.setNextTurn();       // 手番を変える
        }
        return flipdiscs;
    }
    // 手番を変える
    setNextTurn() {
        // 要修正：パスの判定が必要
        this.turn = this.turn == 2 ? 1 : 2;
        if (this.isPass(this.turn)) {
            this.turn = this.turn == 2 ? 1 : 2;
            if (this.isPass(this.turn)) {
                this.turn = 0;
            }
        }
    }
    // turn 番でパスになるか調べる
    isPass(turn) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.canMove(x, y, turn)) {
                    return false;
                }
            }
        }
        return true;
    }
    // (x,y) に turn 番で打てるか調べる
    canMove(x, y, turn) {
        let p = this.pos(x, y);
        if (this.bd[p] != 0) {     // 空きマスでなければ、
            return false;            // ここには打てない
        }
        let flipdiscs = 0;
        let oppdisc = turn == 2 ? 1 : 2;
        for (let v = 0; v < VECT.length; v++) {  // 8方向全てについて；
            let vect = VECT[v];

            let n = p + vect;      // vect方向の隣のマス
            let flip = 0;
            while (this.bd[n] == oppdisc) {  // 連続する相手の石を
                n += vect;
                flip++;                      // カウントする
            }

            // 1個以上相手の石が連続しており、その先に自分の石がある場合、
            if (flip > 0 && this.bd[n] == turn) {
                return true;
            }
        }
        return false;
    }
    // １手戻す
    unmove() {
        if (this.mp <= 0) {
            return false;
        }
        let moveinfo = this.moveinfo[--this.mp];

        let opp = moveinfo.turn == 1 ? 2 : 1;

        for (let i = 0; i < moveinfo.flips; i++) {
            this.bd[moveinfo.disc[i]] = opp;
        }
        this.bd[moveinfo.pos] = 0;

        this.turn = moveinfo.turn;

        return true;
    }
    // １手進める
    forward() {
        if (this.mp >= this.mpmax) {
            return false;
        }
        let moveinfo = this.moveinfo[this.mp++];
        let opp = moveinfo.turn == 1 ? 2 : 1;

        for (let i = 0; i < moveinfo.flips; i++) {
            this.bd[moveinfo.disc[i]] = moveinfo.turn;
        }
        this.bd[moveinfo.pos] = moveinfo.turn;

        this.turn = moveinfo.turn;
        this.setNextTurn();

        return true;
    }
    unmove_all() {
        if (!this.unmove()) {
            return false;
        }
        while (this.unmove()) {
            ;
        }
        return true;
    }
    forward_all() {
        if (!this.forward()) {
            return false;
        }
        while (this.forward()) {
            ;
        }
        return true;
    }
    // 着手可能な手からランダムで１つ選ぶ
    getRandomMove() {
        let move = new Array(64);
        let moves = 0;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.canMove(x, y, this.turn)) {
                    move[moves++] = this.pos(x, y);
                }
            }
        }
        let r = Math.floor(Math.random() * moves);
        return move[r];
    }
}
let gBoard = null;
let gOthello = null;
let gComTurn = 0;

function changeMode() {
    var e = document.getElementById("mode");
    let v = e.options[e.selectedIndex].value;
    gComTurn = v;

    OnChangeBoard();
}

// 盤面の初期化 (新規ゲームスタート)
function init() {
    gOthello.init();
    gBoard.update(gOthello);
    OnChangeBoard();
}
// １手戻す
function unmove() {
    if (gOthello.unmove()) {
        gBoard.update(gOthello);
        OnChangeBoard();
    }
}
// １手進める
function forward() {
    if (gOthello.forward()) {
        gBoard.update(gOthello);
        OnChangeBoard();
    }
}
function unmove_all() {
    if (gOthello.unmove_all()) {
        gBoard.update(gOthello);
        OnChangeBoard();
    }
}
function forward_all() {
    if (gOthello.forward_all()) {
        gBoard.update(gOthello);
        OnChangeBoard();
    }
}
// 盤上でクリックされた時の処理
function OnClickBoard(pos) {

    if (gComTurn > 0 && gComTurn == gOthello.turn) {
        return;
    }

    let x = pos % 8;
    let y = Math.floor(pos / 8);
    // (x,y)に打つ
    if (gOthello.move(x, y) > 0) {
        gBoard.update(gOthello);

        OnChangeBoard();
    }
}

function OnChangeBoard() {
    if (gComTurn > 0 && gComTurn == gOthello.turn) {
        setTimeout(ComPlay, 1000);
        //    ComPlay();
    }
}

function ComPlay() {
    if (gComTurn == 0 || gComTurn != gOthello.turn) {
        return;
    }
    let p = gOthello.getRandomMove();
    let x = gOthello.pos_x(p);
    let y = gOthello.pos_y(p);

    if (gOthello.move(x, y) > 0) {
        gBoard.update(gOthello);
        OnChangeBoard();
    }
}

function setup() {
    noLoop();    // draw() 関数の定期的な呼び出しを行わない

    // index.html の id="board" な div の中にオセロ盤を作成
    gBoard = new GBOARD("board");

    gOthello = new Othello();
    gBoard.update(gOthello);

}


// この関数は使わない
function draw() {
}

// ログ表示領域に文字列 s を表示
function Log(s) {
    let e = document.getElementById("logarea");
    if (e) {
        e.innerHTML += s + "\n";
        e.scrollTop = e.scrollHeight
    }
}