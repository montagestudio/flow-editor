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

    labelText: {
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
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY;

            this._windowPositionX += dX;
            this._windowPositionY += dY;
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
            this.needsDraw = true;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
        }
    },

    handleMousedown: {
        value: function (event) {
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
            event.preventDefault();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.title.addEventListener("mousedown", this, false);
            }
        }
    },

    draw: {
        value: function () {
            //this.element.style.display = this._visible ? "block" : "none";
            this.element.style.left = this._windowPositionX + "px";
            this.element.style.top = this._windowPositionY + "px";
        }
    }

});
