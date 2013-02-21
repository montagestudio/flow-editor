var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape;

exports.CanvasVector3 = Montage.create(CanvasShape, {

    _color: {
        value: null
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

    draw: {
        value: function (transformMatrix) {
            var vector = this._data.clone().transformMatrix3d(transformMatrix);

            this._context.save();
            this._context.fillStyle = this.color;
            this._context.fillRect(vector.x - 2, vector.y - 2, 5, 5);
            this._context.restore();
        }
    }

});