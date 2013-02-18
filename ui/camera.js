var Montage = require("montage").Montage,
    Vector3 = require("ui/pen-tool-math.js").Vector3;

var Camera = exports.Camera = Montage.create(Montage, {

    cameraPosition: {
        value: [0, 0, 800]
    },

    cameraTargetPoint: {
        value: [0, 0, 0]
    },

    cameraFov: {
        value: 50
    },

    color: {
        value: "black"
    }

});

exports.CanvasCamera = Montage.create(Montage, {

    _data: {
        value: null
    },

    data: {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            Object.defineBinding(this, "cameraPosition", {
                boundObject: this._data,
                boundObjectPropertyPath: "cameraPosition"
            });
            Object.defineBinding(this, "cameraTargetPoint", {
                boundObject: this._data,
                boundObjectPropertyPath: "cameraTargetPoint"
            });
            Object.defineBinding(this, "cameraFov", {
                boundObject: this._data,
                boundObjectPropertyPath: "cameraFov"
            });
            Object.defineBinding(this, "color", {
                boundObject: this._data,
                boundObjectPropertyPath: "color"
            });
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

    _cameraPosition: {
        value: null
    },

    cameraPosition: {
        get: function () {
            return this._cameraPosition;
        },
        set: function (value) {
            this._cameraPosition = value;
            this.needsDraw = true;
        }
    },

    _cameraTargetPoint: {
        value: null
    },

    cameraTargetPoint: {
        get: function () {
            return this._cameraTargetPoint;
        },
        set: function (value) {
            this._cameraTargetPoint = value;
            this.needsDraw = true;
        }
    },

    _cameraFov: {
        value: null
    },

    cameraFov: {
        get: function () {
            return this._cameraFov;
        },
        set: function (value) {
            this._cameraFov = value;
            this.needsDraw = true;
        }
    },

    rotateVector: {
        value: function(vector) {
            var vX = this.cameraTargetPoint[0] - this.cameraPosition[0],
                vY = this.cameraTargetPoint[1] - this.cameraPosition[1],
                vZ = this.cameraTargetPoint[2] - this.cameraPosition[2],
                yAngle = Math.atan2(vX, vZ),
                tmpZ,
                rX, rY, rZ,
                xAngle;

            tmpZ = vX * -Math.sin(-yAngle) + vZ * Math.cos(-yAngle);
            xAngle = Math.atan2(vY, tmpZ);
            rX = vector[0];
            rY = vector[1] * Math.cos(-xAngle) - vector[2] * Math.sin(-xAngle);
            rZ = vector[1] * Math.sin(-xAngle) + vector[2] * Math.cos(-xAngle);
            return [
                rX * Math.cos(yAngle) + rZ * Math.sin(yAngle),
                rY,
                rX * -Math.sin(yAngle) + rZ * Math.cos(yAngle)
            ];
        }
    },

    draw: {
        value: function (transformMatrix) {
            if (this.cameraPosition) {
                console.log(this.cameraPosition);
                var tPos = Vector3.create().initWithCoordinates(this.cameraPosition).transformMatrix3d(transformMatrix),
                    tFocus = Vector3.create().initWithCoordinates(this.cameraTargetPoint).transformMatrix3d(transformMatrix),
                    angle = ((this.cameraFov * .5) * Math.PI * 2) / 360,
                    x, y, z,
                    line = [],
                    tmp,
                    scale = .2,
                    indices = [0, 1, 2, 4, 5, 6, 8, 9, 10],
                    i = 0;

                while (!transformMatrix[indices[i]]) {
                    i++;
                }
                scale = transformMatrix[indices[i]];
                x = Math.sin(angle) * 60 / scale;
                y = Math.cos(angle) * 60 / scale;
                z = y;
                for (i = 0; i < 4; i++) {
                    tmp = this.rotateVector([[x, -x, z], [-x, -x, z], [-x, x, z], [x, x, z]][i]);
                    line[i] = [this.cameraPosition[0] + tmp[0], this.cameraPosition[1] + tmp[1], this.cameraPosition[2] + tmp[2]];
                    line[i + 4] = [this.cameraPosition[0] + tmp[0] * 100000, this.cameraPosition[1] + tmp[1] * 100000, this.cameraPosition[2] + tmp[2] * 100000];
                }
                this._canvasContext.save();
                this._canvasContext.strokeStyle = this.color;
                this._canvasContext.fillStyle = this.color;
                this._canvasContext.fillRect((tPos.x >> 0) - 3, (tPos.y >> 0) - 3, 7, 7);
                this._canvasContext.fillRect((tFocus.x >> 0) - 2, (tFocus.y >> 0) - 2, 5, 5);
                this._canvasContext.beginPath();
                this._canvasContext.lineWidth = .5;
                for (i = 0; i < 8; i++) {
                    line[i] = Vector3.create().initWithCoordinates(line[i]).transformMatrix3d(transformMatrix);
                    this._canvasContext.moveTo(tPos.x + .5, tPos.y + .5);
                    this._canvasContext.lineTo(line[i].x + .5, line[i].y + .5);
                }
                this._canvasContext.stroke();

                this._canvasContext.beginPath();
                this._canvasContext.lineWidth = 1;
                this._canvasContext.moveTo(tPos.x + .5, tPos.y + .5);
                this._canvasContext.lineTo(tFocus.x + .5, tFocus.y + .5);
                for (i = 0; i < 4; i++) {
                    this._canvasContext.moveTo(tPos.x + .5, tPos.y + .5);
                    this._canvasContext.lineTo(line[i].x + .5, line[i].y + .5);
                    this._canvasContext.lineTo(line[(i + 1) % 4].x + .5, line[(i + 1) % 4].y + .5);
                }
                this._canvasContext.stroke();
                this._canvasContext.restore();
            }
        }
    }

    /*draw: {
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
            this._canvasContext.save();
            this._canvasContext.fillRect(0, 0, 100, 100);
            /*if (scale >= .02) {
                this._canvasContext.fillStyle = this.gridlineColor;
                xStart = ((-offsetX / (scale * 5)) >> 1) * 100;
                xEnd = (((500 - offsetX) / (scale * 5)) >> 1) * 100;
                for (x = xStart; x <= xEnd; x += 100) {
                    this._canvasContext.fillRect(Math.floor(offsetX + x * scale), 0, 1, 9999);
                }
                yStart = ((-offsetY / (scale * 5)) >> 1) * 100;
                yEnd = (((500 - offsetY) / (scale * 5)) >> 1) * 100;
                for (y = yStart; y <= yEnd; y += 100) {
                    this._canvasContext.fillRect(0, Math.floor(offsetY + y * scale), 9999, 1);
                }
            }
            this._canvasContext.fillStyle = "#2e2e2e";
            this._canvasContext.fillRect(0, Math.floor(offsetY), this._width, 1);
            this._canvasContext.fillRect(Math.floor(offsetX), 0, 1,  this._height);
            this._canvasContext.restore();
        }
    }*/

});