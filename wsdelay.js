if (!window.console) {
    window.console = { log: function (t) {} };
}
var hist = [0,0,0,0,0,0,0,0,0]; // for debug
var _d = document;
function e (id) { return _d.getElementById(id); }
function rand (s) {
    return Math.random();
}

function floor2 (x, d) {
    if (d == undefined) return Math.floor(x);
    var f = Math.pow(10,d);
    return Math.floor(x*f)/f;
}

// input field object
function InputField (id, type, v, isPercent) {
    this.id = id;
    this.type = type;
    this.defaultValue = v;
    this.isPercent = (isPercent === true) ? true : false;
}

InputField.prototype = {
    'get': function (p) {
        switch (this.type) {
            case 'int':   this.value = parseInt(e(this.id).value); break;
            case 'float': this.value = parseFloat(e(this.id).value); break;
            case 'check': this.value = e(this.id).checked; break;
        }
        if (isNaN(this.value)) this.value = this.defaultValue;
        p[this.id] = this.value;
        if (this.type == 'float' && this.isPercent) p[this.id] /= 100.0;
        return p;
    },
    'set': function (v) {
        v = parseFloat(v);
        if (isNaN(v)) v = this.defaultValue;
        if (this.type == 'check') {
            v = (v) ? true : false;
            e(this.id).checked = v;
        }
        else {
            e(this.id).value = v;
        }
        this.value = v;
        return this;
    }
};

