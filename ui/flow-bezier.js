var Montage = require("montage").Montage,
    CanvasShape = require("ui/canvas-shape").CanvasShape,
    Vector3 = require("ui/pen-tool-math").Vector3,
    CanvasVector3 = require("ui/canvas-vector3").CanvasVector3,
    CanvasFlowSplineHandlers = require("ui/flow-spline-handlers").CanvasFlowSplineHandlers;

/*exports.FlowSpline = Montage.create(BezierSpline, {

    type: {
        value: "FlowSpline"
    },

    getTransformedAxisAlignedBoundaries: {
        value: function (transformMatrix) {
            return this.clone().transformMatrix3d(transformMatrix).axisAlignedBoundaries;
        }
    }

});*/

exports.CanvasFlowBezier = Montage.create(CanvasShape, {

    children: {
        get: function () {
            var self = this,
                bezier = this._data,
                children = [];

            //if (this.isSelected) {
                //this.data.forEach(function (bezier, index) {
                    var vector, i;

                    /*for (i = 0; i < 4; i++) {
                        if (i === 0 || i === 3) {
                        if (bezier.getControlPoint(i)) {
                            vector = CanvasVector3.create().initWithData(bezier.getControlPoint(i));
                            vector.canvas = self.canvas;
                            vector.color = self._selectedColor;
                            children.push(vector);
                        }
                    }
                    }*/
                    //if (this.isSelected) {
                        vector = CanvasFlowSplineHandlers.create().initWithData(bezier);
                        vector.canvas = self.canvas;
                        vector.color = self._selectedColor;
                        children.push(vector);
                    //}
                //});
            //}
            return children;
        }
    },

    drawSelf: {
        value: function (transformMatrix) {
            var s = this._data.clone().transformMatrix3d(transformMatrix),
                self = this;

            this._context.save();
            this._context.strokeStyle = this._color;
            this._context.lineWidth = 1;
            this._context.beginPath();
            if (this.isSelected) {
            if (s.getControlPoint(0) && s.getControlPoint(1)) {
                this._context.moveTo(s.getControlPoint(0).x, s.getControlPoint(0).y);
                this._context.lineTo(s.getControlPoint(1).x, s.getControlPoint(1).y);
                this._context.stroke();
            }
            if (s.getControlPoint(2) && s.getControlPoint(3)) {
                this._context.moveTo(s.getControlPoint(2).x, s.getControlPoint(2).y);
                this._context.lineTo(s.getControlPoint(3).x, s.getControlPoint(3).y);
                this._context.stroke();
            }
            }
            this._context.restore();
            /*if (this.isSelected) {
                this.drawSelected(transformMatrix);
            }*/
        }
    }

});