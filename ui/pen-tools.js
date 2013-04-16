var Montage = require("montage").Montage,
    PenToolMath = require("ui/pen-tool-math"),
    FlowKnot = require("ui/flow-spline-handlers").FlowKnot,
    Vector3 = PenToolMath.Vector3,
    FlowSpline = require("ui/flow-spline").FlowSpline,
    CanvasFlowSpline = require("ui/flow-spline").CanvasFlowSpline,
    BezierCurve = PenToolMath.BezierCurve;

exports.ArrowTool = Montage.create(Montage, {

    start: {
        value: function (viewport) {
            viewport.isShowingSelection = true;
        }
    },

    stop: {
        value: function (viewport) {
            viewport.isShowingSelection = false;
        }
    },

    _pointerX: {
        value: null
    },

    _pointerY: {
        value: null
    },

    handleMousedown: {
        value: function (event, viewport) {
            var selected = viewport.findSelectedShape(event.layerX, event.layerY);

            viewport.unselect();
            if (selected) {
                selected.isSelected = true;
            }
            //viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            this._pointerX = event.pageX,
            this._pointerY = event.pageY;
        }
    },

    handleMousemove: {
        value: function (event, viewport) {
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY;

            if (viewport.selection && viewport.selection[0] && viewport.selection[0]._data.type !== "FlowGrid") {
                viewport.selection[0].translate(
                    Vector3.
                    create().
                    initWithCoordinates([dX, dY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix)).
                    subtract(
                        Vector3.
                        create().
                        initWithCoordinates([0, 0, 0]).
                        transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                    )._data
                );
                //viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            } else {
                viewport.translateX += dX;
                viewport.translateY += dY;
            }
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
        }
    },

    handleMouseup: {
        value: function (event, viewport) {
        }
    }

});

exports.ConvertTool = Montage.create(Montage, {

    start: {
        value: function (viewport) {
            viewport.isShowingControlPoints = true;
        }
    },

    stop: {
        value: function (viewport) {
            viewport.isShowingControlPoints = false;
        }
    },

    _pointerX: {
        value: null
    },

    _pointerY: {
        value: null
    },

    handleMousedown: {
        value: function (event, viewport) {
            /*var result = viewport.findControlPoint(event.layerX, event.layerY);

            if (result) {
                this._selectedControlPoint = result;
            } else {
                viewport.selection = [
                    viewport.findSelectedShape(event.layerX, event.layerY)
                ];
                this._selectedControlPoint = null;
            }
            this._pointerX = event.pageX,
            this._pointerY = event.pageY;*/
            var path,
                i;

            this._selectedChild = viewport.findSelectedChild(event.layerX, event.layerY);
            if (this._selectedChild) {
                path = viewport.findPathToNode(this._selectedChild);
                viewport.unselect();
                for (i = 0; i < path.length; i++) {
                    path[i].isSelected = true;
                }
                /*if (previousSelectedChild && !previousSelectedChild.hasChild(this._selectedChild)) {
                    previousSelectedChild.isSelected = false;
                }
                this._selectedChild.isSelected = true;*/
            } else {
                viewport.unselect();
            }
            //viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            /*viewport.unselect();
            if (selected) {
                selected.isSelected = true;
            }
            viewport.scene.dispatchEventNamed("sceneUpdated", true, true);*/
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
        }
    },

    handleMousemove: {
        value: function (event, viewport) {
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY;

            if (this._selectedChild) {
                this._selectedChild.translate(
                    Vector3.
                    create().
                    initWithCoordinates([dX, dY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix)).
                    subtract(
                        Vector3.
                        create().
                        initWithCoordinates([0, 0, 0]).
                        transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                    )._data
                );
            } else {
                viewport.translateX += dX;
                viewport.translateY += dY;
            }
            //viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
        }
    },

    handleMouseup: {
        value: function (event, viewport) {
        }
    }

});

