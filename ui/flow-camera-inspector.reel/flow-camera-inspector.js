/**
    @module "ui/flow-camera-inspector.reel"
    @requires montage
    @requires montage/ui/component
*/
var Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/flow-camera-inspector.reel".FlowCameraInspector
    @extends module:montage/ui/component.Component
*/
exports.FlowCameraInspector = Component.specialize( /** @lends module:"ui/flow-camera-inspector.reel".FlowCameraInspector# */ {

    _camera: {
        value: null
    },

    camera: {
        get: function () {
            return this._camera;
        },
        set: function (value) {
            this._camera = value && value._data.type === "FlowCamera" ? value : null;
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
            if (this.camera && this.camera.children[0]) {
                var dX = value - this.camera.children[0]._data.x;
                this._x = value;

                if (dX) {
                    this.camera.translate([dX, 0, 0]);
                }
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
            if (this.camera && this.camera.children[0]) {
                var dY = value - this.camera.children[0]._data.y;
                this._y = value;

                if (dY) {
                    this.camera.translate([0, dY, 0]);
                }
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
            if (this.camera && this.camera.children[0]) {
                var dZ = value - this.camera.children[0]._data.z;
                this._z = value;

                if (dZ) {
                    this.camera.translate([0, 0, dZ]);
                }
            }
        }
    }

});