// setting
var setting = {
    'inputs': [
        new InputField('N', 'int', 50000), // 試行回数
        new InputField('target_tp', 'float', 100, false), // 目標TP
        new InputField('kick', 'float', 24.5, true), // 蹴撃
        new InputField('regain', 'int', 0), // リゲイン
        new InputField('haste', 'int', 381), // ヘイスト
        new InputField('wstime', 'int', 8), // WS攻撃回数
        new InputField('conservetp', 'float', 8, true), // コンサーブTP

        new InputField('acc', 'float', 95, true), // 通常命中率
        new InputField('wsacc', 'float', 95, true), // WS命中率
        new InputField('stp', 'float', 28, true), // 通常時ストアTP
        new InputField('wsstp', 'float', 25, true), // WS時ストアTP
        new InputField('moksha', 'float', 40, true), // 通常時モクシャ
        new InputField('wsmoksha', 'float', 40, true), // WS時モクシャ
        new InputField('agi', 'float', 10, true), // 通常時AGIモクシャ
        new InputField('wsagi', 'float', 10, true), // WS時AGIモクシャ
        new InputField('da', 'float', 5, true), // 通常時ダブルアタック
        new InputField('wsda', 'float', 0, true), // WS時ダブルアタック
        new InputField('ta', 'float', 0, true), // 通常時トリプルアタック
        new InputField('wsta', 'float', 0, true), // WS時トリプルアタック
        new InputField('ma', 'int', 0), // 通常時マーシャルアーツ効果アップ
        new InputField('wsma', 'int', 0), // WS時マーシャルアーツ効果アップ
        new InputField('dual_k', 'float', 1.0, false), // 通常時二刀流係数
        new InputField('wsdual_k', 'float', 1.0, false), // WS時二刀流係数

        new InputField('delay_main', 'int', 340), // メイン武器隔
        new InputField('delay_sub', 'int', 0), // サブ武器隔
        new InputField('occ_n_main', 'int', 1), // メイン武器時々2-N回攻撃 攻撃回数
        new InputField('occ_n_sub', 'int', 1), // サブ武器時々2-N回攻撃 攻撃回数
        new InputField('occ_p_main', 'float', 43.75, true), // メイン武器時々2-N回攻撃発生率
        new InputField('occ_p_sub', 'float', 43.75, true), // サブ武器時々2-N回攻撃発生率
        new InputField('vulture_main', 'float', 0, true), // メイン武器ヴァルチャ追加攻撃発生率
        new InputField('vulture_sub', 'float', 0, true), // サブ武器ヴァルチャ追加攻撃発生率

        new InputField('h2h', 'check', true), // 格闘
        new InputField('dual', 'check', false), // 二刀流
        new InputField('footwork', 'check', false), // 猫足立ち

        new InputField('zanshin', 'float', 0, true), // 残心発動率
        new InputField('zanshin_acc', 'float', 95, true), // 残心時命中率
        new InputField('qa', 'float', 0, true), // 通常時クワッドアタック
        new InputField('wsqa', 'float', 0, true), // WS時クワッドアタック

        new InputField('kick_add', 'float', 0, true), // 追加蹴撃率
        new InputField('magian_main', 'check', true), // メイン武器メイジャン複数回
        new InputField('magian_sub', 'check', true), // サブ武器メイジャン複数回
        new InputField('jabeforews', 'int', 0) // WS前アビ実行回数
    ],
    'postproc': function (p) {
        // 猫足立ち
        if (p.footwork) {
            p.h2h = true;
            e('h2h').checked = true;
        }
        // 格闘
        if (p.h2h) {
            p.dual = false;
            e('dual').checked = false;
        }
        // 二刀流
        if (p.dual) {
            p.h2h = false;
            e('h2h').checked = false;
        }
        // 目標TP
        p.target_tp *= 10;
        // MA効果アップ
        if (!p.h2h || p.footwork) p.ma = 0;
        if (!p.h2h || p.footwork) p.wsma = 0;
        // 二刀流係数（格闘：1.0）
        if (!p.dual) p.dual_k = 1.0;
        // WS時二刀流係数
        if (!p.dual) p.wsdual_k = 1.0;
        // 隔
        if (p.h2h) p.delay_sub = 0;
        p.delay = (p.delay_main + p.delay_sub - p.ma) * p.dual_k;
        p.wsdelay = (p.delay_main + p.delay_sub - p.wsma) * p.wsdual_k;
        // 攻撃間隔短縮キャップ（二刀流・ヘイストで合計80%以下になるようにヘイスト値を調整）
        if (p.dual_k * (1024 - p.haste) / 1024.0 < 0.2) p.haste = Math.floor(1024 - 0.2 / p.dual_k * 1024);
        // ヘイスト込み間隔
        p.total_delay = p.delay * (1024 - p.haste) / 1024.0;
        p.total_delay_s = p.total_delay / 60.0;
        // 通常得TP
        p.tp = calc_tp((p.dual || (p.h2h && !p.footwork))? p.delay / 2 : p.delay);
        p.gtp = Math.floor(p.tp * (1+p.stp));
        // WS時得TP
        p.wstp = calc_tp((p.dual || (p.h2h && !p.footwork))? p.wsdelay / 2 : p.wsdelay);
        p.wsgtp1 = Math.floor(p.wstp * (1+p.wsstp));
        p.wsgtp2 = Math.floor(10 * (1+p.wsstp));
        // リゲイン
        p.regain *= 10;
        // 与TP
        p.dtp = Math.floor((p.tp+30) * (1-p.moksha) * (1-p.agi));
        p.wsdtp = Math.floor((p.tp+30) * (1-p.wsmoksha) * (1-p.wsagi));
        if (p.footwork) {
            var tp = calc_tp(p.delay / 2);
            p.dtp = Math.floor((tp+30) * (1-p.moksha) * (1-p.agi));
            p.wsdtp = Math.floor((tp+30) * (1-p.wsmoksha) * (1-p.wsagi));
        }
        // 時々2回攻撃
        if (p.occ_n_main < 1) p.occ_n_main = 1;
        if (p.occ_n_sub < 1) p.occ_n_sub = 1;
        if (p.h2h) {
            p.vulture_sub = p.vulture_main;
            p.occ_n_sub = p.occ_n_main;
            p.occ_p_sub = p.occ_p_main;
        }
    },
    'argset': function (s) {
        var vs;
        if (s) vs = s.split(',');
        else vs = [];
        var len = vs.length;
        var i;
        for (i=0; i<len; i++) {
            var v = vs.shift();
            this.inputs[i].set(v);
        }
        for (; i<this.inputs.length; i++) {
            this.inputs[i].set(undefined);
        }
    },
    'makeurl': function () {
        var vs = [];
        for (var i=0; i<this.inputs.length; i++) {
            var v = this.inputs[i].value;
            if (this.inputs[i].type == 'float') v = floor2(v, 3);
            else if (this.inputs[i].type == 'check') v = (v)?'1':'0';
            vs.push(v);
        }
        var url = [location.protocol, '//', location.hostname, location.pathname, '#', vs.join(',')].join('');
        e('url').value = url;
    }
};

