var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape,
    Vector3 = require("ui/pen-tool-math").Vector3,
    CanvasVector3 = require("ui/canvas-vector3").CanvasVector3;

exports.FlowKnot = Montage.create(Vector3, {

    type: {
        value: "FlowKnot"
    },

    rotateX: {
        value: 0
    },

    rotateY: {
        value: 0
    },

    rotateZ: {
        value: 0
    },

    opacity: {
        value: 1
    }

});

exports.CanvasFlowSplineHandlers = Montage.create(CanvasShape, {


    _almostEqual: {
        value: function (floatA, floatB) {
            var max, min,
                relativeDifference;

            if (Math.abs(floatA) > Math.abs(floatB)) {
                max = floatA;
                min = floatB;
            } else {
                max = floatB;
                min = floatA;
            }
            relativeDifference = max / min;
            if (isNaN(relativeDifference)) {
                return true;
            }
            if (relativeDifference < 0) {
                return false;
            } else {
                relativeDifference -= 1;
                return (relativeDifference < .00001);
            }
        }
    },

    /*
        Types: corner, smooth, symmetric
    */

    _type: {
        value: null
    },

    type: {
        get: function () {
            if (!this._type) {
                if (this._previousHandler && this._nextHandler) {
                    var expectedX = this.data.x * 2 - this._previousHandler.x,
                        expectedY = this.data.y * 2 - this._previousHandler.y,
                        expectedZ = this.data.z * 2 - this._previousHandler.z;

                    if (this._almostEqual(this._nextHandler.x, expectedX) &&
                        this._almostEqual(this._nextHandler.y, expectedY) &&
                        this._almostEqual(this._nextHandler.z, expectedZ)) {
                        this._type = "symmetric";
                    } else {
                        this._type = "corner";
                    }
                } else {
                    this._type = "symmetric";
                }
            }
            return this._type;
        },
        set: function (value) {
            this._type = value;
            switch (value) {
                case "symmetric":
                    if (this._previousHandler && this._nextHandler) {
                        this._nextHandler._data = [
                            this.data.x * 2 - this._previousHandler.x,
                            this.data.y * 2 - this._previousHandler.y,
                            this.data.z * 2 - this._previousHandler.z
                        ];
                    }
                break;
                case "smooth":
                break;
            }
        }
    },

    _previousHandler: {
        value: null
    },

    _nextHandler: {
        value: null
    },

    previousHandler: {
        get: function () {
            return this._previousHandler;
        },
        set: function (value) {
            this._previousHandler = value;
        }
    },

    nextHandler: {
        get: function () {
            return this._nextHandler;
        },
        set: function (value) {
            this._nextHandler = value;
        }
    },

    translate: {
        value: function (vector) {
            this.data.translate(vector);
            if (this.nextHandler) {
                this.nextHandler.translate(vector);
            }
            if (this.previousHandler) {
                this.previousHandler.translate(vector);
            }
        }
    },

    translatePreviousHandler: {
        value: function (vector) {
            this._previousHandler.translate(vector);
            if ((this.type === "symmetric") && this._nextHandler) {
                this._nextHandler._data = [
                    this.data.x * 2 - this._previousHandler.x,
                    this.data.y * 2 - this._previousHandler.y,
                    this.data.z * 2 - this._previousHandler.z
                ];
            }
        }
    },

    translateNextHandler: {
        value: function (vector) {
            this._nextHandler.translate(vector);
            if ((this.type === "symmetric") && this._previousHandler) {
                this._previousHandler._data = [
                    this.data.x * 2 - this._nextHandler.x,
                    this.data.y * 2 - this._nextHandler.y,
                    this.data.z * 2 - this._nextHandler.z
                ];
            }
        }
    },

    children: {
        get: function () {
            var self = this,
                bezier = this._data,
                children = [];

            if (this.isSelected) {
                if (!this._children) {
                    if (this.previousHandler) {
                        vector = CanvasVector3.create().initWithData(this.previousHandler);
                        vector.canvas = self.canvas;
                        vector.color = self._selectedColor;
                        vector.translate = function (vector) {
                            self.translatePreviousHandler(vector);
                        };
                        children.push(vector);
                    }
                    if (this.nextHandler) {
                        vector = CanvasVector3.create().initWithData(this.nextHandler);
                        vector.canvas = self.canvas;
                        vector.color = self._selectedColor;
                        vector.translate = function (vector) {
                            self.translateNextHandler(vector);
                        };
                        children.push(vector);
                    }
                    this._children = children;
                } else {
                    children = this._children;
                }
            }
            return children;
        }
    },

    drawSelf: {
        value: function (transformMatrix) {
            var s;

            this._context.save();
            if (this.isSelected) {
                this._context.strokeStyle = this._selectedColor;
                this._context.lineWidth = 1.5;
                this._context.beginPath();
                if (this.data && this.previousHandler) {
                    s = this._data.clone().transformMatrix3d(transformMatrix);
                    this._context.moveTo(s.x, s.y);
                    s = this._previousHandler.clone().transformMatrix3d(transformMatrix);
                    this._context.lineTo(s.x, s.y);
                    this._context.stroke();
                }
                if (this.data && this.nextHandler) {
                    s = this._data.clone().transformMatrix3d(transformMatrix);
                    this._context.moveTo(s.x, s.y);
                    s = this._nextHandler.clone().transformMatrix3d(transformMatrix);
                    this._context.lineTo(s.x, s.y);
                    this._context.stroke();
                }
            }
            s = this._data.clone().transformMatrix3d(transformMatrix);
            this._context.fillStyle = this.color;
            switch (this.type) {
                case "corner":
                    this._context.fillRect(s.x - 3, s.y - 3, 7, 7);
                    if (!this.isSelected) {
                        this._context.fillStyle = "white";
                        this._context.fillRect(s.x - 2, s.y - 2, 5, 5);
                    }
                    break;
                case "symmetric":
                    this._context.beginPath();
                    this._context.arc(s.x + .5, s.y + .5, 4, 0 , 2 * Math.PI, false);
                    this._context.fill();
                    if (!this.isSelected) {
                        this._context.beginPath();
                        this._context.fillStyle = "white";
                        this._context.arc(s.x + .5, s.y + .5, 3, 0 , 2 * Math.PI, false);
                        this._context.fill();
                    }
                    break;
            }
            this._context.restore();
        }
    },

    pointOnShape: {
        value: function (x, y, transformMatrix) {
            var vector = this.data.clone().transformMatrix3d(transformMatrix);

            if ((x >= vector.x - 3) && (x <= vector.x + 5)) {
                if ((y >= vector.y - 3) && (y <= vector.y + 5)) {
                    return true;
                }
            }
            return false;
        }
    }

});