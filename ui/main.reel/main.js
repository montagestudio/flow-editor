/**
    @module "ui/main.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/main.reel".Main
    @extends module:montage/ui/component.Component
*/
exports.Main = Montage.create(Component, /** @lends module:"ui/main.reel".Main# */ {
    templateDidLoad: {
        value: function () {
            var self = this;

            this.editor.object = {
                _stageObject: this.flow,
                stageObject: this.flow,
                getObjectProperty: function (property) {
                    return self.flow[property];
                },
                setObjectProperty: function (property, value) {
                    self.flow[property] = value;
                },
            };
        }
    }
});
