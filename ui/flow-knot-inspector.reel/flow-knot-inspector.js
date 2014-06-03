/**
    @module "ui/flow-knot-inspector.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/flow-knot-inspector.reel".FlowKnotInspector
    @extends module:montage/ui/component.Component
*/
exports.FlowKnotInspector = Montage.create(Component, /** @lends module:"ui/flow-knot-inspector.reel".FlowKnotInspector# */ {

    type: {
        value: null
    },

    _knot: {
        value: null
    },

    knot: {
        get: function () {
            return this._knot;
        },
        set: function (value) {
            if (value && (value._data.type === "FlowKnot")) {
                this._knot = value;
            } else {
                this._knot = null;
            }
        }
    },

    _x: {
        value: null
    },

    x: {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (!this.knot) {
                return 0;
            }

            var dX = value - this.knot._data.x;

            this._x = value;
            if (this.knot && dX) {
                this.knot.translate([dX, 0, 0]);
            }
        }
    },

    _y: {
        value: null
    },

    y: {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (!this.knot) {
                return 0;
            }

            var dY = value - this.knot._data.y;

            this._y = value;
            if (this.knot && dY) {
                this.knot.translate([0, dY, 0]);
            }
        }
    },

    _z: {
        value: null
    },

    z: {
        get: function () {
            return this._z;
        },
        set: function (value) {
            if (!this.knot) {
                return 0;
            }

            var dZ = value - this.knot._data.z;

            this._z = value;
            if (this.knot && dZ) {
                this.knot.translate([0, 0, dZ]);
            }
        }
    },

    rotateX: {
        value: null
    },

    rotateY: {
        value: null
    },

    rotateZ: {
        value: null
    },

    opacity: {
        value: null
    },

    density: {
        value: null
    }

});
