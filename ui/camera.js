var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape,
    Vector3 = require("ui/pen-tool-math").Vector3,
    CanvasVector3 = require("ui/canvas-vector3").CanvasVector3,
    MapReducible = require("ui/pen-tool-math").MapReducible;

var Camera = exports.Camera = Montage.create(MapReducible, {

    type: {
        value: "FlowCamera"
    },

    cameraPosition: {
        value: [0, 0, 800]
    },

    cameraTargetPoint: {
        value: [0, 0, 0]
    },

    cameraFov: {
        value: 50
    },

    translate: {
        value: function (offsetsArray) {
            this.cameraPosition = [
                this.cameraPosition[0] + offsetsArray[0],
                this.cameraPosition[1] + offsetsArray[1],
                this.cameraPosition[2] + offsetsArray[2]
            ];
            this.cameraTargetPoint = [
                this.cameraTargetPoint[0] + offsetsArray[0],
                this.cameraTargetPoint[1] + offsetsArray[1],
                this.cameraTargetPoint[2] + offsetsArray[2]
            ];
            this.dispatchEventNamed("cameraChange", true, true);
        }
    },

    axisAlignedBoundaries: {
        get: function () {
            return [
                {
                    min: this.cameraPosition[0],
                    max: this.cameraPosition[0]
                },
                {
                    min: this.cameraPosition[1],
                    max: this.cameraPosition[1]
                },
                {
                    min: this.cameraPosition[2],
                    max: this.cameraPosition[2]
                }
            ];
        }
    }

});

