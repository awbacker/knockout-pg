/*
 * knockout bindings.  these do not need to be loaded inside a jquery context, only need to be loaded 
 * after the main knockout library
 */

/*
 * Prints a number with commas, and 2 decimal places, and a currency symbole if asked
 * d: data-bind="textMoney: retailPrice" 
 * d: data-bind="textNumeric: retailPrice, precision: 4" 
 * parameters
 *    
 */
ko.bindingHandlers.textMoney = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.bindingHandlers.text.update(element, function () { return _convertNumeric(valueAccessor, allBindings, "¥"); });
    },
    defaultPrecision: 2
};

ko.bindingHandlers.textNumeric = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.bindingHandlers.text.update(element, function () { return _convertNumeric(valueAccessor, allBindings, ""); });
    },
    defaultPrecision: 2
};

ko.bindingHandlers.valueMoney = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.bindingHandlers.value.update(element, function () { return _convertNumeric(valueAccessor, allBindings, "¥"); });
    },
    defaultPrecision: 2
};

ko.bindingHandlers.valueNumeric = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.bindingHandlers.value.init(element, function () { return _convertNumeric(valueAccessor, allBindings, ""); }, allBindings, viewModel, bindingContext);
    }
};

function _convertNumeric(valueAccessor, allBindings, symbol) {
    var value = ko.unwrap(valueAccessor());
    var precision = ko.unwrap(allBindings.get('precision')) || 2;
    symbol = ko.unwrap(allBindings.get('symbol')) || symbol;
    var formattedValue = value.formatMoney(precision, symbol);
    return formattedValue;
}

/*
 * Sets the name on an element using MVC naming
 * This must be used inside a foreach: binding, because it uses the $index of the item
 * The name of the value must be quoted!
 *
 * example:   
 *    <input ... data-bind="mvcListItemName: 'code'" />                  => <input ... name="items[0].code" value="C01"/>
 *    <input ... data-bind="mvcListItemName: 'code', prefix: 'results'"> => <input ... name="results[0].code" />
 */
ko.bindingHandlers.mvcListItemName = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // kall the 'init' function manually when updated var propertyName = ko.unwrap(valueAccessor());
        var propertyName = ko.unwrap(valueAccessor());
        var prefix = ko.unwrap(allBindings.get('prefix')) || 'items';
        var index = ko.unwrap(bindingContext.$index);
        $(element).attr("name", _.format("{0}[{1}].{2}", prefix, index, propertyName));
        $(element).attr("id", _.format("{0}_{1}_{2}", prefix, index, propertyName));
    }
}

ko.bindingHandlers.mvcListItemValMsgFor = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var propertyName = ko.unwrap(valueAccessor());
        var prefix = ko.unwrap(allBindings.get('prefix')) || 'items';
        var index = ko.unwrap(bindingContext.$index);
        $(element).attr("data-valmsg-for", _.format("{0}[{1}].{2}", prefix, index, propertyName));
    }
}

ko.bindingHandlers.mvcListItem = {
    // binds both the NAME and the VALUE 
    preprocess: function (val, name, addBindingCallback) {
        addBindingCallback("value", val);
        addBindingCallback("mvcListItemName", "'" + val + "'");
    }
}

ko.bindingHandlers.toggle = {
    // toggles a boolean value
    // <button data-bind="toggle: isVisible">Show/Hide</button>
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.applyBindingsToNode(element, {
            click: function () {
                value(!value());
            }
        });
    }
};

ko.bindingHandlers.toJSON = {
    // Writes the value of the data item to the element's "text" property.  This 
    // uses a 4 space indended JSON output.  Best used with a <pre> tag.
    //
    // <pre data-bind="toJSON: $data"></pre>
    update: function (element, valueAccessor) {
        return ko.bindingHandlers.text.update(element, function () {
            return ko.toJSON(valueAccessor(), null, 4);
        });
    }
};

