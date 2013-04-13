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
        value: "rgba(0, 0, 0, .07)"
    },

    subdivisionColor: {
        value: "rgba(0, 0, 0, .3)"
    },

    type: {
        value: "FlowGrid"
    }

});

exports.CanvasGrid = Montage.create(CanvasShape, {

    didCreate: {
        value: function () {
            CanvasShape.didCreate.call(this);
            this.defineBindings({
                "gridlineEach": {
                    "<->": "data.gridlineEach",
                    source: this
                },
                "subdivisions": {
                    "<->": "data.subdivisions",
                    source: this
                },
                "gridlineColor": {
                    "<->": "data.gridlineColor",
                    source: this
                },
                "subdivisionColor": {
                    "<->": "data.subdivisionColor",
                    source: this
                }
            });
        }
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

    drawSelf: {
        value: function (transformMatrix) {
            var offsetX = transformMatrix[12],
                offsetY = transformMatrix[13],
                x,
                xStart,
                sEnd,
                y,
                yStart,
                yEnd,
                indices = [0, 1, 2, 4, 5, 6, 8, 9, 10],
                width = this._width ? this._width : 500,
                height = this._height ? this._height: 500,
                step = 100,
                i = 0;

            while (!transformMatrix[indices[i]]) {
                i++;
            }
            scale = transformMatrix[indices[i]];
            this._context.save();
            if (scale >= .02) {
                this._context.fillStyle = this.gridlineColor;
                xStart = -Math.floor(offsetX / (step * scale));
                xEnd = xStart + Math.floor(width / (step * scale));
                for (x = xStart; x <= xEnd; x++) {
                    this._context.fillRect(Math.floor(offsetX + x * step * scale), 0, 1, 9999);
                }
                yStart = -Math.floor(offsetY / (step * scale));
                yEnd = yStart + Math.floor(width / (step * scale));
                for (y = yStart; y <= yEnd; y++) {
                    this._context.fillRect(0, Math.floor(offsetY + y * step * scale), 9999, 1);
                }
            }
            this._context.fillStyle = "rgba(0,0,0,.1)";
            this._context.fillRect(0, Math.floor(offsetY), 9999, 1);
            this._context.fillRect(Math.floor(offsetX), 0, 1,  9999);
            this._context.restore();
        }
    }

});