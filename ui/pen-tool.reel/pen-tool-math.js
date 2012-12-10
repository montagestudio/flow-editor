var Montage = require("montage").Montage;

exports.Vector = Montage.create(Montage, {

    init: {
        value: function () {
            this._coordinates = [];
        }
    },

    initWithCoordinates: {
        value: function (coordinates) {

        }
    },

    _coordinates: {
        value: null
    }

});