ko.bindingHandlers.href = {
    // <a data-bind="href: myUrl">Click</a>
    update: function (element, valueAccessor) {
        ko.bindingHandlers.attr.update(element, function () {
            return { href: valueAccessor() }
        });
    }
};

ko.bindingHandlers.src = {
    // this repalces <img data-bind="attr: { src: myImage }" />
    // <img data-bind="src: myImage" alt="text"/>
    update: function (element, valueAccessor) {
        ko.bindingHandlers.attr.update(element, function () {
            return { src: valueAccessor() }
        });
    }
};

ko.bindingHandlers.hidden = {
    // opposite of the "visible" binding
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.bindingHandlers.visible.update(element, function () { return !value; });
    }
};

/*
 * OBSERVABLE ARRAY HELPER FUNCTIONS
 *   use them like this (inside your view model):  self.itemsArray.each(function(x) { x.quantity( x.quantity() + 1); } 
 *
 *   - insertAfter    (element in array, new element to add)        => no return value
 *   - first          (function(x) returning boolean)               => item or `undefined`
 *   - each           (funciton(x) to call on each item)            => no return value
 *   - sum            (function(x) that returns a number)           => sum of items
 *
 * Helpers that create a new ko.computed() 
 *   - computedSum    (propertyName)          
 *          creates a new ko.pureComputed() that automatically refreshes when the underlying 
 *          array is updated.  For example:
 *              self.totalPrice = self.itemsArray.computedSum("itemPrice")
 */

/* mappings from underscore library, so no need to call self.myArray() and wrap in an _, can just do self.myArray.find(...) */
ko.observableArray.fn.first = function (func) { return _.find(this(), func); } // first is an alias for find
ko.observableArray.fn.find = function (func) { return _.find(this(), func); }
ko.observableArray.fn.each = function (func) { _.each(this(), func); }
ko.observableArray.fn.any = function (func) { return _.any(this(), func); }
ko.observableArray.fn.all = function (func) { return _.all(this(), func); }

ko.observableArray.fn.insertAfter = function (existingElement, newElement) {
    this.splice(this.indexOf(existingElement) + 1, 0, newElement);
}

/* ================================================================================================
 * other observable array functions 
 * ================================================================================================*/

/* 
 * Sums all the values in an array.  Any value that is not a number will use 0
 */
ko.observableArray.fn.sum = function (func) {
    var total = 0;
    ko.utils.arrayForEach(this(), function (x) { total += (+ko.unwrap(func(x)) || 0); });
    return total;
}

/*
 * Computes a sum over an observableArray, using either the name of a property (as a string) or a regular function.
 * - This sum will be updated when the array is updated
 * - Any values that are not numbers will be treated as 0
 * 
 * self.itemsArray = ko.observableArray([ { price: 3.75 }, { price: 5.25 }, { price: "a"}, ...]);
 * ..
 * self.priceTotal1 = self.itemsArray.computedSum("price");  // => 9
 * self.priceTotal2 = self.itemsArray.computedSum(function(x) { return x.price; });
 */
ko.observableArray.fn.computedSum = function (propertyNameOrFunction) {
    var valueFunc = _.isFunction(propertyNameOrFunction)
            ? propertyNameOrFunction
            : function (item) { return item[propertyNameOrFunction]; };

    return ko.pureComputed(function () {
        return this.sum(valueFunc);
    }, this);
}

/* **********************************************************************************
 * EXTENDERS
 *
 * These are added to an ko.observable() to control its behavior.  Not really tested 
 * or used yet, so get ready to debug
 * 
 * self.price = ko.observable(39.3).extend({ numeric: 2});
 */
ko.extenders.numeric = function (target, precision) {
    var result = ko.dependentObservable({
        read: function () {
            return target().formatMoney(precision);
        },
        write: target
    });
    result.raw = target;
    return result;
}

ko.extenders.money = function (target, options) {
    var result = ko.dependentObservable({
        read: function () {
            return target().formatMoney(options.precision || 2, (options.symbol || ""));
        },
        write: target
    });
    result.raw = target;
    return result;
}

