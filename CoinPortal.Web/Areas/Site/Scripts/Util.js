var Util = function () {
    return {
        init: function () {

        },

        toDollarFormat: function (numeric, scale) {
            scale = isNaN(c = Math.abs(scale)) ? 0 : scale;
            var d = ",";
            var t = '.';
            var s = numeric < 0 ? "-" : "";
            var i = String(parseInt(numeric = Math.abs(Number(numeric) || 0).toFixed(scale)));
            var j = (j = i.length) > 3 ? j % 3 : 0;
            return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (scale ? d + Math.abs(numeric - i).toFixed(scale).slice(2) : "");
        },
    }
}();

