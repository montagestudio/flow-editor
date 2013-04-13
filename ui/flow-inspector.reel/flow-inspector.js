/**
    @module "ui/flow-inspector.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    Vector3 = require("ui/pen-tool-math").Vector3,
    inspectors = {
        FlowKnot: require("ui/flow-knot-inspector.reel").FlowKnotInspector
    };

/**
    Description TODO
    @class module:"ui/flow-inspector.reel".FlowInspector
    @extends module:montage/ui/component.Component
*/
exports.FlowInspector = Montage.create(Component, /** @lends module:"ui/flow-inspector.reel".FlowInspector# */ {

    titleText: {
        value: ""
    },

    _selection: {
        value: null
    },

    _showing: {
        value: null
    },

    selection: {
        get: function () {
            return this._selection;
        },
        set: function (value) {
            this._selection = value;
            if (value && value._data) {
                switch (value._data.type) {
                    case "FlowKnot":
                        this.titleText = "Knot";
                        break;
                    case "FlowSpline":
                        this.titleText = "Spline";
                        break;
                    case "FlowCamera":
                        this.titleText = "Camera";
                        break;
                    case "FlowHandler":
                        this.titleText = "Handler";
                        break;
                    default:
                        this.titleText = value._data.type;
                        break;
                }
            }
        }
    },

    handleCloseAction: {
        value: function () {
            this._visible = false;
            this.needsDraw = true;
        }
    },

    _visible: {
        value: false
    },

    visible: {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
            this.needsDraw = true;
        }
    },

    _pointerX: {
        value: null
    },

    _pointerY: {
        value: null
    },

    _windowPositionX: {
        value: 510
    },

    _windowPositionY: {
        value: 10
    },

    handleMousemove: {
        value: function (event) {
            this._windowPositionX = this._startX + event.pageX - this._pointerX;
            this._windowPositionY = this._startY + event.pageY - this._pointerY;
            this.needsDraw = true;
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
            document.body.style.pointerEvents = "auto";
        }
    },

    handleMousedown: {
        value: function (event) {
            this._startX = this._windowPositionX;
            this._startY = this._windowPositionY;
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
            document.body.style.pointerEvents = "none";
            event.preventDefault();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.title.addEventListener("mousedown", this, false);
                window.addEventListener("resize", this, false);
            }
        }
    },

    handleResize: {
        value: function () {
            this.needsDraw = true;
        }
    },

    willDraw: {
        value: function () {
            this._width = this.element.offsetWidth;
            this._height = this.element.offsetHeight;
            this._bodyWidth = window.innerWidth;
            this._bodyHeight = window.innerHeight;
        }
    },

    draw: {
        value: function () {
            //this.element.style.display = this._visible ? "block" : "none";
            if (this._windowPositionX > this._bodyWidth - this._width) {
                this._windowPositionX = this._bodyWidth - this._width;
            }
            if (this._windowPositionX < 0) {
                this._windowPositionX = 0;
            }
            if (this._windowPositionY > this._bodyHeight - this._height) {
                this._windowPositionY = this._bodyHeight - this._height;
            }
            if (this._windowPositionY < 0) {
                this._windowPositionY = 0;
            }
            this.element.style.left = this._windowPositionX + "px";
            this.element.style.top = this._windowPositionY + "px";
        }
    }

});
