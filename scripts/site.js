// add all the stuff for _.string into the "_" namespace. 
_.mixin(_.str.exports());
_.mixin({
    format: function (string) {
        /* basic .net string.format function.  only supports {0} and {1}, and does not
         * support any arguments (e.g {0:3f}) */
        var formatted = string;
        for (var i = 1; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    },
    insertAfter: function (array, existingElement, newElement) {
        array.splice(_.indexOf(array, existingElement) + 1, 0, newElement);
    }
});

Number.prototype.formatMoney = function (c, symbol, d, t) {
    var n = this;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    symbol = symbol == undefined ? "" : symbol;
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};