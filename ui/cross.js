var Montage = require("montage").Montage,
    Vector3 = require("ui/pen-tool-math.js").Vector3;

var Cross = exports.Cross = Montage.create(Montage, {

    xColor: {
        value: "red"
    },

    yColor: {
        value: "green"
    },

    zColor: {
        value: "blue"
    }

});

exports.CanvasCross = Montage.create(Montage, {

    _data: {
        value: null
    },

    data: {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            Object.defineBinding(this, "xColor", {
                boundObject: this._data,
                boundObjectPropertyPath: "xColor"
            });
            Object.defineBinding(this, "yColor", {
                boundObject: this._data,
                boundObjectPropertyPath: "yColor"
            });
            Object.defineBinding(this, "zColor", {
                boundObject: this._data,
                boundObjectPropertyPath: "zColor"
            });
            this.needsDraw = true;
        }
    },

    _xColor: {
        value: null
    },

    xColor: {
        get: function () {
            return this._xColor;
        },
        set: function (value) {
            this._xColor = value;
            this.needsDraw = true;
        }
    },

    _yColor: {
        value: null
    },

    yColor: {
        get: function () {
            return this._yColor;
        },
        set: function (value) {
            this._yColor = value;
            this.needsDraw = true;
        }
    },

    _zColor: {
        value: null
    },

    zColor: {
        get: function () {
            return this._zColor;
        },
        set: function (value) {
            this._zColor = value;
            this.needsDraw = true;
        }
    },

    _canvasContext: {
        value: null
    },

    canvasContext: {
        get: function () {
            return this._canvasContext;
        },
        set: function (value) {
            this._canvasContext = value;
            this.needsDraw = true;
        }
    },

    draw: {
        value: function (transformMatrix) {
            var vector = Vector3.create(),
                matrix = transformMatrix.clone();

            matrix[12] = matrix[13] = matrix[14] = 0;
            this._canvasContext.save();
            this._canvasContext.font = "8px Arial";

            vector.initWithCoordinates([1, 0, 0]).transformMatrix3d(matrix).normalize().multiply(20);
            this._canvasContext.beginPath();
            this._canvasContext.strokeStyle =
            this._canvasContext.fillStyle = this.xColor;
            this._canvasContext.moveTo(26 + vector.x * .2, 26 + vector.y * .2);
            this._canvasContext.lineTo(26 + vector.x * .8, 26 + vector.y * .8);
            this._canvasContext.stroke();
            this._canvasContext.fillText("X", 23 + vector.x, 29 + vector.y);

            vector.initWithCoordinates([0, 1, 0]).transformMatrix3d(matrix).normalize().multiply(20);
            this._canvasContext.beginPath();
            this._canvasContext.strokeStyle =
            this._canvasContext.fillStyle = this.yColor;
            this._canvasContext.moveTo(26 + vector.x * .2, 26 + vector.y * .2);
            this._canvasContext.lineTo(26 + vector.x * .8, 26 + vector.y * .8);
            this._canvasContext.stroke();
            this._canvasContext.fillText("Y", 23 + vector.x, 29 + vector.y);

            vector.initWithCoordinates([0, 0, 1]).transformMatrix3d(matrix).normalize().multiply(20);
            this._canvasContext.beginPath();
            this._canvasContext.strokeStyle =
            this._canvasContext.fillStyle = this.zColor;
            this._canvasContext.moveTo(26 + vector.x * .2, 26 + vector.y * .2);
            this._canvasContext.lineTo(26 + vector.x * .8, 26 + vector.y * .8);
            this._canvasContext.stroke();
            this._canvasContext.fillText("Z", 23 + vector.x, 29 + vector.y);
            this._canvasContext.restore();
        }
    }

});