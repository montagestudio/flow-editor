var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    ViewPortConfig = require("core/configuration").FlowEditorConfig.viewPort,
    PenTools = require("ui/pen-tools");

/**
    Description TODO
    @class module:"ui/toolbar.reel".Toolbar
    @extends module:montage/ui/component.Component
*/
exports.Toolbar = Montage.create(Component, /** @lends module:"ui/toolbar.reel".Toolbar# */ {

    selectedTool: {
        value: null
    },

    _tools: {
        value: null
    },

    handleClick: {
        enumerable: false,
        value: function (event) {
            if (event.target.getAttribute("data-tool")) {
                if (event.target !== this._element) {
                    var elements = this.element.getElementsByTagName("*"),
                        i;

                    for (i = 0; i < elements.length; i++) {
                        elements[i].classList.remove("flow-Editor-Toolbar-Button--selected");
                    }

                    event.target.classList.add("flow-Editor-Toolbar-Button--selected");
                    this.selectedTool = this._tools[event.target.getAttribute("data-tool")];
                }

                event.preventDefault();
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this._tools = {
                    "arrow": PenTools.ArrowTool.create(),
                    "convert": PenTools.ConvertTool.create(),
                    "pen": PenTools.PenTool.create(),
                    "add": PenTools.AddTool.create(),
                    "helix": PenTools.HelixTool.create()
                };

                this.selectedTool = this._tools.convert;
            }
        }
    },

    prepareForActivationEvents: {
        enumerable: false,
        value: function () {
            this._element.addEventListener("click", this, false);
        }
    },

    handleCloseButtonAction: {
        value: function (evt) {
            evt.stop();
            this.dispatchEventNamed("exitModalEditor", true, true);
        }
    },

    isInspectorVisible: {
        value: false
    },

    handleInspectorButtonAction: {
        value: function () {
            this.isInspectorVisible = !this.isInspectorVisible;
        }
    },

    isTreeVisible: {
        value: false
    },

    handleTreeButtonAction: {
        value: function () {
            this.isTreeVisible = !this.isTreeVisible;
        }
    },

    handleZoomExtendsAction: {
        value: function () {
            var boundaries = this.viewport.scene.getRecursiveAxisAlignedBoundaries(),
                scaleX = this.viewport._width / (boundaries[0].max - boundaries[0].min),
                scaleY = this.viewport._height / (boundaries[1].max - boundaries[1].min),
                scaleZ = this.viewport._height / (boundaries[2].max - boundaries[2].min),
                scale = Math.min(scaleX, scaleY, scaleZ) * 0.8,
                center = {
                    x: (boundaries[0].max + boundaries[0].min) / 2,
                    y: (boundaries[1].max + boundaries[1].min) / 2,
                    z: (boundaries[2].max + boundaries[2].min) / 2
                };

            this.viewport.scale = scale;
            this.viewport2.scale = scale;

            this._updateViewPortAfterZoom(this.viewport, scale, center);
            this._updateViewPortAfterZoom(this.viewport2, scale, center);
        }
    },

    _updateViewPortAfterZoom: {
        value: function (viewport, scale, center) {
           switch (viewport.type) {

               case ViewPortConfig.types.front:
                   viewport.translateX = (viewport._width / 2) - (center.x * scale);
                   viewport.translateY = (viewport._height / 2) - (center.y * scale);
                   break;

               case ViewPortConfig.types.top:
                   viewport.translateX = (viewport._width / 2) - (center.x * scale);
                   viewport.translateY = (viewport._height / 2) - (center.z * scale);
                   break;

               case ViewPortConfig.types.profile:
                   viewport.translateX = (viewport._width / 2) - (center.z * scale);
                   viewport.translateY = (viewport._height / 2) - (center.y * scale);
                   break;
           }
        }
    }

});
