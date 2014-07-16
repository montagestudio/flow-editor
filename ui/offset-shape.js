var CanvasShape = require("ui/canvas-shape").CanvasShape,
    FlowEditorConfig = require("core/configuration").FlowEditorConfig,
    Vector3 = require("ui/pen-tool-math").Vector3,
    GridConfig = FlowEditorConfig.grid,
    ViewPortConfig = FlowEditorConfig.viewPort;

exports.OffsetShape = CanvasShape.specialize({

    initWithContextAndCoordinates: {
        value: function (viewPort, coordinates) {
            this.viewPort = viewPort;
            this._contextToDraw = viewPort._context;

            var inverseMatrix = viewPort.inverseTransformMatrix(viewPort.matrix);

            this._data = Vector3.create().initWithCoordinates(coordinates).transformMatrix3d(inverseMatrix);
            this._initialData = Vector3.create().initWithCoordinates(coordinates).transformMatrix3d(inverseMatrix);

            this._data.save();

            this.isHiddenInInspector = true;

            return this;
        }
    },

    type: {
        value: "OffsetLine"
    },

    _contextToDraw: {
        value: null
    },

    translate: {
        value: function (coordinates) {
            this._data.restore();
            this._data.translate(coordinates);

            this.needsDraw = true;
        }
    },

    _setLineDash: {
        value: null
    },

    setLineDash: {
        value: function () {
            if (!this._setLineDash) {
                this._setLineDash = CanvasRenderingContext2D.prototype.setLineDash ||
                    CanvasRenderingContext2D.prototype.webkitLineDash ||
                    CanvasRenderingContext2D.prototype.mozDash ||
                    function () {}; //Todo: make our own setLineDash function for older browsers.
            }

            this._setLineDash.apply(this._context, arguments);
        }
    },

    drawSelf: {
        value: function (transformMatrix) {
            if (this._contextToDraw === this._context) {
                var startPosition = this._initialData.clone().transformMatrix3d(transformMatrix),
                    endPosition = this._data.clone().transformMatrix3d(transformMatrix),
                    needDashedLine = true;

                this._context.save();

                if (startPosition.x === endPosition.x) {
                    needDashedLine = false;

                    this._context.strokeStyle = GridConfig[this.viewPort.type].colorOrdinate;

                } else if (startPosition.y === endPosition.y) {
                    needDashedLine = false;

                    this._context.strokeStyle = GridConfig[this.viewPort.type].colorAbscissa;
                }

                if (needDashedLine) {
                    this.setLineDash([1,6]);
                }

                this._context.beginPath();

                this._context.moveTo(startPosition.x, startPosition.y);
                this._context.lineTo(endPosition.x, endPosition.y);

                this._context.closePath();
                this._context.stroke();

                this._context.restore();
            }
        }
    }

});
