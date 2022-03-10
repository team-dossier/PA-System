"use strict";
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var Rating = (function () {
    function Rating() {
        // -------------------------------------------------------------------------
        // Inputs
        // -------------------------------------------------------------------------
        this.iconClass = "star-icon";
        this.fullIcon = "★";
        this.emptyIcon = "☆";
        this.titles = [];
        // -------------------------------------------------------------------------
        // Outputs
        // -------------------------------------------------------------------------
        this.onHover = new core_1.EventEmitter();
        this.onLeave = new core_1.EventEmitter();
        this.hovered = 0;
        this.hoveredPercent = undefined;
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        this._max = 5;
    }
    Object.defineProperty(Rating.prototype, "max", {
        get: function () {
            return this._max;
        },
        // -------------------------------------------------------------------------
        // Input Accessors
        // -------------------------------------------------------------------------
        set: function (max) {
            this._max = max;
            this.buildRanges();
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------
    Rating.prototype.writeValue = function (value) {
        /*if (value % 1 !== value) {
         this.model = Math.round(value);
         return;
         }*/
        this.model = value;
    };
    Rating.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    Rating.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    // -------------------------------------------------------------------------
    // Implemented from Va..
    // -------------------------------------------------------------------------
    Rating.prototype.validate = function (c) {
        if (this.required && !c.value) {
            return {
                required: true
            };
        }
        return null;
    };
    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------
    Rating.prototype.ngOnInit = function () {
        this.buildRanges();
    };
    // -------------------------------------------------------------------------
    // Host Bindings
    // -------------------------------------------------------------------------
    Rating.prototype.onKeydown = function (event) {
        if ([37, 38, 39, 40].indexOf(event.which) === -1 || this.hovered)
            return;
        event.preventDefault();
        event.stopPropagation();
        var increment = this.float ? 0.5 : 1;
        this.rate(this.model + (event.which === 38 || event.which === 39 ? increment : increment * -1));
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    Rating.prototype.calculateWidth = function (item) {
        if (this.hovered > 0) {
            if (this.hoveredPercent !== undefined && this.hovered === item)
                return this.hoveredPercent;
            return this.hovered >= item ? 100 : 0;
        }
        return this.model >= item ? 100 : 100 - Math.round((item - this.model) * 10) * 10;
    };
    Rating.prototype.setHovered = function (hovered) {
        if (!this.readonly && !this.disabled) {
            this.hovered = hovered;
            this.onHover.emit(hovered);
        }
    };
    Rating.prototype.changeHovered = function (event) {
        if (!this.float)
            return;
        var target = event.target;
        var relativeX = event.pageX - target.offsetLeft;
        var percent = Math.round((relativeX * 100 / target.offsetWidth) / 10) * 10;
        this.hoveredPercent = percent > 50 ? 100 : 50;
    };
    Rating.prototype.resetHovered = function () {
        this.hovered = 0;
        this.hoveredPercent = undefined;
        this.onLeave.emit(this.hovered);
    };
    Rating.prototype.rate = function (value) {
        if (!this.readonly && !this.disabled && value >= 0 && value <= this.ratingRange.length) {
            var newValue = this.hoveredPercent ? (value - 1) + this.hoveredPercent / 100 : value;
            this.onChange(newValue);
            this.model = newValue;
        }
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    Rating.prototype.buildRanges = function () {
        this.ratingRange = this.range(1, this.max);
    };
    Rating.prototype.range = function (start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    };
    Rating.decorators = [
        { type: core_1.Component, args: [{
                    selector: "rating",
                    template: "\n<span (mouseleave)=\"resetHovered()\"\n      class=\"rating\"\n      [class.disabled]=\"disabled\"\n      [class.readonly]=\"readonly\"\n      tabindex=\"0\"\n      role=\"slider\" \n      aria-valuemin=\"0\"\n      [attr.aria-valuemax]=\"ratingRange.length\" \n      [attr.aria-valuenow]=\"model\">\n    <span *ngFor=\"let item of ratingRange; let index = index\">\n        <i (mouseenter)=\"setHovered(item)\" \n           (mousemove)=\"changeHovered($event)\"\n           (click)=\"rate(item)\" \n           [attr.data-icon]=\"fullIcon\"\n           class=\"{{ iconClass }} half{{ calculateWidth(item) }}\"\n           [title]=\"titles[index] || item\">{{ emptyIcon }}</i>\n    </span>\n</span>\n",
                    providers: [
                        { provide: forms_1.NG_VALUE_ACCESSOR, useExisting: core_1.forwardRef(function () { return Rating; }), multi: true },
                        { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return Rating; }), multi: true },
                    ],
                    styles: ["\nspan.rating {\n    cursor: pointer;\n    outline: none;\n}\nspan.rating.readonly {\n    cursor: default;\n}\nspan.rating.disabled {\n    cursor: not-allowed;\n}\nspan.rating i{\n    font-style: normal; \n}\n.star-icon {\n    color: #ddd;\n    font-size: 2em;\n    position: relative;\n}\n.star-icon:before {\n    color: #FDE16D;\n    content: attr(data-icon) \" \";\n    position: absolute;\n    left: 0;\n    overflow: hidden;\n    width: 0;\n} \nspan.rating.disabled .star-icon:before {\n    color: #ECECEC;\n    text-shadow: none;\n}\n.star-icon.half10:before {\n    width: 10%;\n}\n.star-icon.half20:before {\n    width: 20%;\n}\n.star-icon.half30:before {\n    width: 30%;\n}\n.star-icon.half40:before {\n    width: 40%;\n}\n.star-icon.half50:before {\n    width: 50%;\n}\n.star-icon.half60:before {\n    width: 60%;\n}\n.star-icon.half70:before {\n    width: 70%;\n}\n.star-icon.half80:before {\n    width: 80%;\n}\n.star-icon.half90:before {\n    width: 90%;\n}\n.star-icon.half100:before {\n    width: 100%;\n}\n@-moz-document url-prefix() { /* Firefox Hack */\n  .star-icon {\n    font-size: 50px;\n    line-height: 34px;\n  }\n}\n"]
                },] },
    ];
    /** @nocollapse */
    Rating.ctorParameters = function () { return []; };
    Rating.propDecorators = {
        'iconClass': [{ type: core_1.Input },],
        'fullIcon': [{ type: core_1.Input },],
        'emptyIcon': [{ type: core_1.Input },],
        'readonly': [{ type: core_1.Input },],
        'disabled': [{ type: core_1.Input },],
        'required': [{ type: core_1.Input },],
        'float': [{ type: core_1.Input },],
        'titles': [{ type: core_1.Input },],
        'max': [{ type: core_1.Input },],
        'onHover': [{ type: core_1.Output },],
        'onLeave': [{ type: core_1.Output },],
        'onKeydown': [{ type: core_1.HostListener, args: ["keydown", ["$event"],] },],
    };
    return Rating;
}());
exports.Rating = Rating;
var RatingModule = (function () {
    function RatingModule() {
    }
    RatingModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        Rating,
                    ],
                    exports: [
                        Rating,
                    ],
                },] },
    ];
    /** @nocollapse */
    RatingModule.ctorParameters = function () { return []; };
    return RatingModule;
}());
exports.RatingModule = RatingModule;
//# sourceMappingURL=index.js.map