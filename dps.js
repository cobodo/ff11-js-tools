// Array.map by http://nanto.asablo.jp/blog/2005/10/08/101406
if (!Array.map) {
  if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisObject) {
      var length = this.length;
      var result = new Array(length);
      for (var i = 0; i < length; i++)
        result[i] = callback.call(thisObject, this[i], i, this);
      return result;
    };
  }
  Array.map = function (array, callback, thisObject) {
    return Array.prototype.map.call(array, callback, thisObject);
  };
}

function ceil2 (x, d) {
    if (d == undefined) return Math.ceil(x);
    var f = Math.pow(10,d);
    return Math.ceil(x*f)/f;
}

function floor2 (x, d) {
    if (d == undefined) return Math.floor(x);
    var f = Math.pow(10,d);
    return Math.floor(x*f)/f;
}

function fac (n) { // 階乗
    if (n<2) return 1;
    var f=1;
    for (var i=2; i<=n; i++) {
        f *= i;
    }
    return f;
}

function cmb (n,m) { // 組合せ数
    return fac(n)/fac(m)/fac(n-m);
}

function ff (x, z, d) { // format float
    if (z == undefined) z = true; // 最後をゼロで埋める
    if (d == undefined) d = 4;
    var eps = 0.01;
    for (var i=0; i < d - 2; i++) {
        eps /= 10;
    }
    var regobj = new RegExp(['(\\d*\\.\\d{', d, '})'].join(''));
    var f = (Math.round(x/eps)*eps).toString();
    f = (f.match(regobj)||[0,f])[1];
    if (!z) return f;
    var p = f.indexOf('.', 0);
    var suf = [f];
    if (p == -1) {
        if (z && 0 < d) {
            suf.push(".");
            for (var i = 0; i < d; i++) {
                suf.push("0");
            }
            f = suf.join('');
        }
        return f;
    }
    for (var i = d - (f.length - 1 - p); 0 < i; i--) {
        suf.push("0");
    }
    return suf.join('');;
}

function calc_tp (delay) {
    var ret;
    if (delay <= 180)      ret = ff( 5.0 + (delay - 180) * 1.5 / 180, true, 1);
    else if (delay <= 450) ret = ff( 5.0 + (delay - 180) * 6.5 / 270, true, 1);
    else if (delay <= 480) ret = ff(11.5 + (delay - 450) * 1.5 /  30, true, 1);
    else if (delay <= 530) ret = ff(13.0 + (delay - 480) * 1.5 /  50, true, 1);
    //else if (delay <= 999) ret = ff(14.5 + (delay - 530) * 3.5 / 470, true, 1);
    else ret = ff(14.5 + (delay - 530) * 3.5 / 470, true, 1);
    return ret;
}