exports.PenTool = Montage.create(Montage, {

    start: {
        value: function (viewport) {
            this._editingSpline = null;
        }
    },

    stop: {
        value: function (viewport) {
        }
    },

    _pointerX: {
        value: null
    },

    _pointerY: {
        value: null
    },

    _editingSpline: {
        value: null
    },

    handleMousedown: {
        value: function (event, viewport) {
            var canvasShape,
                shape,
                spline,
                bezier,
                previousBezier,
                knot;

            if (this._editingSpline) {
                if (this.previousKnot) this.previousKnot._isSelected = false;
                bezier = this._editingSpline._data[this._editingSpline.length - 1];
                bezier.pushControlPoint(Vector3.
                    create().
                    initWithCoordinates([event.layerX, event.layerY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                );
                bezier.pushControlPoint(knot = FlowKnot.
                    create().
                    initWithCoordinates([event.layerX, event.layerY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                );
                //if (bezier._data.length === 4) {
                    //previousBezier = bezier;
                knot._isSelected = true;
                this.previousKnot = knot;
                bezier = BezierCurve.create().init();
                this._editingSpline.pushBezierCurve(bezier);
                    /*bezier.pushControlPoint(knot = Vector3.
                        create().
                        initWithCoordinates([
                            bezier.getControlPoint(0).x * 2 - previousBezier.getControlPoint(2).x,
                            bezier.getControlPoint(0).y * 2 - previousBezier.getControlPoint(2).y,
                            bezier.getControlPoint(0).z * 2 - previousBezier.getControlPoint(2).z])
                    );*/
                //}
                bezier.pushControlPoint(knot = FlowKnot.
                    create().
                    initWithCoordinates([event.layerX, event.layerY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                );
                bezier._isSelected = true;
                knot._isSelected = true;

            } else {
                canvasShape = CanvasFlowSpline.create();
                viewport.scene.children.push(canvasShape);
                this._editingSpline = shape = FlowSpline.create().init();
                viewport.scene._data.pushShape(shape);
                canvasShape.initWithData(shape);
                bezier = BezierCurve.create().init();
                bezier.pushControlPoint(knot = FlowKnot.
                    create().
                    initWithCoordinates([event.layerX, event.layerY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                );
                bezier.pushControlPoint(Vector3.
                    create().
                    initWithCoordinates([event.layerX, event.layerY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                );
                shape.pushBezierCurve(bezier);
                bezier._isSelected = true;
                knot._isSelected = true;
                canvasShape.isSelected = true;
                this.previousKnot = knot;
            }
            //viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
        }
    },

    handleMousemove: {
        value: function (event, viewport) {
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY,
                vector = this._editingSpline._data[this._editingSpline.length - 1]._data[1],
                vector2;

            vector.translate(
                    Vector3.
                    create().
                    initWithCoordinates([dX, dY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix)).
                    subtract(
                        Vector3.
                        create().
                        initWithCoordinates([0, 0, 0]).
                        transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                    )._data
                );

            if (this._editingSpline._data[this._editingSpline.length - 2] && (vector2 = this._editingSpline._data[this._editingSpline.length - 2]._data[2])) {
                    vector2._data = [
                        this._editingSpline._data[this._editingSpline.length - 1].getControlPoint(0).x * 2 - vector.x,
                        this._editingSpline._data[this._editingSpline.length - 1].getControlPoint(0).y * 2 - vector.y,
                        this._editingSpline._data[this._editingSpline.length - 1].getControlPoint(0).z * 2 - vector.z
                    ];
            }
            /*var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY;

            if (this._selectedChild) {
                this._selectedChild.translate(
                    Vector3.
                    create().
                    initWithCoordinates([dX, dY, 0]).
                    transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix)).
                    subtract(
                        Vector3.
                        create().
                        initWithCoordinates([0, 0, 0]).
                        transformMatrix3d(viewport._inverseTransformMatrix(viewport.matrix))
                    )._data
                );
            } else {
                viewport.translateX += dX;
                viewport.translateY += dY;
            }
            viewport.scene.dispatchEventNamed("sceneUpdated", true, true);*/
            //viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
        }
    },

    handleMouseup: {
        value: function (event, viewport) {
        }
    }

});