function _calc_tp (delay, basetp, basedelay, k) {
    return Math.floor(basetp + (delay - basedelay) * k);
}

function calc_tp (delay) {
    var ret;
    if (delay <= 180)      ret = _calc_tp(delay,  50, 180, 15 / 180);
    else if (delay <= 450) ret = _calc_tp(delay,  50, 180, 65 / 270);
    else if (delay <= 480) ret = _calc_tp(delay, 115, 450, 15 /  30);
    else if (delay <= 530) ret = _calc_tp(delay, 130, 480, 15 /  50);
    else                   ret = _calc_tp(delay, 145, 530, 35 / 470);
    return ret;
}

function get_settings (p) {
    // フィールドからの読み込み
    for (var i=0; i<setting.inputs.length; i++) {
        p = setting.inputs[i].get(p);
    }
    // 入力値に基づいてデータ構築
    p = setting.postproc(p);
    return p;
}

function make_attack_procs (p) {
    var attackprocs = []; // 1ターンの追加攻撃回数を計算する関数群

    if (p.footwork) {
        // 時々2-n回攻撃
        var occ_np = 0.0;
        if (p.magian_main) {
            // メイジャン複数回武器
            // 猫足立ちについては1回攻撃以外はすべて追加蹴撃成立と見なす（暫定）
            // 時々2回   -> 1回:2回 = (1-occ_p_main):occ_p_main
            // 時々2-3回 -> 1回:2回 = 50:50
            // 時々2-4回 -> 1回:2回 = 40:60
            occ_np = ([0.0, 0.0, p.occ_p_main, 0.5, 0.6])[p.occ_n_main];
        }
        else {
            occ_np = p.occ_p_main * (p.occ_n_main - 1); // 加算説
        }
        var total_p = Math.min(p.qa + p.ta + p.da + p.kick + occ_np, 0.95); // 加算説
            // 95%キャップと仮定（2011.05.10 VU前は80%～85%キャップだった？）
        if (total_p > 0.0) {
            if (p.kick_add > 0.0) {
                attackprocs.push(function () {
                    if (rand('footwork') <= total_p) {
                        if (rand('footwork_add') <= p.kick_add) {
                            return 2;
                        }
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                attackprocs.push(function () {
                    if (rand('footwork (no adds)') <= total_p) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    }
    else { // 非猫足
        if (p.dual || p.h2h) attackprocs.push(function () { return 1; });
        // DA/TA/QA/複数回攻撃（優先度はQA>TA>DA>複数回攻撃）
        var occ_f = function () { return 0; };
        if (p.magian_main) {
            // メイジャン複数回攻撃武器
            // 時々2回   -> 1回:2回 = (1-occ_p_main):occ_p_main
            // 時々2-3回 -> 1回:2回:3回 = 50:30:20
            // 時々2-4回 -> 1回:2回:3回:4回 = 40:30:20:10
            switch (p.occ_n_main) {
                case 2:
                    occ_f = function () {
                        if (p.occ_p_main > 0.0 && rand() <= p.occ_p_main) {
                            return 1;
                        }
                        return 0;
                    };
                    break;
                case 3:
                    occ_f = function () {
                        var r = rand();
                        if (r <= 0.2) {
                            return 2;
                        }
                        else if (r <= 0.5) {
                            return 1;
                        }
                        return 0;
                    };
                    break;
                case 4:
                    occ_f = function () {
                        var r = rand();
                        if (r <= 0.1) {
                            return 3;
                        }
                        else if (r <= 0.3) {
                            return 2;
                        }
                        else if (r <= 0.6) {
                            return 1;
                        }
                        return 0;
                    };
                    break;
            }
        }
        else { //メイジャン以外の複数回攻撃武器
            occ_f = function () {
                var sum = 0;
                for (var k=1; k<p.occ_n_main; k++) {
                    if (rand() <= p.occ_p_main) {
                        ++sum;
                    }
                }
                return sum;
            };
        }
        attackprocs.push((function () {
            var qa = (p.qa > 0.0);
            var ta = (p.ta > 0.0);
            var da = (p.da > 0.0);
            return function () {
                if (qa && rand() <= p.qa) {
                    return 3;
                }
                else if (ta && rand() <= p.ta) {
                    return 2;
                }
                else if (da && rand() <= p.da) {
                    return 1;
                }
                return occ_f();
            };
        })());

        // ヴァルチャ
        if (p.vulture_main > 0.0) {
            attackprocs.push(function () {
                if (rand() <= p.vulture_main) {
                    return 1;
                }
                return 0;
            });
        }

        // 蹴撃
        if (p.h2h && p.kick > 0.0) {
            if (p.kick_add > 0.0) {
                attackprocs.push(function () {
                    if (rand() <= p.kick) {
                        if (rand() <= p.kick_add) {
                            return 2;
                        }
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                attackprocs.push(function () {
                    if (rand() <= p.kick) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    }

    return attackprocs;
}

function ws (p, s) {
    // WS初撃
    s.wshitcount(p.wsacc, p.wsgtp1);
    // WS追撃（二刀流・格闘）
    if (p.dual || p.h2h) s.wshitcount(p.acc, p.wsgtp1);
    // WS2発目（二刀流・格闘は3発目）以降（通常命中率）
    for (var k=((p.dual || p.h2h) ? 2 : 1); k<p.wstime; k++) {
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // QA
    if (s.wsattack < 6 && p.wsqa != 0.0 && rand() <= p.wsqa) {
        s.wshitcount(p.acc, p.wsgtp2);
        s.wshitcount(p.acc, p.wsgtp2);
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // TA
    else if (s.wsattack < 7 && p.wsta != 0.0 && rand() <= p.wsta) {
        s.wshitcount(p.acc, p.wsgtp2);
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // DA
    else if (s.wsattack < 8 && p.wsda != 0.0 && rand() <= p.wsda) {
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // 2段目QA
    if (p.wstime >= 2 && s.wsattack < 6 && p.wsqa != 0.0 && rand() <= p.wsqa) {
        s.wshitcount(p.acc, p.wsgtp2);
        s.wshitcount(p.acc, p.wsgtp2);
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // 2段目TA
    else if (p.wstime >= 2 && s.wsattack < 7 && p.wsta != 0.0 && rand() <= p.wsta) {
        s.wshitcount(p.acc, p.wsgtp2);
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // 2段目DA
    else if (p.wstime >= 2 && s.wsattack < 8 && p.wsda != 0.0 && rand() <= p.wsda) {
        s.wshitcount(p.acc, p.wsgtp2);
    }
    // 与TP
    if (s.cur_tp > 0) s.dealtp += p.wsdtp;
    // コンサーブTP
    // コンサーブTP+p = 確率p%で発動し、WS後のTP+1.0～20.0が均等ランダム
    if (p.conservetp != 0.0 && rand() <= p.conservetp) {
        s.cur_tp += Math.ceil(rand()*190) + 10;
    }

    s.wstp = Math.floor(s.cur_tp);
    s.sumwshit += s.wshit;
}

function autoattack (p, s, attackprocs) {
    var j = 0;
    s.lasttp = 0.0;
    s.total_tp = s.cur_tp;

    while (s.total_tp < p.target_tp) {
        s.lasttp = s.total_tp;

        var attackcount = 0;
        for (var i=0; i<attackprocs.length; ++i) {
            attackcount += attackprocs[i]();
        }
        attackcount = Math.min(attackcount, 8);

        // for debug
        if (hist[attackcount] != undefined) hist[attackcount] += 1;
        else hist[attackcount] = 1;

        s.hitcount1(p.acc);
        for (var i=0; i<attackcount; ++i) {
            s.hitcount(p.acc);
        }

        j++;
        s.total_tp = s.cur_tp + p.regain * Math.floor((2.0 + j * p.total_delay_s) / 3.0);
    }

    s.sumturn += j;
    if (s.maxturn < j) s.maxturn = j;
    if (s.minturn > j) s.minturn = j;
    if (s.lasttp > (p.target_tp - 10)) s.stop99++;

    return j;
}

function exec () {
    var start = (new Date()).getTime();

    // 設定
    var p = {};
    get_settings(p);

    // 計算用変数
    var s = {
        // 統計量
        p: p, // parameters
        maxturn: 0,
        minturn: 100,
        sumturn: 0.0, // sum of turn to ws
        sumwshit: 0.0, // sum of ws hit count
        stop99: 0,
        dealtp: 0,
        // ループ内のみで使う変数（next()で要リセット）
        cur_tp: 0,
        wstp: 0,
        wshit: 0,
        wsattack: 0,
        lasttp: 0,
        total_tp: 0,
        // 関数
        wshitcount: function (acc, gtp) {
            this.wsattack++;
            if (rand() > acc) return;
            this.cur_tp += gtp;
            this.wshit++;
        },
        hitcount1: function (acc) { // 初撃
            if (!(rand() <= acc || rand() <= p.zanshin && rand() <= p.zanshin_acc)) return;
            this.cur_tp += this.p.gtp;
            this.dealtp += this.p.dtp;
        },
        hitcount: function (acc) {
            if (rand() > acc) return;
            this.cur_tp += this.p.gtp;
            this.dealtp += this.p.dtp;
        },
        next: function () {
            this.cur_tp = 0;
            this.wstp = 0;
            this.wshit = 0;
            this.wsattack = 0;
            this.lasttp = 0;
            this.total_tp = 0;
        }
    };
    var line = "";
    var lines = e('lines');
    var csv = "";
    var attackprocs = make_attack_procs(p);

    for (var i=1; i<=p.N; i++) {
        s.next();
        ws(p, s);
        var j = autoattack(p, s, attackprocs);
        csv += i + "," + s.wshit + "," + (s.wstp / 10) + "," + (s.lasttp / 10) + "," + j + "," + (s.cur_tp / 10) + "\n";
    }

    line = "通常基礎TP" + (p.tp / 10) + "%、";
    line += "通常得TP" + (p.gtp / 10) + "%、";
    line += "通常与TP" + (p.dtp / 10) + "%、";
    line += "1ターン間隔" + Math.floor(p.total_delay) + "（" + floor2(p.total_delay_s, 1) + "秒）<br>";
    line += "WS基礎TP" + (p.wstp / 10) + "%、";
    line += "WS得TP（初段）" + (p.wsgtp1 / 10) + "%、";
    line += "WS得TP（多段）" + (p.wsgtp2 / 10) + "%、";
    line += "WS与TP" + (p.wsdtp / 10) + "%<br>";
    line += "WS平均ヒット数" + floor2(1.0 * s.sumwshit / p.N, 2);
    line += "、最大ターン数" + s.maxturn;
    line += "、最小ターン数" + s.minturn;
    var aveturn = 1.0 * s.sumturn / p.N;
    line += "、平均ターン数" + floor2(aveturn, 2);
    line += "、-1%止まりは" + s.stop99 + "回(" + floor2(s.stop99 / p.N * 100) + "%)でした。<br>";
    var ave_time_bet_ws = floor2(aveturn * p.total_delay_s + 2 + 2*p.jabeforews, 1);
    line += "平均WS間隔は" + ave_time_bet_ws + "秒、";
    var ave_ws_speed = floor2(1.0 / (aveturn * p.total_delay_s + 2 + 2*p.jabeforews) * 60, 4);
    line += "平均WS速度は" + ave_ws_speed + "回/分、";
    var ave_dealtp_speed = floor2(s.dealtp * 0.1 / (p.N * (aveturn * p.total_delay_s + 2 + 2*p.jabeforews)) * 60, 1);
    line += "平均与TP速度は" + ave_dealtp_speed + "TP/分です。<br>";
    e('result').innerHTML = line;
    csv = "回数,WSヒット数,WS得TP,直前TP,ターン数,最終TP\n" + csv;
    e('csv').value = csv;
    setting.makeurl();
    //console.log("consumed time:", (new Date()).getTime() - start);
}

function init () {
    e('exec').onclick = exec;
    e('url').onclick = function (e) { this.select(0, this.value.length); };

    // URL引数
    var s;
    if (location.href.indexOf('#') != -1) {
        s = location.href.split('#').pop();
    }
    setting.argset(s);
    get_settings({});
    setting.makeurl();
}
window.onload = init;