exports.CanvasCamera = Montage.create(CanvasShape, {

    name: {
        value: "Camera"
    },

    constructor: {
        value: function () {
            CanvasShape.constructor.call(this);
            this.defineBindings({
                "cameraPosition": {
                    "<->": "data.cameraPosition",
                    source: this
                },
                "cameraTargetPoint": {
                    "<->": "data.cameraTargetPoint",
                    source: this
                },
                "cameraFov": {
                    "<->": "data.cameraFov",
                    source: this
                }
            });
        }
    },

    children: {
        get: function () {
            var children = [];

            children.push(this._cameraPosition);
            children.push(this._cameraTargetPoint);
            this._cameraPosition.name = "Position";
            this._cameraTargetPoint.name = "Target";
            this._cameraPosition.isVisible = this.isSelected;
            this._cameraTargetPoint.isVisible = this.isSelected;
            return children;
        }
    },

    _cameraPosition: {
        value: null
    },

    cameraPosition: {
        get: function () {
            if (this._cameraPosition) {
                return this._cameraPosition._data._data;
            } else {
                return null;
            }
        },
        set: function (value) {
            var vector = Vector3.create();

            vector._data = value;
            this._cameraPosition = CanvasVector3.create().initWithData(vector);
            vector.nextTarget = this._data;
            this._cameraPosition.color = this.selectedColor;
            this.needsDraw = true;
        }
    },

    _cameraTargetPoint: {
        value: null
    },

    cameraTargetPoint: {
        get: function () {
            if (this._cameraTargetPoint) {
                return this._cameraTargetPoint._data._data;
            } else {
                return null;
            }
        },
        set: function (value) {
            var vector = Vector3.create();

            vector._data = value;
            this._cameraTargetPoint = CanvasVector3.create().initWithData(vector);
            this._cameraTargetPoint.color = this.selectedColor;
            vector.nextTarget = this._data;
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
            if (this._data) {
                this._data.dispatchEventNamed("cameraChange", true, true);
            }
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

    drawSelf: {
        value: function (transformMatrix) {
            if (this.cameraPosition) {
                var tPos = Vector3.create().initWithCoordinates(this.cameraPosition).transformMatrix3d(transformMatrix),
                    tFocus = Vector3.create().initWithCoordinates(this.cameraTargetPoint).transformMatrix3d(transformMatrix),
                    angle = ((this.cameraFov * .5) * Math.PI * 2) / 360,
                    x, y, z,
                    line = [],
                    tmp,
                    scale = .2,
                    indices = [0, 1, 2, 4, 5, 6, 8, 9, 10],
                    i = 0;

                this._cameraSegments = [];
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
                this._context.save();
                this._context.strokeStyle = this.isSelected ? this.selectedColor : this.color;
                this._context.fillStyle = this.isSelected ? this.selectedColor : this.color;
                this._context.beginPath();
                this._context.lineWidth = .5;
                for (i = 0; i < 4; i++) {
                    line[i] = Vector3.create().initWithCoordinates(line[i]).transformMatrix3d(transformMatrix);
                    this._context.moveTo(tPos.x + .5, tPos.y + .5);
                    this._context.lineTo(line[i].x + .5, line[i].y + .5);
                    this._cameraSegments.push([tPos.x, tPos.y, line[i].x, line[i].y]);
                }
                this._context.stroke();
                this._context.globalAlpha = .4;
                for (i = 4; i < 8; i++) {
                    line[i] = Vector3.create().initWithCoordinates(line[i]).transformMatrix3d(transformMatrix);
                    this._context.moveTo(tPos.x + .5, tPos.y + .5);
                    this._context.lineTo(line[i].x + .5, line[i].y + .5);
                }
                this._context.stroke();
                this._context.globalAlpha = 1;
                this._context.beginPath();
                this._context.lineWidth = 1;
                if (this.isSelected) {
                    this._context.moveTo(tPos.x + .5, tPos.y + .5);
                    this._context.lineTo(tFocus.x + .5, tFocus.y + .5);
                    this._cameraSegments.push([tPos.x, tPos.y, tFocus.x, tFocus.y]);
                }
                for (i = 0; i < 4; i++) {
                    this._context.moveTo(tPos.x + .5, tPos.y + .5);
                    this._context.lineTo(line[i].x + .5, line[i].y + .5);
                    this._context.lineTo(line[(i + 1) % 4].x + .5, line[(i + 1) % 4].y + .5);
                    this._cameraSegments.push([line[i].x, line[i].y, line[(i + 1) % 4].x, line[(i + 1) % 4].y]);
                }
                this._context.stroke();
                this._context.restore();
            }
        }
    },

    pointOnShape: {
        value: function (pointerX, pointerY, transformMatrix) {
            if (this.cameraPosition) {
                var tPos = Vector3.create().initWithCoordinates(this.cameraPosition).transformMatrix3d(transformMatrix),
                    tFocus = Vector3.create().initWithCoordinates(this.cameraTargetPoint).transformMatrix3d(transformMatrix),
                    angle = ((this.cameraFov * .5) * Math.PI * 2) / 360,
                    x, y, z,
                    line = [],
                    tmp,
                    scale = .2,
                    indices = [0, 1, 2, 4, 5, 6, 8, 9, 10],
                    i = 0;

                this._cameraSegments = [];
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
                }
                for (i = 0; i < 4; i++) {
                    line[i] = Vector3.create().initWithCoordinates(line[i]).transformMatrix3d(transformMatrix);
                    this._cameraSegments.push([tPos.x, tPos.y, line[i].x, line[i].y]);
                }
                if (this.isSelected) {
                    this._cameraSegments.push([tPos.x, tPos.y, tFocus.x, tFocus.y]);
                }
                for (i = 0; i < 4; i++) {
                    this._cameraSegments.push([line[i].x, line[i].y, line[(i + 1) % 4].x, line[(i + 1) % 4].y]);
                }
                for (i = 0; i < this._cameraSegments.length; i++) {
                    if (this._distanceToSegment(
                            pointerX, pointerY,
                            this._cameraSegments[i][0],
                            this._cameraSegments[i][1],
                            this._cameraSegments[i][2],
                            this._cameraSegments[i][3]
                        ) < 6) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }
    }

});