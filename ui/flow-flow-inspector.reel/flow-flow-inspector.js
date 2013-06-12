/**
    @module "ui/flow-flow-inspector.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/flow-flow-inspector.reel".FlowFlowInspector
    @extends module:montage/ui/component.Component
*/
exports.FlowFlowInspector = Montage.create(Component, /** @lends module:"ui/flow-flow-inspector.reel".FlowFlowInspector# */ {

    _isSelectionEnabled: {
        value: null
    },

    isSelectionEnabled: {
        get: function () {
            return this._isSelectionEnabled;
        },
        set: function (value) {
            this.editor.sceneWillChange();
            this._isSelectionEnabled = value;
            this.editor.sceneDidChange();
        }
    },

    _hasSelectedIndexScrolling: {
        value: null
    },

    hasSelectedIndexScrolling: {
        get: function () {
            return this._hasSelectedIndexScrolling;
        },
        set: function (value) {
            this.editor.sceneWillChange();
            this._hasSelectedIndexScrolling = value;
            this.editor.sceneDidChange();
        }
    },

    _scrollingTransitionTimingFunction: {
        value: null
    },

    scrollingTransitionTimingFunction: {
        get: function () {
            return this._scrollingTransitionTimingFunction;
        },
        set: function (value) {
            this.editor.sceneWillChange();
            this._scrollingTransitionTimingFunction = value;
            this.editor.sceneDidChange();
        }
    },

    _flow: {
        value: null
    },

    flow: {
        get: function () {
            return this._flow;
        },
        set: function (value) {
            if (value && (value._data.type === "FlowGrid")) {
                this._flow = value;
            } else {
                this._flow = null;
            }
        }
    }

});
