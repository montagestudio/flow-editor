var Montage = require("montage").Montage;

exports.Vector = Montage.create(Montage, {

    init: {
        value: function () {
            this._coordinates = [];
            return this;
        }
    },

    initWithCoordinates: {
        value: function (coordinates) {
            return this;
        }
    },

    _coordinates: {
        value: null
    }

});