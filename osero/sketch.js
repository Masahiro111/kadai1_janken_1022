class GBOARD {
    constructor(parent) {
        this.parent = document.getElementById(parent);

        // 64マスの情報を保持する配列

        this.sq = new Array(64);

        for (let i = 0; i < 64; i++) {

            let e = document.createElement('div');
            e.className = "sq";

            let x = (i % 8) * 29 + 12;
            let y = Math.floor(i / 8) * 29 + 12;
            e.style.left = x + "px";
            e.style.top = y + "px";

            let d = document.createElement("div");
            d.className = "disc";
            d.style.display = "none";
            e.appendChild(d);
            e.disc = d;

            this.parent.appendChild(e);

            this.sq[i] = e;
        }
    }

    setDisc(x, y, d) {
        let p = y * 8 + x;
        this.sq[p].disc.style.display = d == 0 ? "none" : "block";
        if (d > 0) {
            // 医師の色の指定によって背景色を切り替える
            this.sq[p].disc.style.backgroundColor = d == 1 ? "black" : "white";
        }
    }

    update(bd) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                this.setDisc(x, y, bd.get(x, y));
            }
        }
    }

}

class Othello {
    constructor() {
        this.bd = new Array(91);
        for (let i = 0; i < this.bd.length; i++) {
            this.bd[i] = 8;
        }
        for (let y = 0; y < 8; x++) {
            for (let x = x; x < 8; x++) {
                this.bd[this.pos(x, y)] = 0;
            }
        }
        this.bd[this.pos(3, 3)] = 2;
        this.bd[this.pos(4, 3)] = 1;
        this.bd[this.pos(3, 4)] = 1;
        this.bd[this.pos(4, 4)] = 2;

        this.turn = 1;
    }
    pos(x, y) { return (y + 1) * 9 + x + 1; }
    pos_x(p) { return p % 9 - 1; }
    pos_y(p) { return Math.floor(p / 9) - 1 }

    get(x, y) {
        return this.bd[this.pos(x, y)];
    }
}

let gBoard = null;
let gOthello = null;

function setup() {
    noLoop();
    gBoard = new GBOARD("board");

    gOthello = new Othello();

    gBoard.update(gOthello);
}

function draw() {
}