var weapon_list = [
    {name: "素手", lv: 0, d: 0, delay: 0},
    {name: "トレイニーシザー", lv: 1, d: 1, delay: 66},
    {name: "キャットバグナウ+1", lv: 1, d: 3, delay: 51},
    {name: "セスタス+1", lv: 1, d: 2, delay: 43},
    {name: "セスタス", lv: 1, d: 1, delay: 48},
    {name: "フルーツパンチ", lv: 1, d: 0, delay: 40},
    {name: "キャットバグナウ", lv: 1, d: 2, delay: 60},
    {name: "ブロンズナックル+1", lv: 5, d: 3, delay: 91},
    {name: "ブロンズナックル", lv: 5, d: 2, delay: 96},
    {name: "ブラスナックル+1", lv: 9, d: 5, delay: 91},
    {name: "ブラスナックル", lv: 9, d: 4, delay: 96},
    {name: "トロピカルパンチ+1", lv: 10, d: 2, delay: 0},
    {name: "トロピカルパンチ", lv: 10, d: 1, delay: 0},
    {name: "王国弓兵制式戦拳", lv: 10, d: 2, delay: 43},
    {name: "義勇兵の爪", lv: 10, d: 3, delay: 66},
    {name: "共和軍団兵制式鉄拳", lv: 10, d: 4, delay: 96},
    {name: "ハイドロバグナウ+1", lv: 11, d: 5, delay: 55},
    {name: "ブラスバグナウ+1", lv: 11, d: 5, delay: 55},
    {name: "ハイドロバグナウ", lv: 11, d: 4, delay: 60},
    {name: "ブラスバグナウ", lv: 11, d: 4, delay: 60},
    {name: "バーニンセスタス", lv: 12, d: 3, delay: 40},
    {name: "スマッシュセスタス", lv: 12, d: 2, delay: 48},
    {name: "リザードセスタス", lv: 12, d: 2, delay: 48},
    {name: "ストライクバグナウ", lv: 14, d: 5, delay: 42},
    {name: "王国弓兵戦拳+2", lv: 15, d: 4, delay: 33},
    {name: "義勇兵爪+2", lv: 15, d: 5, delay: 48},
    {name: "王国弓兵戦拳+1", lv: 15, d: 3, delay: 38},
    {name: "義勇兵爪+1", lv: 15, d: 4, delay: 57},
    {name: "共和軍団兵鉄拳+2", lv: 15, d: 6, delay: 76},
    {name: "共和軍団兵鉄拳+1", lv: 15, d: 5, delay: 86},
    {name: "クーガーバグナウ", lv: 20, d: 6, delay: 51},
    {name: "プラトーンセスタス", lv: 20, d: 4, delay: 48},
    {name: "メタルナックル+1", lv: 20, d: 7, delay: 91},
    {name: "メタルナックル", lv: 20, d: 6, delay: 96},
    {name: "ソニックナックル", lv: 22, d: 6, delay: 86},
    {name: "リンクスバグナウ", lv: 24, d: 6, delay: 30},
    {name: "バグナウ+1", lv: 24, d: 7, delay: 55},
    {name: "バグナウ", lv: 24, d: 6, delay: 60},
    {name: "クーストース", lv: 25, d: 4, delay: 48},
    {name: "ポイズンセスタス+1", lv: 27, d: 4, delay: 40},
    {name: "ポイズンセスタス", lv: 27, d: 3, delay: 48},
    {name: "クロー+1", lv: 30, d: 8, delay: 61},
    {name: "ハイドロクロー+1", lv: 30, d: 8, delay: 61},
    {name: "ボレアースセスタス", lv: 30, d: 6, delay: 48},
    {name: "クロー", lv: 30, d: 7, delay: 66},
    {name: "ハイドロクロー", lv: 30, d: 7, delay: 66},
    {name: "タイロカタール", lv: 31, d: 6, delay: 84},
    {name: "タイロカタール+1", lv: 31, d: 7, delay: 75},
    {name: "インパクトナックル", lv: 32, d: 8, delay: 86},
    {name: "カタール+1", lv: 33, d: 9, delay: 75},
    {name: "カタール", lv: 33, d: 8, delay: 84},
    {name: "ミスリルナックル+1", lv: 38, d: 10, delay: 91},
    {name: "ミスリルナックル", lv: 38, d: 9, delay: 96},
    {name: "バンピリッククロー", lv: 39, d: 8, delay: 60},
    {name: "ヒマンテス+1", lv: 40, d: 5, delay: 40},
    {name: "トーニィパタ", lv: 40, d: 11, delay: 96},
    {name: "ヒマンテス", lv: 40, d: 4, delay: 48},
    {name: "ノーブルヒマンテス", lv: 40, d: 4, delay: 48},
    {name: "ミスリルクロー+1", lv: 41, d: 10, delay: 61},
    {name: "ミスリルクロー", lv: 41, d: 9, delay: 66},
    {name: "ビートセスタス", lv: 42, d: 4, delay: 48},
    {name: "エグゾセ", lv: 46, d: 10, delay: 51},
    {name: "アダーガ+1", lv: 47, d: 11, delay: 49},
    {name: "アダーガ", lv: 47, d: 10, delay: 54},
    {name: "パタ+1", lv: 48, d: 15, delay: 86},
    {name: "パタ", lv: 48, d: 14, delay: 96},
    {name: "クロスカウンター", lv: 50, d: 19, delay: 96},
    {name: "リタリエーター", lv: 50, d: 19, delay: 96},
    {name: "連邦軍師制式指揮棒", lv: 50, d: 15, delay: 91},
    {name: "連邦軍師指揮棒+2", lv: 52, d: 16, delay: 71},
    {name: "ダーククロー+1", lv: 52, d: 12, delay: 57},
    {name: "連邦軍師指揮棒+1", lv: 52, d: 15, delay: 81},
    {name: "ダーククロー", lv: 52, d: 11, delay: 66},
    {name: "トラマセスタス", lv: 52, d: 6, delay: 40},
    {name: "クァールセスタス", lv: 52, d: 5, delay: 48},
    {name: "ダークナックル", lv: 54, d: 12, delay: 96},
    {name: "ダークナックル+1", lv: 54, d: 13, delay: 86},
    {name: "バードベーン", lv: 54, d: 14, delay: 84},
    {name: "サインティ+1", lv: 55, d: 11, delay: 49},
    {name: "サインティ", lv: 55, d: 10, delay: 51},
    {name: "ハイドロパタ+1", lv: 56, d: 17, delay: 86},
    {name: "ボーンパタ+1", lv: 56, d: 17, delay: 86},
    {name: "ハイドロパタ", lv: 56, d: 16, delay: 96},
    {name: "ボーンパタ", lv: 56, d: 16, delay: 96},
    {name: "スパルタンセスタス", lv: 58, d: 20, delay: 113},
    {name: "ポペットカタール", lv: 58, d: 17, delay: 84},
    {name: "サーメットクロー+1", lv: 59, d: 12, delay: 42},
    {name: "サーメットクロー", lv: 59, d: 11, delay: 51},
    {name: "ダークカタール+1", lv: 59, d: 14, delay: 75},
    {name: "ダークカタール", lv: 59, d: 13, delay: 84},
    {name: "ブラックアダーガ+1", lv: 60, d: 14, delay: 49},
    {name: "ブラックアダーガ", lv: 60, d: 13, delay: 54},
    {name: "パペットクロー", lv: 60, d: 12, delay: 66},
    {name: "パギュール", lv: 60, d: 14, delay: 106},
    {name: "ジャマダル+1", lv: 61, d: 15, delay: 75},
    {name: "ジャマダル", lv: 61, d: 14, delay: 84},
    {name: "ゴールドパタ", lv: 64, d: 18, delay: 122},
    {name: "ゴールドパタ+1", lv: 64, d: 19, delay: 106},
    {name: "セヴェルスクロー", lv: 64, d: 15, delay: 61},
    {name: "セヴェルスクロー+1", lv: 64, d: 16, delay: 56},
    {name: "ダークサインティ+1", lv: 65, d: 13, delay: 49},
    {name: "ダークサインティ", lv: 65, d: 12, delay: 51},
    {name: "シヴァクロー", lv: 65, d: 11, delay: 60},
    {name: "フェラルファング", lv: 66, d: 19, delay: 96},
    {name: "タイガーファング", lv: 66, d: 18, delay: 96},
    {name: "スタンジャマダル", lv: 66, d: 15, delay: 84},
    {name: "ヴィシュヌセスタス", lv: 67, d: 7, delay: 0},
    {name: "ナラシンハセスタス", lv: 67, d: 6, delay: 0},
    {name: "ドラゴンクロー+1", lv: 68, d: 14, delay: 61},
    {name: "ドラゴンクロー", lv: 68, d: 13, delay: 66},
    {name: "アカンタシェーバー", lv: 69, d: 18, delay: 51},
    {name: "アベンジャー", lv: 69, d: 18, delay: 96},
    {name: "五十四歩", lv: 69, d: 8, delay: 48, memo: "蹴撃+3", kick_p_eq: 0.03},
    {name: "ハデスサインティ+1", lv: 70, d: 19, delay: 49},
    {name: "ハデスサインティ", lv: 70, d: 18, delay: 51},
    {name: "ルーンバグナウ", lv: 70, d: 13, delay: 60},
    {name: "ペルワンカタール", lv: 70, d: 16, delay: 84},
    {name: "ベヒモスセスタス+1", lv: 70, d: 8, delay: 40},
    {name: "ベヒモスセスタス", lv: 70, d: 7, delay: 48},
    {name: "シェンロンバグナウ", lv: 71, d: 21, delay: 51, memo: "DA+1%", double_attack: 0.01},
    {name: "コブラバグナウ", lv: 71, d: 15, delay: 55},
    {name: "ダイアナックル+1", lv: 71, d: 18, delay: 86},
    {name: "筆頭魔戦隊長爪", lv: 71, d: 15, delay: 66},
    {name: "ダイアナックル", lv: 71, d: 17, delay: 96},
    {name: "ペルワンパタ", lv: 71, d: 17, delay: 96},
    {name: "ミーティアセスタス", lv: 71, d: 8, delay: 36},
    {name: "トライアルナックル", lv: 71, d: 16, delay: 96},
    {name: "ワーグバグナウ（潜在）", lv: 72, d: 18, delay: 60},
    {name: "ワーグバグナウ（デフォ）", lv: 72, d: 13, delay: 60},
    {name: "マイティパタ（デフォ）", lv: 72, d: 17, delay: 96},
    {name: "マイティパタ（火曜日）", lv: 72, d: 22, delay: 96},
    {name: "マーシャルナックル", lv: 72, d: 16, delay: 96},
    {name: "フェイスバグナウ（VSあり）", lv: 73, d: 9, delay: 113, memo: "追加攻撃50%と仮定", vulture: 0.5},
    {name: "デストロイヤー（潜在）", lv: 73, d: 18, delay: 48, memo: "クリティカルヒット+6%", crit_p: 0.06},
    {name: "インドラカタール", lv: 73, d: 19, delay: 84, memo: "TA+1%", triple_attack: 0.01},
    {name: "デストロイヤー（デフォ）", lv: 73, d: 5, delay: 48},
    {name: "フェイスバグナウ（VS無し）", lv: 73, d: 9, delay: 113},
    {name: "リュフトサインティ", lv: 73, d: 18, delay: 51},
    {name: "マノプル+1", lv: 74, d: 21, delay: 106},
    {name: "ポンデラスマノプル", lv: 74, d: 20, delay: 122},
    {name: "マノプル", lv: 74, d: 20, delay: 122},
    {name: "オベロンナックル", lv: 75, d: 18, delay: 96},
    {name: "スファライ", lv: 75, d: 23, delay: 86, memo: "初撃のみ3倍撃5%と仮定", three_times: 0.05},
    {name: "スファライ（最終）", lv: 90, d: 44, delay: 86, memo: "初撃のみ3倍撃5%と仮定", three_times: 0.05},
    {name: "カエストス", lv: 75, d: 23, delay: 96},
    {name: "カイザーナックル", lv: 75, d: 20, delay: 86},
    {name: "グランツファウスト", lv: 75, d: 20, delay: 96, memo: "常時アフターマス・初撃のみ2回攻撃発動率50%と仮定", multi_p: 0.5},
    {name: "グランツファウスト（最終）", lv: 90, d: 42, delay: 96, memo: "常時アフターマス・初撃のみ2回攻撃発動率50%と仮定", multi_p: 0.5},
    {name: "ケーニヒスナックル", lv: 75, d: 19, delay: 96},
    {name: "デュナミスナックル", lv: 75, d: 16, delay: 96},
    {name: "バーニンナックル", lv: 75, d: 16, delay: 96},
    {name: "ミリタントナックル", lv: 75, d: 1, delay: 96},
    {name: "レリックナックル", lv: 75, d: 1, delay: 999},
    {name: "ピュジリスト", lv: 75, d: 9, delay: 86},
    {name: "シミアンフィスト", lv: 75, d: 12, delay: 86},
    {name: "マンティス", lv: 75, d: 14, delay: 55},
    {name: "マンティスNo.75", lv: 75, d: 21, delay: 55},
    {name: "マンティスNo.1138", lv: 75, d: 22, delay: 55},
    {name: "ワーグファング", lv: 75, d: 0, delay: 75},
    {name: "ワーグファングNo.78", lv: 75, d: 17, delay: 140, memo: "強ワーグ系。時々2回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 2},
    {name: "ワーグファングNo.81", lv: 75, d: 0, delay: 140, memo: "弱ワーグ系。時々2回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 2},
    {name: "ワーグファングNo.1141", lv: 75, d: 18, delay: 140, memo: "強ワーグ系。時々2回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 2},
    {name: "ワーグファングNo.1143", lv: 75, d: 0, delay: 122, memo: "弱ワーグ系。時々2回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 2},
    {name: "キャッツクロー", lv: 75, d: 10, delay: 66},
    {name: "キャッツクロー（ステ）", lv: 75, d: 18, delay: 61},
    {name: "キャッツクロー（追加効果）", lv: 75, d: 19, delay: 66},
    {name: "ルナリスクロー", lv: 80, d: 26, delay: 96},
    {name: "アフリクター", lv: 77, d: 22, delay: 96, memo: "蹴撃+7 クリティカルヒット+3%", kick_p_eq: 0.07, crit_p: 0.03},
    {name: "ポワンサヴァット", lv: 77, d: 19, delay: 51},
    {name: "ポワンサヴァット+1", lv: 77, d: 20, delay: 49},
    {name: "ウルスラグナ", lv: 80, d: 27, delay: 51},
    {name: "ウルスラグナNo.1909", lv: 85, d: 32, delay: 51, memo: "常時アフターマス・2倍撃発動率20%と仮定。", two_times: 0.2},
    {name: "ウルスラグナ（最終）", lv: 90, d: 35, delay: 51, memo: "常時アフターマス・2倍撃発動率20%と仮定。", two_times: 0.2},
    {name: "レバナントフィスト", lv: 80, d: 23, delay: 55},
    {name: "Rフィスト+1", lv: 85, d: 28, delay: 55},
    {name: "Rフィスト+2", lv: 90, d: 31, delay: 55},
    {name: "アルサインクローNo.1142", lv: 80, d: 19, delay: 140, memo: "強ワーグ系。時々2回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 2},
    {name: "アルサインクロー+1No.1911", lv: 85, d: 23, delay: 140, memo: "強ワーグ系。時々2回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 2},
    {name: "アルサインクローNo.1144", lv: 80, d: 0, delay: 140, memo: "弱ワーグ系。時々2-3回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 3},
    {name: "アルサインクロー+1No.1912", lv: 85, d: 0, delay: 132, memo: "弱ワーグ系。時々2-3回攻撃。複数回攻撃発動率43.75%と仮定。", occ_p: 0.4375, occ_n: 3},
    {name: "アルサインクローNo.1145", lv: 80, d: 23, delay: 86, memo: "弱ワーグ系。DA+7%", double_attack: 0.07},
    {name: "タイパンファング", lv: 80, d: 22, delay: 61},
    {name: "タイパンファング+1", lv: 85, d: 26, delay: 61},
    {name: "タイパンファング+2", lv: 90, d: 29, delay: 61},
    {name: "バラクーダ", lv: 80, d: 14, delay: 60},
    {name: "バラクーダNo.1198", lv: 80, d: 22, delay: 60},
    {name: "バラクーダNo.1199", lv: 80, d: 20, delay: 60},
    {name: "バラクーダ+1", lv: 85, d: 23, delay: 60},
    {name: "バラクーダ+2", lv: 90, d: 23, delay: 60},
    {name: "マグヌスサインティ", lv: 82, d: 10, delay: 51, memo: "マグヌスストーン装備時、時々2倍撃。発動率50%と仮定。", vulture: 0.5},
    {name: "ヘフォンナックル", lv: 85, d: 30, delay: 86},
    {name: "トウリンセスタス", lv: 89, d: 28, delay: 48},
    {name: "フュアロセスタス", lv: 90, d: 22, delay: 30},
    {name: "アイラバグナウ", lv: 87, d: 23, delay: 60},
    {name: "アイラバグナウ+1", lv: 87, d: 24, delay: 57}
];

// D/間隔（手）
function calc_dps_h (st, d, delay) {
    var da = st['double_attack']; // DA
    var ta = st['triple_attack']; // TA

    var add1 = 0; // 初段のみの効果
    add1 += 2 * st['three_times']; // スファライの3倍撃（非DA/TA時）
    add1 += st['multi_p']; // グランツファウストの追加攻撃
    add1 += st['two_times']; // ウルスラグナの2倍撃（非DA/TA時）

    var add2 = 2*ta + (1-ta)*da; // 両手に乗る効果
    add2 += (1-ta)*(1-da)*(st['occ_n']-1)*st['occ_p']; // 時々2-n回攻撃
    add2 += st['vulture']; // ヴァルチャ

    return d.map(function (d) {
        return (d * ((1 + add2) * 2 + add1)) * 60.0 / delay;
    });
}

// D/間隔（蹴撃）
function calc_dps_k (st, d, delay) {
    return d.map(function (d) {
        return d * st['kick_p_eq'] * (1+st['kick_add_p']) * 60.0 / delay;
    });
}

// D/間隔（猫足）
function calc_dps_f (st, d, delay) {
    var da = st['double_attack'];
    var ta = st['triple_attack'];
    var kp = st['kick_p_eq'];
    var ka = st['kick_add_p'];
    var occ_np = 1.0;
    for (var i=0; i<st['occ_n']-1; i++) {
        occ_np *= (1-st['occ_p']);
    }
    return d.map(function (d) {
        //var add_p = 1 - (1-ta) * (1-da) * occ_np * (1-kp); // 乗算式
        var add_p = ta + da + kp + occ_np; // 加算式
        add_p = Math.min(0.95, add_p); // 追加攻撃発生キャップは95%？（推測
        return d * (1 + add_p * (1 + ka)) * 60.0 / delay;
    });
}

// 武器一覧の計算
function weapon_calc (mystatus) {
    for (var i=0; i<weapon_list.length; i++) {
        var w = weapon_list[i];
        if (!w.memo) w.memo = "";
        var st = {};
        ['double_attack', 'triple_attack', 'kick_p_eq'].map(function (prop) {
            st[prop] = mystatus[prop];
            if (w[prop]) st[prop] += w[prop];
        });
        st['occ_n'] = w['occ_n'];
        if (!st['occ_n']) st['occ_n'] = 0;
        st['occ_p'] = w['occ_p'];
        if (!st['occ_p']) st['occ_p'] = 0;
        st['three_times'] = w['three_times'];
        if (!st['three_times']) st['three_times'] = 0;
        st['multi_p'] = w['multi_p'];
        if (!st['multi_p']) st['multi_p'] = 0;
        st['two_times'] = w['two_times'];
        if (!st['two_times']) st['two_times'] = 0;
        st['vulture'] = w['vulture'];
        if (!st['vulture']) st['vulture'] = 0;

        var th, tk;
        if (mystatus['footwork']) {
            w.weapon_rank = 0;
            w.sv_top = mystatus['kick_d_sv_top'];
            w.sv_mid = mystatus['kick_d_sv_mid'];
            w.sv_bot = mystatus['kick_d_sv_bot'];
            w.total_delay = mystatus['hand_delay'];
            w.haste_delay = Math.ceil(w.total_delay * (1024 - mystatus['haste_all']) / 1024.0);
            th = [0.0, 0.0, 0.0];
            tk = calc_dps_f(st, [w.sv_bot, w.sv_mid, w.sv_top], w.haste_delay);
        } else {
            w.weapon_rank = Math.floor((w.d+3)/9);

            var sv_top = 8 + w.weapon_rank;
            w.sv_top = mystatus['hand_d'] + w.d + sv_top;

            var sv_bot = Math.min(-w.weapon_rank, -2);
            w.sv_bot = mystatus['hand_d'] + w.d + sv_bot;

            w.sv_mid = Math.floor((w.sv_top + w.sv_bot)/2);

            w.total_delay = mystatus['hand_delay'] + w.delay;
            w.haste_delay = Math.ceil(w.total_delay * (1024 - mystatus['haste_all']) / 1024.0);

            th = calc_dps_h(st, [w.sv_bot, w.sv_mid, w.sv_top], w.haste_delay);
            tk = calc_dps_k(st, [mystatus['kick_d_sv_bot'], mystatus['kick_d_sv_mid'], mystatus['kick_d_sv_top']], w.haste_delay);
        }
        var crit_p = mystatus['crit_p'] + (w['crit_p']?w['crit_p']:0);
        if (crit_p > 1.0) crit_p = 1.0;
        var crit_n = mystatus['crit_n'] * (1 + (w['crit_n']?w['crit_n']:0));
        var acc_crit = 0.95 * (1 + crit_p * crit_n);
        w.dps_bot = ff((th[0] + tk[0]) * acc_crit);
        w.dps_mid = ff((th[1] + tk[1]) * acc_crit);
        w.dps_top = ff((th[2] + tk[2]) * acc_crit);
    }
}

function get_inputs (mystatus) {
    // 装備ヘイスト
    mystatus['haste_eq'] = parseInt(getv('t_haste_eq'));
    if (mystatus['haste_eq'].toString() == "NaN") mystatus['haste_eq'] = 0;
    if (256 < mystatus['haste_eq']) mystatus['haste_eq'] = 256;
    // 魔法ヘイスト
    mystatus['haste_magic'] = parseInt(getv('t_haste_magic'));
    if (mystatus['haste_magic'].toString() == "NaN") mystatus['haste_magic'] = 0;
    if (448 < mystatus['haste_magic']) mystatus['haste_magic'] = 448;
    // ヘイストサンバ
    mystatus['haste_samba'] = parseInt(getv('t_haste_samba'));
    if (mystatus['haste_samba'].toString() == "NaN") mystatus['haste_samba'] = 0;
    // Lv
    mystatus['lv'] = parseInt(getv('t_lv'));
    if (mystatus['lv'].toString() == "NaN") mystatus['lv'] = 1;
    // 格闘スキルメリポ
    mystatus['meripo_skill'] = parseInt(getv('t_meripo_skill'));
    if (mystatus['meripo_skill'].toString() == "NaN") mystatus['meripo_skill'] = 0;
    if (mystatus['meripo_skill'] < 0) mystatus['meripo_skill'] = 0;
    else if (8 < mystatus['meripo_skill']) mystatus['meripo_skill'] = 8;
    // 蹴撃メリポ
    mystatus['meripo_kick'] = parseInt(getv('t_meripo_kick')) * 0.01;
    if (mystatus['meripo_kick'].toString() == "NaN") mystatus['meripo_kick'] = 0;
    // 武器D
    mystatus['weapon_d'] = parseInt(getv('t_weapon_d'));
    if (mystatus['weapon_d'].toString() == "NaN") mystatus['weapon_d'] = 0;
    // 武器隔+
    mystatus['weapon_delay'] = parseInt(getv('t_weapon_delay'));
    if (mystatus['weapon_delay'].toString() == "NaN") mystatus['weapon_delay'] = 0;
    // オーグメントによる武器隔-n%
    mystatus['aug_delay_r'] = parseInt(getv('t_aug_delay_r'));
    if (mystatus['aug_delay_r'].toString() == "NaN") mystatus['aug_delay_r'] = 0;
    // MA効果アップ
    mystatus['ma_plus'] = parseInt(getv('t_ma_plus'));
    if (mystatus['ma_plus'].toString() == "NaN") mystatus['ma_plus'] = 0;
    mystatus['ma_plus'] *= -1;
    // 時々2-n回攻撃
    mystatus['occ_n'] = parseInt(getv('t_occ_n'));
    if (mystatus['occ_n'].toString() == "NaN") mystatus['occ_n'] = 1;
    mystatus['occ_p'] = parseFloat(getv('t_occ_p')) * 0.01;
    if (mystatus['occ_p'].toString() == "NaN") mystatus['occ_p'] = 0.4375; // デフォルトで43.75%
    // ダブルアタック
    mystatus['double_attack'] = parseInt(getv('t_double_attack')) * 0.01;
    if (mystatus['double_attack'].toString() == "NaN") mystatus['double_attack'] = 0;
    // トリプルアタック
    mystatus['triple_attack'] = parseInt(getv('t_triple_attack')) * 0.01;
    if (mystatus['triple_attack'].toString() == "NaN") mystatus['triple_attack'] = 0;
    // ヴァルチャ
    mystatus['vulture'] = parseFloat(getv('t_vulture')) * 0.01;
    if (mystatus['vulture'].toString() == "NaN") mystatus['vulture'] = 0;
    // 初段3倍撃
    mystatus['three_times'] = parseFloat(getv('t_three_times')) * 0.01;
    if (mystatus['three_times'].toString() == "NaN") mystatus['three_times'] = 0;
    // グランツファウスト追加攻撃発生率
    mystatus['multi_p'] = parseFloat(getv('t_multi_p')) * 0.01;
    if (mystatus['multi_p'].toString() == "NaN") mystatus['multi_p'] = 0;
    // ウルスラグナ2倍撃発生率
    mystatus['two_times'] = parseFloat(getv('t_two_times')) * 0.01;
    if (mystatus['two_times'].toString() == "NaN") mystatus['two_times'] = 0;
    // 蹴撃+
    mystatus['kick_plus'] = parseInt(getv('t_kick_plus')) * 0.01;
    if (mystatus['kick_plus'].toString() == "NaN") mystatus['kick_plus'] = 0;
    // 追加蹴撃確率
    mystatus['kick_add_p'] = parseInt(getv('t_kick_add_p')) * 0.01;
    if (mystatus['kick_add_p'].toString() == "NaN") mystatus['kick_add_p'] = 0;
    // 蹴撃攻撃力アップ
    mystatus['kick_d_plus'] = parseInt(getv('t_kick_d_plus'));
    if (mystatus['kick_d_plus'].toString() == "NaN") mystatus['kick_d_plus'] = 0;
    // 格闘スキル+
    mystatus['skill_plus'] = parseInt(getv('t_skill_plus'));
    if (mystatus['skill_plus'].toString() == "NaN") mystatus['skill_plus'] = 0;
    // ストアTP
    mystatus['stp'] = parseInt(getv('t_stp'));
    if (mystatus['stp'].toString() == "NaN") mystatus['stp'] = 0;
    // ストアTP（WS時）
    mystatus['ws_stp'] = parseInt(getv('t_ws_stp'));
    if (mystatus['ws_stp'].toString() == "NaN") mystatus['ws_stp'] = 0;
    // 猫足立ち
    if (ischecked('t_footwork')) mystatus['footwork'] = true;
    else mystatus['footwork'] = false;
    if (ischecked('t_hundred_fists')) mystatus['footwork'] = false;
    // クリティカル率
    mystatus['crit_p'] = parseFloat(getv('t_crit_p')) * 0.01;
    if (mystatus['crit_p'].toString() == "NaN") mystatus['crit_p'] = 0.05;
    // クリティカル倍撃近似
    mystatus['crit_n'] = parseFloat(getv('t_crit_n'));
    if (mystatus['crit_n'].toString() == "NaN") mystatus['crit_n'] = 2.0;
}

function set_status (mystatus) {
    // 総合ヘイスト
    mystatus['haste_all'] = mystatus['haste_eq'] + mystatus['haste_magic'] + mystatus['haste_samba'];
    if (800 < mystatus['haste_all']) mystatus['haste_all'] = 800;
    // 百烈拳
    if (ischecked('t_hundred_fists')) mystatus['haste_all'] = 0.75*1024;
    setv('t_haste_all', mystatus['haste_all']);
    t = ff(mystatus['haste_all']/10.24);
    setv('t_haste_all_percent', t);

    // 総合スキル
    mystatus['skill'] = mystatus['skill_plus'];
    var skill_bounds = [0, 50, 60, 70, 80, 99];
    var skill_diff = [0, 3, 5, 4.85, 5, 6];
    var skill_sum = [3, 153, 203, 251, 301, 415];
    for (var i=1; i<skill_bounds.length; i++) {
        if (mystatus['lv'] < skill_bounds[i]) {
            mystatus['skill'] += Math.floor(skill_sum[i-1] + (mystatus['lv'] - skill_bounds[i-1]) * skill_diff[i]);
            break;
        }
    }
    // スキルメリポ
    var meripo_bounds = [10, 20, 30, 40, 50, 55, 60, 65];
    for (var i=0; i<meripo_bounds.length; i++) {
        if (meripo_bounds[i] <= mystatus['lv'] && (i+1) <= mystatus['meripo_skill']) mystatus['skill'] += 2;
    }
    setv('t_skill', mystatus['skill']);

    // 素手D
    mystatus['hand_d'] = 3 + Math.floor(mystatus['skill'] * 0.11);
    setv('t_hand_d', mystatus['hand_d']);

    // 武器ランク
    mystatus['weapon_rank'] = Math.floor((mystatus['weapon_d']+3)/9.0);
    if (mystatus['footwork']) mystatus['weapon_rank'] = 0; // 猫足立ち時は固定で0
    setv('t_weapon_rank', mystatus['weapon_rank']);

    // SV関数上限
    mystatus['sv_top'] = 8 + mystatus['weapon_rank'];
    setv('t_sv_top', mystatus['sv_top']);

    // SV関数下限
    mystatus['sv_bot'] = Math.min(-mystatus['weapon_rank'], -2);
    setv('t_sv_bot', mystatus['sv_bot']);

    // SV関数中央値
    mystatus['sv_mid'] = Math.floor((mystatus['sv_top'] + mystatus['sv_bot'])/2);
    setv('t_sv_mid', mystatus['sv_mid']);

    // 固定ダメージ（手）
    mystatus['hand_d_sv_top'] = mystatus['hand_d'] + mystatus['weapon_d'] + mystatus['sv_top'];
    mystatus['hand_d_sv_mid'] = mystatus['hand_d'] + mystatus['weapon_d'] + mystatus['sv_mid'];
    mystatus['hand_d_sv_bot'] = mystatus['hand_d'] + mystatus['weapon_d'] + mystatus['sv_bot'];
    var hand_d = [mystatus['hand_d_sv_bot'], mystatus['hand_d_sv_mid'], mystatus['hand_d_sv_top']].join(" ～ ");
    setv('t_hand_d_sv', hand_d);
    // 固定ダメージ（蹴撃）
    mystatus['kick_d_sv_top'] = mystatus['hand_d'] + mystatus['kick_d_plus'] + 8;
    mystatus['kick_d_sv_mid'] = mystatus['hand_d'] + mystatus['kick_d_plus'] + 3;
    mystatus['kick_d_sv_bot'] = mystatus['hand_d'] + mystatus['kick_d_plus'] - 1;
    if (mystatus['footwork']) {
        mystatus['kick_d_sv_top'] = mystatus['hand_d'] + 18 + mystatus['kick_d_plus'] + 8;
        mystatus['kick_d_sv_mid'] = mystatus['hand_d'] + 18 + mystatus['kick_d_plus'] + 3.5;
        mystatus['kick_d_sv_bot'] = mystatus['hand_d'] + 18 + mystatus['kick_d_plus'] - 1;
    }
    var kick_d = [mystatus['kick_d_sv_bot'], mystatus['kick_d_sv_mid'], mystatus['kick_d_sv_top']].join(" ～ ");
    setv('t_kick_d_sv', kick_d);

    // 素手間隔（MA）
    mystatus['hand_delay'] = 400;
    if (mystatus['footwork']) {
        //if (mystatus['lv'] >= 82) mystatus['hand_delay'] = 460;
        //else mystatus['hand_delay'] = 480;
        mystatus['hand_delay'] = 480;
    }
    else if (mystatus['lv'] >= 82) mystatus['hand_delay'] = 280;
    else if (mystatus['lv'] >= 75) mystatus['hand_delay'] = 300;
    else if (mystatus['lv'] >= 61) mystatus['hand_delay'] = 320;
    else if (mystatus['lv'] >= 46) mystatus['hand_delay'] = 340;
    else if (mystatus['lv'] >= 31) mystatus['hand_delay'] = 360;
    else if (mystatus['lv'] >= 16) mystatus['hand_delay'] = 380;
    if (mystatus['ma_plus']) mystatus['hand_delay'] += mystatus['ma_plus'];
    setv('t_hand_delay', mystatus['hand_delay']);

    // 基礎間隔
    //mystatus['delay'] = Math.ceil(mystatus['hand_delay'] + mystatus['weapon_delay'] + 360.0 * mystatus['aug_delay_r'] / 100);
    mystatus['delay'] = Math.ceil(mystatus['hand_delay'] + mystatus['weapon_delay'] * (1 + mystatus['aug_delay_r'] / 100));
    if (mystatus['footwork']) mystatus['delay'] = mystatus['hand_delay'];
    setv('t_delay', mystatus['delay']);
    // ヘイスト込み間隔
    mystatus['haste_delay'] = Math.ceil(mystatus['delay'] * (1024 - mystatus['haste_all']) / 1024.0);
    setv('t_haste_delay', mystatus['haste_delay']);

    // 基礎蹴撃確率
    mystatus['kick_p'] = 0;
    if (mystatus['lv'] < 51) mystatus['kick_p'] = 0.0;
    else if (mystatus['lv'] < 71) mystatus['kick_p'] += 0.1;
    else if (mystatus['lv'] < 76) mystatus['kick_p'] += 0.125;
    else mystatus['kick_p'] += 0.145;
    if (75 <= mystatus['lv']) mystatus['kick_p'] += mystatus['meripo_kick'];
    setv('t_kick_p', ff(mystatus['kick_p']*100, false));

    // 装備込み蹴撃確率
    mystatus['kick_p_eq'] = mystatus['kick_p'] + mystatus['kick_plus'];
    setv('t_kick_p_eq', ff(mystatus['kick_p_eq']*100, false));

    // 得TP
    var tp_base = Math.ceil(mystatus['delay'] / 2);
    if (mystatus['footwork']) tp_base = mystatus['delay'];
    mystatus['tp'] = parseFloat(floor2(calc_tp(tp_base) * (1 + mystatus['stp'] / 100), true, 1, 1));
    setv('t_tp', ff(mystatus['tp'], true, 1));
    setv('t_tp_speed', ff(mystatus['tp']*(2*(1+mystatus['double_attack']+2*mystatus['triple_attack'])+mystatus['kick_p_eq']*(1+mystatus['kick_add_p']))/mystatus['haste_delay']*60*0.95));
    // 得TP（WS）
    mystatus['ws_tp'] = parseFloat(floor2(floor2(calc_tp(tp_base) * (1 + mystatus['ws_stp'] / 100), 1) * 2 + floor2(1 + mystatus['ws_stp'] / 100, 1) * 6, 1));
    setv('t_ws_tp', ff(mystatus['ws_tp'], true, 1));
}

function calc () {
    get_inputs(mystatus);
    set_status(mystatus);

    // 固定ダメージx手数/ヘイスト込み間隔（手）
    var total_dps;
    var d = [mystatus['hand_d_sv_top'], mystatus['hand_d_sv_mid'], mystatus['hand_d_sv_bot']];
    total_dps = calc_dps_h(mystatus, d, mystatus['haste_delay']);
    mystatus['hand_dps_top'] = total_dps[0];
    mystatus['hand_dps_mid'] = total_dps[1];
    mystatus['hand_dps_bot'] = total_dps[2];
    if (mystatus['footwork']) {
        mystatus['hand_dps_top'] = 0;
        mystatus['hand_dps_mid'] = 0;
        mystatus['hand_dps_bot'] = 0;
    }
    var hand_dps = [mystatus['hand_dps_bot'], mystatus['hand_dps_mid'], mystatus['hand_dps_top']].map(function (dps) { return ff(dps); }).join(' ');
    setv('t_hand_dps', hand_dps);

    // 固定ダメージx手数/ヘイスト込み間隔（蹴撃）
    d = [mystatus['kick_d_sv_top'], mystatus['kick_d_sv_mid'], mystatus['kick_d_sv_bot']];
    total_dps = calc_dps_k(mystatus, d, mystatus['haste_delay']);
    mystatus['kick_dps_top'] = total_dps[0];
    mystatus['kick_dps_mid'] = total_dps[1];
    mystatus['kick_dps_bot'] = total_dps[2];
    var foot_dps =  [ff(mystatus['kick_dps_bot']), ff(mystatus['kick_dps_mid']), ff(mystatus['kick_dps_top'])].join(' ');
    if (mystatus['footwork']) {
        var dps = calc_dps_f(mystatus, [mystatus['kick_d_sv_bot'], mystatus['kick_d_sv_mid'], mystatus['kick_d_sv_top']], mystatus['haste_delay']);
        mystatus['kick_dps_bot'] = dps[0];
        mystatus['kick_dps_mid'] = dps[1];
        mystatus['kick_dps_top'] = dps[2];
        foot_dps = [dps[0], dps[1], dps[2]].map(function (dps) { return ff(dps); }).join(' ');
    }
    setv('t_kick_dps', foot_dps);

    // 固定ダメージx手数/ヘイスト込み間隔（手足合計）
    mystatus['dps_top'] = mystatus['hand_dps_top'] + mystatus['kick_dps_top'];
    mystatus['dps_mid'] = mystatus['hand_dps_mid'] + mystatus['kick_dps_mid'];
    mystatus['dps_bot'] = mystatus['hand_dps_bot'] + mystatus['kick_dps_bot'];

    var acc_crit = 0.95 * (1 + mystatus['crit_p'] * mystatus['crit_n']);
    setv('t_dps',
        [mystatus['dps_bot'], mystatus['dps_mid'], mystatus['dps_top']].map(function (dps) { return ff(dps); }).join(' '));
    setv('t_dps_acc',
        [mystatus['dps_bot']*acc_crit, mystatus['dps_mid']*acc_crit, mystatus['dps_top']*acc_crit].map(function (dps) { return ff(dps); }).join(' '));
}

