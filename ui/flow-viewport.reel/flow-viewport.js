var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    Viewport = require("ui/viewport").Viewport;

exports.FlowViewport = Montage.create(Viewport, {

    findSelectedShape: {
        value: function (x, y) {
            var length = this.scene._data.length,
                imageData,
                shape,
                i;

            this._element.width = this._width;
            this._element.height = this._height;
            for (i = length - 1; i >= 0; i--) {
                shape = this.scene._data[i];
                this._context.beginPath();
                this.drawShape(shape);
                this._context.fill();
                this._context.lineWidth = 16;
                this._context.stroke();
                imageData = this._context.getImageData(x, y, 1, 1);
                if (imageData.data[3] > 0) {
                    this.draw();
                    return shape;
                }
            }
            this.draw();
            return null;
        }
    },

    findControlPoint: {
        value: function (x, y) {
            var result = null;

            if (this.selection && this.selection[0]) {
                var shape = this.selection[0].clone().transformMatrix3d(this.matrix),
                    self = this;

                shape.forEach(function (bezier, index) {
                    var i;

                    for (i = 0; i < 4; i++) {
                        if (bezier.getControlPoint(i)) {
                            if ((bezier.getControlPoint(i).x - 5 <= x) &&
                                (bezier.getControlPoint(i).x + 5 >= x) &&
                                (bezier.getControlPoint(i).y - 5 <= y) &&
                                (bezier.getControlPoint(i).y + 5 >= y)) {

                                result = {
                                    shape: shape,
                                    controlPoint: self.selection[0].getBezierCurve(index).getControlPoint(i),
                                    bezierIndex: index,
                                    controlPointIndex: i
                                };
                            }
                        }
                    }
                });
            }
            return result;
        }
    },

    prepareForDraw: {
        value: function () {
            this._width = this._element.offsetWidth;
            this._height = this._element.offsetHeight;
            this._context = this._element.getContext("2d");
            this._element.addEventListener("mousedown", this, true);
        }
    },

    drawShape: {
        value: function (shape) {
            var s = shape.clone().transformMatrix3d(this.matrix),
                self = this,
                needsFill = false;

            this._context.fillStyle = shape.fillColor;
            this._context.strokeStyle = shape.strokeColor;
            this._context.lineWidth = shape.strokeWidth;
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
                    needsFill = true;
                }
            });
            if (needsFill) {
                this._context.fill();
                this._context.stroke();
            }
        }
    },

    drawScene: {
        value: function (scene) {
            var self = this;

            scene.forEach(function (shape) {
                self.drawShape(shape);
            });
        }
    },

    drawShapeSelectionHandlers: {
        value: function () {
            var self = this;

            if (this.selection && this.selection[0]) {
                var shape = this.selection[0].clone().transformMatrix3d(this.matrix);

                shape.forEach(function (bezier) {
                    var i;

                    for (i = 0; i < 2; i++) {
                        self._context.lineWidth = i?1:7;
                        self._context.strokeStyle = i?"red":"rgba(255,255,255,.15)";
                        if (bezier.getControlPoint(0) && bezier.getControlPoint(1)) {
                            self._context.beginPath();
                            self._context.moveTo(
                                bezier.getControlPoint(0).x,
                                bezier.getControlPoint(0).y
                            );
                            self._context.lineTo(
                                bezier.getControlPoint(1).x,
                                bezier.getControlPoint(1).y
                            );
                            self._context.stroke();
                        }
                        if (bezier.getControlPoint(2) && bezier.getControlPoint(3)) {
                            self._context.beginPath();
                            self._context.moveTo(
                                bezier.getControlPoint(2).x,
                                bezier.getControlPoint(2).y
                            );
                            self._context.lineTo(
                                bezier.getControlPoint(3).x,
                                bezier.getControlPoint(3).y
                            );
                            self._context.stroke();
                        }
                    }
                });
                shape.forEach(function (bezier, index) {
                    if (!index) {
                        if (bezier.getControlPoint(0)) {
                            self._context.fillStyle = "white";
                            self._context.fillRect(
                                bezier.getControlPoint(0).x - 5 | 0,
                                bezier.getControlPoint(0).y - 5 | 0,
                                9,
                                9
                            );
                            self._context.fillStyle = "black";
                            self._context.fillRect(
                                bezier.getControlPoint(0).x - 4 | 0,
                                bezier.getControlPoint(0).y - 4 | 0,
                                7,
                                7
                            );
                        }
                    }
                    if (bezier.getControlPoint(3)) {
                        self._context.fillStyle = "white";
                        self._context.fillRect(
                            bezier.getControlPoint(3).x - 5 | 0,
                            bezier.getControlPoint(3).y - 5 | 0,
                            9,
                            9
                        );
                        self._context.fillStyle = "black";
                        self._context.fillRect(
                            bezier.getControlPoint(3).x - 4 | 0,
                            bezier.getControlPoint(3).y - 4 | 0,
                            7,
                            7
                        );
                    }
                    if (bezier.getControlPoint(1)) {
                        self._context.fillStyle = "white";
                        self._context.fillRect(
                            bezier.getControlPoint(1).x - 5 | 0,
                            bezier.getControlPoint(1).y - 5 | 0,
                            9,
                            9
                        );
                        self._context.fillStyle = "red";
                        self._context.fillRect(
                            bezier.getControlPoint(1).x - 4 | 0,
                            bezier.getControlPoint(1).y - 4 | 0,
                            7,
                            7
                        );
                    }
                    if (bezier.getControlPoint(2)) {
                        self._context.fillStyle = "white";
                        self._context.fillRect(
                            bezier.getControlPoint(2).x - 5 | 0,
                            bezier.getControlPoint(2).y - 5 | 0,
                            9,
                            9
                        );
                        self._context.fillStyle = "red";
                        self._context.fillRect(
                            bezier.getControlPoint(2).x - 4 | 0,
                            bezier.getControlPoint(2).y - 4 | 0,
                            7,
                            7
                        );
                    }
                });
            }
        }
    },

    drawShapeSelection: {
        value: function () {
            if (this.selection && this.selection[0]) {
                var shape = this.selection[0].clone().transformMatrix3d(this.matrix),
                    self = this,
                    needsFill = false;

                this._context.globalAlpha = .7;
                this._context.strokeStyle = "cyan";
                this._context.fillStyle = this.selection[0].fillColor;
                this._context.lineWidth = 1;
                this._context.beginPath();
                shape.forEach(function (bezier, index) {
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
                        needsFill = true;
                    }
                });
                if (needsFill) {
                    this._context.fill();
                    this._context.stroke();
                }
                this._context.globalAlpha = 1;
            }
        }
    },

    selectedShapeAxisAlignedBoundaries: {
        value: null
    },

    drawShapeSelectionBoundingRectangle: {
        value: function () {
            if (this.selection && this.selection[0]) {
                var s = shape = this.selection[0].clone().transformMatrix3d(this.matrix),
                    boundaries = this.selectedShapeAxisAlignedBoundaries = s.axisAlignedBoundaries,
                    i, k = 9 - (Date.now() / 100 | 0) % 10, e = k, self = this;

                for (i = boundaries[0].min|0; i < boundaries[0].max|0; i++) {
                    this._context.fillStyle = (e%10 < 5) ? "black" : "white";
                    this._context.fillRect(i, boundaries[1].min|0, 1, 1);
                    e++;
                }
                for (i = boundaries[1].min|0; i < boundaries[1].max|0; i++) {
                    this._context.fillStyle = (e%10 < 5) ? "black" : "white";
                    this._context.fillRect(boundaries[0].max|0, i, 1, 1);
                    e++;
                }
                e = k;
                for (i = boundaries[1].min|0; i < boundaries[1].max|0; i++) {
                    this._context.fillStyle = (e%10 < 5) ? "black" : "white";
                    this._context.fillRect(boundaries[0].min|0, i, 1, 1);
                    e++;
                }
                for (i = boundaries[0].min|0; i < boundaries[0].max|0; i++) {
                    this._context.fillStyle = (e%10 < 5) ? "black" : "white";
                    this._context.fillRect(i, boundaries[1].max|0, 1, 1);
                    e++;
                }
                window.setTimeout(function () {
                    self.needsDraw = true;
                }, 100);
            }
        }
    },

    drawShapeSelectionScale: {
        value: function () {
            if (this.selectedShape && this.tool === "arrow") {
                var boundaries = this.selectedShapeAxisAlignedBoundaries;

                this._context.strokeStyle = "black";
                this._context.lineWidth = "black";
                this._context.strokeRect((boundaries[0].min|0) - 3.5, (boundaries[1].min|0) - 3.5, 8, 8);
                this._context.strokeRect((boundaries[0].min|0) - 3.5, (boundaries[1].max|0) - 3.5, 8, 8);
                this._context.strokeRect((boundaries[0].max|0) - 3.5, (boundaries[1].min|0) - 3.5, 8, 8);
                this._context.strokeRect((boundaries[0].max|0) - 3.5, (boundaries[1].max|0) - 3.5, 8, 8);
            }
        }
    },

    draw: {
        value: function () {
            this._element.width = this._width;
            this._element.height = this._height;
            this.drawScene(this.scene);
            this.drawShapeSelection();
            if (this.isShowingControlPoints) {
                this.drawShapeSelectionHandlers();
            }
            if (this.isShowingSelection) {
                this.drawShapeSelectionBoundingRectangle();
            }
            //this.drawShapeSelectionScale();
        }
    }
});
