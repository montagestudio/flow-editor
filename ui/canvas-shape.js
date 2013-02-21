var Montage = require("montage").Montage;

exports.CanvasShape = Montage.create(Montage, {

    children: {
        value: []
    },

    bindings: {
        value: null
    },

    zIndex: {
        value: 0
    },

    _data: {
        value: null
    },

    data: {
        get: function () {
            return this._data;
        },
        set: function (value) {
            var i;

            this._data = value;
            if (this.bindings) {
                for (i = 0; i < this.bindings.length; i++) {
                    Object.defineBinding(this, this.bindings[i], {
                        boundObject: this._data,
                        boundObjectPropertyPath: this.bindings[i]
                    });
                }
            }
        }
    },

    initWithData: {
        value: function (data) {
            this.data = data;
            return this;
        }
    },

    _canvas: {
        value: null
    },

    _context: {
        value: null
    },

    canvas: {
        get: function () {
            return this._canvas;
        },
        set: function (value) {
            this._canvas = value;
            this._context = value.getContext("2d");
        }
    },

    draw: {
        value: function (transformMatrix) {
        }
    },

    pointOnShape: {
        value: function (x, y, transformMatrix) {
            return false;
        }
    },

    _color: {
        value: "black"
    },

    color: {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            this.needsDraw = true;
        }
    },

    _selectedColor: {
        value: "#0d8"
    },

    selectedColor: {
        get: function () {
            return this._selectedColor;
        },
        set: function (value) {
            this._selectedColor = value;
            this.needsDraw = true;
        }
    },

    _isSelected: {
        value: false
    },

    isSeleted: {
        get: function () {
            return this._isSelected;
        },
        set: function (value) {
            this._isSelected = value;
            this.needsDraw = true;
        }
    }

});