var Montage = require("montage").Montage,
    Vector3 = require("ui/pen-tool-math.js").Vector3,
    BezierSpline = require("ui/pen-tool-math.js").BezierSpline;

exports.FlowSpline = Montage.create(BezierSpline, {

    type: {
        value: "FlowSpline"
    },

    getTransformedAxisAlignedBoundaries: {
        value: function (transformMatrix) {
            return this.clone().transformMatrix3d(transformMatrix).axisAlignedBoundaries;
        }
    }

});

exports.CanvasFlowSpline = Montage.create(Montage, {

    _data: {
        value: null
    },

    data: {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
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
        }
    },

    draw: {
        value: function (transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix),
                self = this,
                needsStroke = false;

            this._canvasContext.strokeStyle = s.strokeColor;
            this._canvasContext.lineWidth = s.strokeWidth;
            this._canvasContext.beginPath();
            s.forEach(function (bezier, index) {
                if (bezier.isComplete) {
                    if (!index) {
                        self._canvasContext.moveTo(
                            bezier.getControlPoint(0).x,
                            bezier.getControlPoint(0).y
                        );
                    }
                    self._canvasContext.bezierCurveTo(
                        bezier.getControlPoint(1).x,
                        bezier.getControlPoint(1).y,
                        bezier.getControlPoint(2).x,
                        bezier.getControlPoint(2).y,
                        bezier.getControlPoint(3).x,
                        bezier.getControlPoint(3).y
                    );
                    needsStroke = true;
                }
            });
            if (needsStroke) {
                this._canvasContext.stroke();
            }
        }
    },

    pointOnShape: {
        value: function (x, y, transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix).scale([1, 1, 0]);
            return (s.getCloserPointTo(Vector3.create().initWithCoordinates([x, y, 0])).distance < 10);
        }
    }

});