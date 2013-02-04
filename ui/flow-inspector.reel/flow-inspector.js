/**
    @module "ui/flow-inspector.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/flow-inspector.reel".FlowInspector
    @extends module:montage/ui/component.Component
*/
exports.FlowInspector = Montage.create(Component, /** @lends module:"ui/flow-inspector.reel".FlowInspector# */ {

    labelText: {
        value: ""
    },

    x: {
        value: ""
    },

    y: {
        value: ""
    },

    z: {
        value: ""
    },

    _scene: {
        value: null
    },

    scene: {
        get: function () {
            return this._scene;
        },
        set: function (value) {
            if (this._scene) {
                this._scene.removeEventListener("sceneUpdated", this, false);
            }
            this._scene = value;
            if (this._scene) {
                this._scene.addEventListener("sceneUpdated", this, false);
            }
            this.needsDraw = true;
        }
    },

    handleSceneUpdated: {
        value: function () {
            this.showPosition();
        }
    },

    _selection: {
        value: null
    },

    selection: {
        get: function () {
            return this._selection;
        },
        set: function (value) {
            this._selection = value;
            if (this.scene && value[0]) {
                var length = this.scene.length,
                    i = 0;

                while (i < length && this.scene._data[i] !== value[0]) {
                    i++;
                }
                this.labelText = "Path " + i;
            } else {
                this.labelText = "";
            }
            this.showPosition();
        }
    },

    showPosition: {
        value: function () {
            if (this._selection && this._selection[0]) {
                var bb = this._selection[0].axisAlignedBoundaries;
                this.x = (bb[0].min * 10 | 0) / 10;
                this.y = (bb[1].min * 10 | 0) / 10;
                this.z = (bb[2].min * 10 | 0) / 10;
            } else {
                this.x = "";
                this.y = "";
                this.z = "";
            }
        }
    }

});
