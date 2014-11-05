ko.filters.money = function(value, arg) {
    return value.formatMoney(2, '￥');
};