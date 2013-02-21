var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape,
    Vector3 = require("ui/pen-tool-math").Vector3,
    BezierSpline = require("ui/pen-tool-math").BezierSpline,
    CanvasVector3 = require("ui/canvas-vector3").CanvasVector3;

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

exports.CanvasFlowSpline = Montage.create(CanvasShape, {

    children: {
        get: function () {
            var children = [],
                self = this;

            if (this.isSelected) {
                this.data.forEach(function (bezier, index) {
                    var vector;

                    if (!index) {
                        if (bezier.getControlPoint(0)) {
                            vector = CanvasVector3.create().initWithData(bezier.getControlPoint(0));
                            vector.canvas = self.canvas;
                            vector.color = self._selectedColor;
                            children.push(vector);
                        }
                    }
                    if (bezier.getControlPoint(3)) {
                        vector = CanvasVector3.create().initWithData(bezier.getControlPoint(3));
                        vector.canvas = self.canvas;
                        vector.color = self._selectedColor;
                        children.push(vector);
                    }
                });
            }
            return children;
        }
    },

    draw: {
        value: function (transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix),
                self = this,
                needsStroke = false;

            this._context.save();
            this._context.strokeStyle = this._color;
            this._context.lineWidth = 3;
            this._context.beginPath();
            s.forEach(function (bezier, index) {
                if (bezier.isComplete) {
                    if (!index) {
                        self._context.moveTo(
                            bezier.getControlPoint(0).x,
                            bezier.getControlPoint(0).y
                        );
                    }
                    self._context.bezierCurveTo(
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
                this._context.stroke();
            }
            this._context.restore();
            if (this.isSelected) {
                this.drawSelected(transformMatrix);
            }
        }
    },

    drawSelected: {
        value: function (transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix),
                self = this,
                needsStroke = false;

            this._context.save();
            this._context.strokeStyle = this._selectedColor;
            this._context.lineWidth = 1;
            this._context.beginPath();
            s.forEach(function (bezier, index) {
                if (bezier.isComplete) {
                    if (!index) {
                        self._context.moveTo(
                            bezier.getControlPoint(0).x,
                            bezier.getControlPoint(0).y
                        );
                    }
                    self._context.bezierCurveTo(
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
                this._context.stroke();
            }
            this._context.restore();
        }
    },

    pointOnShape: {
        value: function (x, y, transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix).scale([1, 1, 0]);
            return (s.getCloserPointTo(Vector3.create().initWithCoordinates([x, y, 0])).distance < 10);
        }
    }

});