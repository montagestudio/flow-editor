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

    _type: {
        value: null
    },

    type: {
        get: function () {
            return this._type;
        },
        set: function (value) {
            if (value) {
                this._type = value;
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
        }
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
            this._x = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
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
            this._y = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
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
            this._z = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
        }
    },

    _rotateX: {
        value: null
    },

    rotateX: {
        get: function () {
            return this._rotateX;
        },
        set: function (value) {
            this._rotateX = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
        }
    },

    _rotateY: {
        value: null
    },

    rotateY: {
        get: function () {
            return this._rotateY;
        },
        set: function (value) {
            this._rotateY = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
        }
    },

    _rotateZ: {
        value: null
    },

    rotateZ: {
        get: function () {
            return this._rotateZ;
        },
        set: function (value) {
            this._rotateZ = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
        }
    },

    _opacity: {
        value: null
    },

    opacity: {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            this._opacity = value;
            if (this.scene) {
                this.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
        }
    }

});
