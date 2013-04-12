var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape,
    Vector3 = require("ui/pen-tool-math").Vector3,
    BezierSpline = require("ui/pen-tool-math").BezierSpline,
    CanvasVector3 = require("ui/canvas-vector3").CanvasVector3,
    //CanvasFlowBezier = require("ui/flow-bezier").CanvasFlowBezier,
    FlowSplineHandlers = require("ui/flow-spline-handlers").FlowSplineHandlers
    CanvasFlowSplineHandlers = require("ui/flow-spline-handlers").CanvasFlowSplineHandlers;

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
            var self = this,
                children = [],
                bezier,
                handlers,
                i;

            if (this.isSelected) {
                if (!this._children) {
                    for (i = 0; i < this.data.length; i++) {
                        bezier = this.data.getBezierCurve(i);
                        handlers = CanvasFlowSplineHandlers.create();
                        if (i) {
                            if (this.data.getBezierCurve(i - 1) && this.data.getBezierCurve(i - 1).getControlPoint(2)) {
                                handlers.previousHandler = this.data.getBezierCurve(i - 1).getControlPoint(2);
                            }
                        }
                        if (bezier.getControlPoint(0)) {
                            handlers.initWithData(bezier.getControlPoint(0));
                        }
                        if (bezier.getControlPoint(1)) {
                            handlers.nextHandler = bezier.getControlPoint(1);
                        }
                        handlers.canvas = self.canvas;
                        handlers.color = self._selectedColor;
                        children.push(handlers);
                    }
                    if (this.data.length) {
                        if (this.data.getBezierCurve(this.data.length - 1)) {
                            bezier = this.data.getBezierCurve(this.data.length - 1);
                        }
                        handlers = CanvasFlowSplineHandlers.create();
                        if (bezier.getControlPoint(3)) {
                            handlers.initWithData(bezier.getControlPoint(3));
                            if (bezier.getControlPoint(2)) {
                                handlers.previousHandler = bezier.getControlPoint(2);
                            }
                            handlers.canvas = self.canvas;
                            handlers.color = self._selectedColor;
                            children.push(handlers);
                        }
                    }
                    this._children = children;
                } else {
                    var tmpChildren = [];

                    children = this._children;
                    for (i = 0; i < this.data.length; i++) {
                        bezier = this.data.getBezierCurve(i);
                        handlers = CanvasFlowSplineHandlers.create();
                        if (i) {
                            if (this.data.getBezierCurve(i - 1) && this.data.getBezierCurve(i - 1).getControlPoint(2)) {
                                handlers.previousHandler = this.data.getBezierCurve(i - 1).getControlPoint(2);
                            }
                        }
                        if (bezier.getControlPoint(0)) {
                            handlers.initWithData(bezier.getControlPoint(0));
                        }
                        if (bezier.getControlPoint(1)) {
                            handlers.nextHandler = bezier.getControlPoint(1);
                        }
                        handlers.canvas = self.canvas;
                        handlers.color = self._selectedColor;
                        tmpChildren.push(handlers);
                    }
                    if (this.data.length) {
                        if (this.data.getBezierCurve(this.data.length - 1)) {
                            bezier = this.data.getBezierCurve(this.data.length - 1);
                        }
                        handlers = CanvasFlowSplineHandlers.create();
                        if (bezier.getControlPoint(3)) {
                            handlers.initWithData(bezier.getControlPoint(3));
                            if (bezier.getControlPoint(2)) {
                                handlers.previousHandler = bezier.getControlPoint(2);
                            }
                            handlers.canvas = self.canvas;
                            handlers.color = self._selectedColor;
                            tmpChildren.push(handlers);
                        }
                    }
                    if (children.length < tmpChildren.length) {
                        for (i = children.length; i < tmpChildren.length; i++) {
                            children[i] = tmpChildren[i];
                        }
                    }
                }
            }
            return children;
            /*var self = this,
                children = [];

            if (this.isSelected) {

            }
            return children;*/
        }
    },

    drawSelf: {
        value: function (transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix),
                self = this,
                needsStroke = false;

            this._context.save();
            this._context.strokeStyle = this._color;
            this._context.lineWidth = 3;
            this._context.beginPath();
            s.forEach(function (bezier, index) {
                if (bezier.length === 4) {
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
            this._context.lineWidth = 1.5;
            this._context.beginPath();
            s.forEach(function (bezier, index) {
                if (bezier.length === 4) {
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