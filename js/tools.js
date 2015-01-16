/**
 * Created by sergey on 08.01.15.
 */
//Date.prototype.dateDiff = function (d) {
//
//    var diff;
//
//    if (this.getTime() > d.getTime()) {
//        diff = new Date(this.getTime() - d.getTime());
//    } else {
//        diff = new Date(d.getTime() - this.getTime());
//    }
//
//    return {
//        year        : diff.getFullYear() - 1970,
//        month       : diff.getMonth(),
//        day         : diff.getDate() - 1,
//        hour        : diff.getUTCHours(),
//        minute      : diff.getMinutes(),
//        second      : diff.getSeconds(),
//        milliseconds: diff.getMilliseconds()
//    };
//};

var range = function (a, b, step) {
    var A = [];
    if (typeof a == 'number') {
        A[0] = a;
        step = step || 1;
        while (step > 0 ? a + step <= b : a + step >= b) {
            A[A.length] = a += step;
        }
    }
    else {
        var s = 'abcdefghijklmnopqrstuvwxyz';
        if (a === a.toUpperCase()) {
            b = b.toUpperCase();
            s = s.toUpperCase();
        }
        s = s.substring(s.indexOf(a), s.indexOf(b) + 1);
        A = s.split('');
    }
    return A;
};

var JSONtoXFrom = function (obj) {
    var str = [];
    for (var p in obj) { //noinspection JSUnfilteredForInLoop
        if (typeof obj[p] == 'object') {
            //noinspection JSUnfilteredForInLoop
            for (var x in obj[p]) {
                //noinspection JSUnfilteredForInLoop
                str.push(encodeURIComponent(p) + "[]=" + encodeURIComponent(obj[p][x]));
            }
        }
        else {
            //noinspection JSUnfilteredForInLoop
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
};
