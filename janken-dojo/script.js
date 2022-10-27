function R_Click(p_janken) {
    //"janken"のリストを作成します。
    let janken_jp = ['グー', 'チョキ', 'パー',];

    //Math.random() で相手のじゃんけんの乱数を作ります
    let c_janken = Math.floor(Math.random() * 3);

    //"プレイヤーのjanken"のリストを作成します。
    let p_janken_list = [];

    for (i = 0; i < 30; i++) {
        p_janken_list.push(Math.floor(Math.random() * 3));
    }

    console.log(p_janken_list);

    //勝ち負けの判定機プログラムです
    if (c_janken === p_janken) {
        Result_end = "あいこです";
    } else if (p_janken === 0 && c_janken === 1) {
        Result_end = "あなたの【勝ち】";
    } else if (p_janken === 1 && c_janken === 2) {
        Result_end = "あなたの【勝ち】";
    } else if (p_janken === 2 && c_janken === 0) {
        Result_end = "あなたの【勝ち】";
    } else {
        Result_end = "あなたの【負け】";
    }

    //結果を表示するためのプログラムです
    document.getElementById("Rejan1").innerHTML = janken_jp[p_janken] + "を選択しました。ジャンケンの結果は・・・？";
    document.getElementById("Rejan2").innerHTML = "相手は" + janken_jp[c_janken] + Result_end;
}
