var Montage = require("montage").Montage,
    PenToolMath = require("ui/pen-tool-math.js"),
    Vector3 = PenToolMath.Vector3;

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
            viewport.selection = [
                viewport.findSelectedShape(event.layerX, event.layerY)
            ];
            this._pointerX = event.pageX,
            this._pointerY = event.pageY;
        }
    },

    handleMousemove: {
        value: function (event, viewport) {
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY;

            if (viewport.selection[0]) {
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
                viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            }
            this._pointerX = event.pageX,
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
            var result = viewport.findControlPoint(event.layerX, event.layerY);

            if (result) {
                this._selectedControlPoint = result;
            } else {
                viewport.selection = [
                    viewport.findSelectedShape(event.layerX, event.layerY)
                ];
                this._selectedControlPoint = null;
            }
            this._pointerX = event.pageX,
            this._pointerY = event.pageY;
        }
    },

    handleMousemove: {
        value: function (event, viewport) {
            var dX = event.pageX - this._pointerX,
                dY = event.pageY - this._pointerY;

            if (this._selectedControlPoint) {
                this._selectedControlPoint.controlPoint.translate(
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
                if (viewport.selection[0]) {
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
                }
            }
            viewport.scene.dispatchEventNamed("sceneUpdated", true, true);
            this._pointerX = event.pageX,
            this._pointerY = event.pageY;
        }
    },

    handleMouseup: {
        value: function (event, viewport) {
        }
    }

});
