let total_win = 0;
let total_drow = 0;
let total_lose = 0;
let total_winning_streak = 0;
let total_winning_streak_todays_max = 0;
let flag_winning_streak = 0;

function R_Click(p_janken_r, player_id) {
    let janken = ['グー', 'チョキ', 'パー',];  //"janken"のリストを作成します。
    let janken_r = Math.floor(Math.random() * 3);  //Math.random() で乱数を作ります
    let p_janken = ['グー', 'チョキ', 'パー'];  //"プレイヤーのjanken"のリストを作成します。

    if (janken_r == 0) {
        comPatarnChart.data.datasets[0].data[0]++;
        comPatarnChart.update();
    } else if (janken_r == 1) {
        comPatarnChart.data.datasets[0].data[1]++;
        comPatarnChart.update();
    } else if (janken_r == 2) {
        comPatarnChart.data.datasets[0].data[2]++;
        comPatarnChart.update();
    }

    //勝ち負けの判定機プログラムです
    if (janken_r === p_janken_r) {
        Result_end = '<span class="font-bold text-orange-600 bg-orange-200">&nbsp;&nbsp;あいこです&nbsp;&nbsp;</span>';
        total_drow++;
        winning_streak_refresh();
    } else if (p_janken_r === 0 && janken_r === 1) {
        win_act();
    } else if (p_janken_r === 1 && janken_r === 2) {
        win_act();
    } else if (p_janken_r === 2 && janken_r === 0) {
        win_act();
    } else {
        Result_end = '<span class="font-bold text-indigo-600 bg-indigo-200">&nbsp;&nbsp;あなたの 負け&nbsp;&nbsp;</span>';
        total_lose++;
        winning_streak_refresh();
    }

    //結果を表示するためのプログラムです
    document.getElementById("Rejan1_" + player_id).innerHTML = "「" + p_janken[p_janken_r] + "」&nbsp;を選択！ジャンケンの結果は …？";
    document.getElementById("Rejan2_" + player_id).innerHTML = "相手は 「" + janken[janken_r] + "」。よって " + Result_end;
    document.getElementById("todays-grades")
        .innerHTML = "全&nbsp;" + (total_win + total_drow + total_lose) + "&nbsp;試合&nbsp;" + total_win + "勝&nbsp;" + total_lose + "敗&nbsp;" + total_drow + "分&nbsp;<br>連勝記録：" + total_winning_streak_todays_max + " 連勝！";
    document.getElementById("todays-win-rate").innerHTML = "勝率" + (Math.floor((total_win / (total_win + total_drow + total_lose)) * 100)) + "%";

    myChart.data.labels.push(total_win + total_drow + total_lose);
    myChart.data.datasets[0].data.push(Math.floor((total_win / (total_win + total_drow + total_lose)) * 100));
    myChart.update();
}

function win_act() {
    Result_end = '<span class="font-bold text-red-500 bg-red-200">&nbsp;&nbsp;あなたの 勝ち&nbsp;&nbsp;</span>';
    total_win++;
    if (total_winning_streak == 0) {
        total_winning_streak = 1;
    }
    if (flag_winning_streak === 1) {
        total_winning_streak++;
        if (total_winning_streak >= total_winning_streak_todays_max) {
            total_winning_streak_todays_max = total_winning_streak;
        }
    }
    flag_winning_streak = 1;
}

function winning_streak_refresh() {
    flag_winning_streak = 0;
    total_winning_streak = 0;
}



// chart.js --------------------------------------------------------------------------------------------------------------

// chart.js
var ctx = document.getElementById('canvas').getContext('2d');
window.myChart = new Chart(ctx, { // インスタンスをグローバル変数で生成
    type: 'bar',
    data: { // ラベルとデータセット
        datasets: [{
            label: [],
            data: [], // グラフデータ
            backgroundColor: 'rgb(0, 134, 197, 0.7)', // 棒の塗りつぶし色
            borderColor: 'rgba(0, 134, 197, 1)', // 棒の枠線の色
            borderWidth: 1, // 枠線の太さ
            max: 100,
        }],
    },
    options: {
        legend: {
            display: false, // 凡例を非表示
        }
    }
});

var comPatarnChart = new Chart(document.getElementById("comPatarnChart"), {
    type: 'doughnut',
    data: {
        labels: ['グー', 'チョキ', 'パー'],
        datasets: [{
            label: '# of Tomatoes',
            data: [0, 0, 0],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255,99,132,1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        //cutoutPercentage: 40,
        responsive: false,
    }
});