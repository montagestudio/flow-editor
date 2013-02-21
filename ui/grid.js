var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape;

var Grid = exports.Grid = Montage.create(Montage, {

    gridlineEach: {
        value: 10
    },

    subdivisions: {
        value: 4
    },

    gridlineColor: {
        value: "#ccc"
    },

    subdivisionColor: {
        value: "rgba(0, 0, 0, .5)"
    }

});

exports.CanvasGrid = Montage.create(CanvasShape, {

    bindings: {
        value: [
            "gridlineEach",
            "subdivisions",
            "gridlineColor",
            "subdivisionColor"
        ]
    },

    _gridlineEach: {
        value: null
    },

    gridlineEach: {
        get: function () {
            return this._gridlineEach;
        },
        set: function (value) {
            this._gridlineEach = value;
            this.needsDraw = true;
        }
    },

    _subdivisions: {
        value: null
    },

    subdivisions: {
        get: function () {
            return this._subdivisions;
        },
        set: function (value) {
            this._subdivisions = value;
            this.needsDraw = true;
        }
    },

    _gridlineColor: {
        value: null
    },

    gridlineColor: {
        get: function () {
            return this._gridlineColor;
        },
        set: function (value) {
            this._gridlineColor = value;
            this.needsDraw = true;
        }
    },

    _subdivisionColor: {
        value: null
    },

    subdivisionColor: {
        get: function () {
            return this._subdivisionColor;
        },
        set: function (value) {
            this._subdivisionColor = value;
            this.needsDraw = true;
        }
    },

    draw: {
        value: function (transformMatrix) {
            var offsetX = transformMatrix[12],
                offsetY = transformMatrix[13],
                x,
                xStart,
                sEnd,
                y,
                yStart,
                yEnd,
                scale = .2,
                indices = [0, 1, 2, 4, 5, 6, 8, 9, 10],
                i = 0;

            while (!transformMatrix[indices[i]]) {
                i++;
            }
            scale = transformMatrix[indices[i]];
            this._context.save();
            if (scale >= .02) {
                this._context.fillStyle = this.gridlineColor;
                xStart = ((-offsetX / (scale * 5)) >> 1) * 100;
                xEnd = (((500 - offsetX) / (scale * 5)) >> 1) * 100;
                for (x = xStart; x <= xEnd; x += 100) {
                    this._context.fillRect(Math.floor(offsetX + x * scale), 0, 1, 9999);
                }
                yStart = ((-offsetY / (scale * 5)) >> 1) * 100;
                yEnd = (((500 - offsetY) / (scale * 5)) >> 1) * 100;
                for (y = yStart; y <= yEnd; y += 100) {
                    this._context.fillRect(0, Math.floor(offsetY + y * scale), 9999, 1);
                }
            }
            /*this._canvasContext.fillStyle = "#2e2e2e";
            this._canvasContext.fillRect(0, Math.floor(offsetY), this._width, 1);
            this._canvasContext.fillRect(Math.floor(offsetX), 0, 1,  this._height);*/
            this._context.restore();
        }
    }

});