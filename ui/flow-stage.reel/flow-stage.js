/**
 * @module ui/flow-stage.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    Application = require("montage/core/application").application,

    PROPERTIES_NOT_REQUIRED = [
        'element',
        'flowEditorMetadata',
        'slotContent'
    ],

    TIME_BEFORE_REFRESHING = 350;

/**
 * @class FlowStage
 * @extends Component
 */
exports.FlowStage = Component.specialize(/** @lends FlowStage# */ {

    constructor: {
        value: function FlowStage() {
            this.super();
        }
    },

    _timeoutRefreshID: {
        value: null
    },

    _needRefresh: {
        value: null
    },

    needRefresh: {
        set: function (bool) {
            if (!!bool) {
                if (this._timeoutRefreshID) {
                    clearTimeout(this._timeoutRefreshID);
                    this._timeoutRefreshID = null;
                }

                var self = this;
                this._needRefresh = true;

                this._timeoutRefreshID = setTimeout(function () {
                    if (self._needRefresh) {
                        self.refreshStage();
                        self._needRefresh = false;
                    }

                }, TIME_BEFORE_REFRESHING);

            } else {
                if (this._timeoutRefreshID) {
                    clearTimeout(this._timeoutRefreshID);
                    this._timeoutRefreshID = null;
                }

                this._needRefresh = false;
            }
        },
        get: function () {
            return this._needRefresh;
        }
    },

    enterDocument: {
        value: function (firstime) {
            if (firstime) {
                Application.addEventListener("didSetOwnedObjectProperties", this);
            }
        }
    },

    exitDocument: {
        value: function () {
            Application.removeEventListener("didSetOwnedObjectProperties", this);
        }
    },

    editor: {
        value: null
    },

    paths: {
        value: null
    },

    handleDidSetOwnedObjectProperties: {
        value: function (event) {
            var detail = event.detail;

            if (detail && detail.proxy && /montage\/ui\/flow.reel/.test(detail.proxy.exportId)) {
                this.needRefresh = true;
            }
        }
    },

    refreshStage: {
        value: function () {
            if (this.editor && this.editor.object) {
                var flow = this.templateObjects.flow,
                    properties = this.editor.object.getObjectProperties();

                Object.keys(properties).forEach(function (key) {
                    if (PROPERTIES_NOT_REQUIRED.indexOf(key) < 0) {

                        flow[key] = properties[key];
                    }
                });

                flow.needsDraw = true;
            }
        }
    }

});
