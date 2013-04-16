var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    Flow = require("matte/ui/flow.reel").Flow,
    FlowBezierSpline = require("matte/core/flow-bezier-spline").FlowBezierSpline,
    PenToolMath = require("ui/pen-tool-math"),
    FlowKnot = require("ui/flow-spline-handlers").FlowKnot,
    Vector3 = PenToolMath.Vector3,
    BezierCurve = PenToolMath.BezierCurve,
    Scene = PenToolMath.Scene,
    FlowSpline = require("ui/flow-spline").FlowSpline,
    CanvasFlowSpline = require("ui/flow-spline").CanvasFlowSpline,
    Grid = require("ui/grid").Grid,
    CanvasGrid = require("ui/grid").CanvasGrid,
    Camera = require("ui/camera").Camera,
    CanvasCamera = require("ui/camera").CanvasCamera,
    Cross = require("ui/cross").Cross,
    CanvasCross = require("ui/cross").CanvasCross;

exports.Editor = Montage.create(Component, {

    object: {
        get: function () {
            return this.flow;
        },
        set: function (value) {
            this.flow = value;
        }
    },

    _flow: {
        value: null
    },

    flow: {
        get: function () {
            return this._flow;
        },
        set: function (value) {
            this._cameraPosition = value.cameraPosition;
            this._cameraTargetPoint = value.cameraTargetPoint;
            this._cameraRoll = value.cameraRoll;
            this._cameraFov = value.cameraFov;
            this._flow = value;
        }
    },

    hasSplineUpdated: {
        value: true
    },

/*    _selectedTool: {
        enumerable: false,
        value: "add"
    },

    selectedTool: {
        get: function () {
            return this._selectedTool;
        },
        set: function (value) {
            this._selectedTool = value;
            this.topView.mousedownDelegate =
            this.frontView.mousedownDelegate =
            this.topView.mousemoveDelegate =
            this.frontView.mousemoveDelegate = null;
            this.topView.isDrawingHandlers =
            this.frontView.isDrawingHandlers =
            this.topView.isDrawingDensities =
            this.frontView.isDrawingDensities =
            this.topView.isHighlightingCloserKnot =
            this.frontView.isHighlightingCloserKnot =
            this.topView.isHighlightingCloserHandler =
            this.frontView.isHighlightingCloserHandler = false;

            // TODO move this to draw
            this.frontView.element.style.display =
            this.topView.element.style.display = "block";
            this.parametersEditor.style.display = "none";
            this[value + "ButtonAction"]();
        }
    },

    addButtonAction: {
        value: function () {
            var self = this,
                sX,
                sY,
                tmp;

            this.topView.isDrawingHandlers = this.frontView.isDrawingHandlers = true;
            this.topView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                self.spline.previousHandlers.push([x, 0, y]);
                self.spline.knots.push([x, 0, y]);
                self.spline.nextHandlers.push([x, 0, y]);
                self.spline.densities.push(3);
                self.spline._computeDensitySummation.call(self.spline);
                self.frontView.updateSpline();
                self.topView.updateSpline();
                self.hasSplineUpdated = true;
                self.flow._updateLength();
                sX = x;
                sY = y;
                return false;
            };
            this.frontView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                self.spline.previousHandlers.push([x, y, 0]);
                self.spline.knots.push([x, y, 0]);
                self.spline.nextHandlers.push([x, y, 0]);
                self.spline.densities.push(3);
                self.spline._computeDensitySummation.call(self.spline);
                self.frontView.updateSpline();
                self.topView.updateSpline();
                self.hasSplineUpdated = true;
                self.flow._updateLength();
                sX = x;
                sY = y;
                return false;
            };
            this.topView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                sX -= x;
                sY -= y;
                tmp = self.spline.knots[self.spline.knots.length - 1];
                self.spline.previousHandlers[self.spline.previousHandlers.length - 1] = [tmp[0] * 2 - sX, 0, tmp[2] * 2 - sY];
                self.spline.nextHandlers[self.spline.nextHandlers.length - 1] = [sX, 0, sY];
                self.frontView.updateSpline();
                self.topView.updateSpline();
                self.hasSplineUpdated = true;
                self.flow._updateLength();
                return false;
            };
            this.frontView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                sX -= x;
                sY -= y;
                tmp = self.spline.knots[self.spline.knots.length - 1];
                self.spline.previousHandlers[self.spline.previousHandlers.length - 1] = [tmp[0] * 2 - sX, tmp[1] * 2 - sY, 0];
                self.spline.nextHandlers[self.spline.nextHandlers.length - 1] = [sX, sY, 0];
                self.frontView.updateSpline();
                self.topView.updateSpline();
                self.hasSplineUpdated = true;
                self.flow._updateLength();
                return false;
            };
        }
    },

    removeButtonAction: {
        value: function () {
            var self = this;

            this.topView.isDrawingHandlers = this.frontView.isDrawingHandlers = false;
            this.topView.isDrawingDensities = this.frontView.isDrawingDensities = false;
            this.topView.isHighlightingCloserKnot = this.frontView.isHighlightingCloserKnot = true;
            this.topView.mousedownDelegate = this.frontView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (knot !== null) {
                    self.spline.knots.splice(knot, 1);
                    self.spline.nextHandlers.splice(knot, 1);
                    self.spline.previousHandlers.splice(knot, 1);
                    self.spline.densities.splice(knot, 1);
                    self.frontView.updateSpline();
                    self.topView.updateSpline();
                    self.hasSplineUpdated = true;
                    self.spline._computeDensitySummation.call(self.spline);
                    self.flow._updateLength();
                    return false;
                } else {
                    return true;
                }
            };
        }
    },

    moveKnotButtonAction: {
        value: function () {
            var self = this;

            this.topView.isHighlightingCloserKnot = this.frontView.isHighlightingCloserKnot = true;
            this.topView.mousedownDelegate =
            this.frontView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (knot !== null) {
                    self._selectedKnot = knot;
                    return false;
                } else {
                    self._selectedKnot = null;
                    return true;
                }
            };
            this.topView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (self._selectedKnot !== null) {
                    self.spline.knots[self._selectedKnot][0] -= x;
                    self.spline.knots[self._selectedKnot][2] -= y;
                    self.spline.nextHandlers[self._selectedKnot][0] -= x;
                    self.spline.nextHandlers[self._selectedKnot][2] -= y;
                    self.spline.previousHandlers[self._selectedKnot][0] -= x;
                    self.spline.previousHandlers[self._selectedKnot][2] -= y;
                    self.frontView.updateSpline(true);
                    self.topView.updateSpline(true);
                    self.hasSplineUpdated = true;
                    self.flow._updateLength();
                }
            };
            this.frontView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (self._selectedKnot !== null) {
                    self.spline.knots[self._selectedKnot][0] -= x;
                    self.spline.knots[self._selectedKnot][1] -= y;
                    self.spline.nextHandlers[self._selectedKnot][0] -= x;
                    self.spline.nextHandlers[self._selectedKnot][1] -= y;
                    self.spline.previousHandlers[self._selectedKnot][0] -= x;
                    self.spline.previousHandlers[self._selectedKnot][1] -= y;
                    self.frontView.updateSpline(true);
                    self.topView.updateSpline(true);
                    self.hasSplineUpdated = true;
                    self.flow._updateLength();
                }
            };
        }
    },

    moveHandlerButtonAction: {
        value: function () {
            var self = this;

            this.topView.isDrawingHandlers = this.frontView.isDrawingHandlers = true;
            this.topView.isHighlightingCloserHandler = this.frontView.isHighlightingCloserHandler = true;
            this.topView.mousedownDelegate =
            this.frontView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (handler !== null) {
                    self._selectedHandler = handler;
                    self._selectedHandlerType = type;
                    return false;
                } else {
                    self._selectedHandler = null;
                    return true;
                }
            };
            this.topView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (self._selectedHandler !== null) {
                    if (self._selectedHandlerType === "next") {
                        var sX = self.spline.nextHandlers[self._selectedHandler][0] - x,
                            sY = self.spline.nextHandlers[self._selectedHandler][2] - y,
                            tmp;

                        tmp = self.spline.knots[self._selectedHandler];
                        self.spline.previousHandlers[self._selectedHandler][0] = tmp[0] * 2 - sX;
                        self.spline.previousHandlers[self._selectedHandler][2] = tmp[2] * 2 - sY;
                        self.spline.nextHandlers[self._selectedHandler][0] = sX
                        self.spline.nextHandlers[self._selectedHandler][2] = sY;
                        self.frontView.updateSpline(true);
                        self.topView.updateSpline(true);
                        self.hasSplineUpdated = true;
                        self.flow._updateLength();
                    } else {
                        var sX = self.spline.previousHandlers[self._selectedHandler][0] - x,
                            sY = self.spline.previousHandlers[self._selectedHandler][2] - y,
                            tmp;

                        tmp = self.spline.knots[self._selectedHandler];
                        self.spline.nextHandlers[self._selectedHandler][0] = tmp[0] * 2 - sX;
                        self.spline.nextHandlers[self._selectedHandler][2] = tmp[2] * 2 - sY;
                        self.spline.previousHandlers[self._selectedHandler][0] = sX
                        self.spline.previousHandlers[self._selectedHandler][2] = sY;
                        self.frontView.updateSpline(true);
                        self.topView.updateSpline(true);
                        self.hasSplineUpdated = true;
                        self.flow._updateLength();
                    }
                }
            };
            this.frontView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (self._selectedHandler !== null) {
                    if (self._selectedHandlerType === "next") {
                        var sX = self.spline.nextHandlers[self._selectedHandler][0] - x,
                            sY = self.spline.nextHandlers[self._selectedHandler][1] - y,
                            tmp;

                        tmp = self.spline.knots[self._selectedHandler];
                        self.spline.previousHandlers[self._selectedHandler][0] = tmp[0] * 2 - sX;
                        self.spline.previousHandlers[self._selectedHandler][1] = tmp[1] * 2 - sY;
                        self.spline.nextHandlers[self._selectedHandler][0] = sX
                        self.spline.nextHandlers[self._selectedHandler][1] = sY;
                        self.frontView.updateSpline(true);
                        self.topView.updateSpline(true);
                        self.hasSplineUpdated = true;
                        self.flow._updateLength();
                    } else {
                        var sX = self.spline.previousHandlers[self._selectedHandler][0] - x,
                            sY = self.spline.previousHandlers[self._selectedHandler][1] - y,
                            tmp;

                        tmp = self.spline.knots[self._selectedHandler];
                        self.spline.nextHandlers[self._selectedHandler][0] = tmp[0] * 2 - sX;
                        self.spline.nextHandlers[self._selectedHandler][1] = tmp[1] * 2 - sY;
                        self.spline.previousHandlers[self._selectedHandler][0] = sX
                        self.spline.previousHandlers[self._selectedHandler][1] = sY;
                        self.frontView.updateSpline(true);
                        self.topView.updateSpline(true);
                        self.hasSplineUpdated = true;
                        self.flow._updateLength();
                    }
                }
            };
        }
    },

    cameraButtonAction: {
        value: function () {
            var self = this;

            this.topView.mousedownDelegate =
            this.frontView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                return false;
            };
            this.topView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                self.cameraPosition = [
                    self.cameraPosition[0] - x,
                    self.cameraPosition[1],
                    self.cameraPosition[2] - y
                ];
            };
            this.frontView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                self.cameraPosition = [
                    self.cameraPosition[0] - x,
                    self.cameraPosition[1] - y,
                    self.cameraPosition[2]
                ];
            };
        }
    },

    weightButtonAction: {
        value: function () {
            var self = this;

            this.topView.isDrawingDensities = this.frontView.isDrawingDensities = true;
            this.topView.isHighlightingCloserKnot = this.frontView.isHighlightingCloserKnot = true;
            this.topView.mousedownDelegate =
            this.frontView.mousedownDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (knot !== null) {
                    self._selectedKnot = knot;
                    return false;
                } else {
                    self._selectedKnot = null;
                    return true;
                }
            };
            this.frontView.mousemoveDelegate =
            this.topView.mousemoveDelegate = function (x, y, knot, handler, type, isScrolling) {
                if (self._selectedKnot !== null) {
                    self.spline.densities[self._selectedKnot] += y * self.frontView._scale / 20;
                    if (self.spline.densities[self._selectedKnot] < 0.05) {
                        self.spline.densities[self._selectedKnot] = 0.05;
                    }
                    self.frontView.updateSpline(true);
                    self.topView.updateSpline(true);
                    self.hasSplineUpdated = true;
                    self.flow._updateLength();
                }
            };
        }
    },

    parametersButtonAction: {
        value: function () {
            this.parametersEditor.style.display = "block";
            this.frontView.element.style.display =
            this.topView.element.style.display = "none";
        }
    },*/

    spline: {
        value: null
    },

/*    _centralX: {
        enumerable: false,
        value: 0
    },

    centralX: {
        get: function () {
            return this._centralX;
        },
        set: function (value) {
            this._centralX = value;
        }
    },

    _centralY: {
        enumerable: false,
        value: 0
    },

    centralY: {
        get: function () {
            return this._centralY;
        },
        set: function (value) {
            this._centralY = value;
        }
    },

    _centralZ: {
        enumerable: false,
        value: 0
    },

    centralZ: {
        get: function () {
            return this._centralZ;
        },
        set: function (value) {
            this._centralZ = value;
        }
    },

    scale: {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
        }
    },

    _scale: {
        enumerable: false,
        value: .2
    },

    scale: {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
        }
    },

    handleResize: {
        enumerable: false,
        value: function () {
            this.needsDraw = true;
        }
    },*/

    convertFlowToShape: {
        value: function () {
            var bezier, shape, spline, i, k, j, knot,
                paths = this.object.getObjectProperty("paths"),
                canvasShape,
                grid = Grid.create().init(),
                canvasGrid = CanvasGrid.create().initWithData(grid),
                cross = CanvasCross.create().initWithData(Cross.create()),
                camera = Camera.create();

            cross.zIndex = 2;
            this.camera = CanvasCamera.create().initWithData(camera);
            canvasGrid.children = [];
            canvasGrid.children.push(cross);
            canvasGrid.children.push(this.camera);
            grid.pushShape(camera);
            grid.isSelectionEnabled =
                this.object.getObjectProperty("isSelectionEnabled") ? true : false;
            grid.hasSelectedIndexScrolling =
                this.object.getObjectProperty("hasSelectedIndexScrolling") ? true : false;
            grid.scrollingTransitionTimingFunction =
                this.object.getObjectProperty("scrollingTransitionTimingFunction") ?
                this.object.getObjectProperty("scrollingTransitionTimingFunction") : "ease";
            grid.scrollingTransitionDuration =
                this.object.getObjectProperty("scrollingTransitionDuration") ?
                this.object.getObjectProperty("scrollingTransitionDuration") : 500;
            for (j = 0; j < paths.length; j++) {
                canvasShape = CanvasFlowSpline.create();
                shape = FlowSpline.create().init();
                canvasShape.data = shape;
                spline = paths[j];
                shape.headOffset = spline.headOffset;
                shape.tailOffset = spline.tailOffset;
                for (i = 0; i < spline.knots.length - 1; i++) {
                    bezier = BezierCurve.create().init();
                    bezier.pushControlPoint(knot = FlowKnot.create().initWithCoordinates([
                        spline.knots[i].knotPosition[0],
                        spline.knots[i].knotPosition[1],
                        spline.knots[i].knotPosition[2]
                    ]));
                    for (k in spline.units) {
                        if (typeof spline.knots[i][k] !== "undefined") {
                            knot[k] = spline.knots[i][k];
                        }
                    }
                    if (typeof spline.knots[i].previousDensity !== "undefined") {
                        knot.density = spline.knots[i].previousDensity;
                    }
                    bezier.pushControlPoint(Vector3.create().initWithCoordinates([
                        spline.knots[i].nextHandlerPosition[0],
                        spline.knots[i].nextHandlerPosition[1],
                        spline.knots[i].nextHandlerPosition[2]
                    ]));
                    bezier.pushControlPoint(Vector3.create().initWithCoordinates([
                        spline.knots[i + 1].previousHandlerPosition[0],
                        spline.knots[i + 1].previousHandlerPosition[1],
                        spline.knots[i + 1].previousHandlerPosition[2]
                    ]));
                    bezier.pushControlPoint(knot = FlowKnot.create().initWithCoordinates([
                        spline.knots[i + 1].knotPosition[0],
                        spline.knots[i + 1].knotPosition[1],
                        spline.knots[i + 1].knotPosition[2]
                    ]));
                    for (k in spline.units) {
                        if (typeof spline.knots[i + 1][k] !== "undefined") {
                            knot[k] = spline.knots[i + 1][k];
                        }
                    }
                    if (typeof spline.knots[i + 1].previousDensity !== "undefined") {
                        knot.density = spline.knots[i + 1].previousDensity;
                    }
                    shape.pushBezierCurve(bezier);
                }
                canvasGrid.children.push(canvasShape);
                grid.pushShape(shape);
            }
            if (typeof this.object.getObjectProperty("cameraPosition") !== "undefined") {
                this.camera.data.cameraPosition = this.object.getObjectProperty("cameraPosition")
            } else {
                this.camera.data.cameraPosition = Object.clone(Flow._cameraPosition);
            }
            if (typeof this.object.getObjectProperty("cameraTargetPoint") !== "undefined") {
                this.camera.data.cameraTargetPoint = this.object.getObjectProperty("cameraTargetPoint")
            } else {
                this.camera.data.cameraTargetPoint = Object.clone(Flow._cameraTargetPoint);
            }
            if (typeof this.object.getObjectProperty("cameraFov") !== "undefined") {
                this.camera.data.cameraFov = this.object.getObjectProperty("cameraFov")
            } else {
                this.camera.data.cameraFov = Object.clone(Flow._cameraFov);
            }
            this.viewport.scene = canvasGrid;
            var self = this,
                updated = function (event) {self.handleSceneUpdated(event)};
            this.viewport.scene._data.addEventListener("vectorChange", updated, false);
            this.viewport.scene._data.addEventListener("bezierCurveChange", updated, false);
            this.viewport.scene._data.addEventListener("bezierSplineChange", updated, false);
            this.viewport.scene._data.addEventListener("cameraChange", updated, false);
            this.viewport.scene._data.addEventListener("sceneChange", updated, false);
            this.viewport.scene._data.addEventListener("selectionChange", updated, false);
        }
    },

    handleSceneUpdated: {
        value: function () {
            this.convertShapeToFlow();
        }
    },

    convertShapeToFlow: {
        value: function () {
            var shape, bezier, i, spline, j, k = 0,
                paths;

            this.object.editingDocument.setOwnedObjectProperty(this.object, "paths", []);
            paths = this.object.getObjectProperty("paths");
            this.object.editingDocument.setOwnedObjectProperty(
                this.object,
                "isSelectionEnabled",
                this.viewport.scene._data.isSelectionEnabled
            );
            this.object.editingDocument.setOwnedObjectProperty(
                this.object,
                "hasSelectedIndexScrolling",
                this.viewport.scene._data.hasSelectedIndexScrolling
            );
            this.object.editingDocument.setOwnedObjectProperty(
                this.object,
                "scrollingTransitionDuration",
                this.viewport.scene._data.scrollingTransitionDuration
            );
            this.object.editingDocument.setOwnedObjectProperty(
                this.object,
                "scrollingTransitionTimingFunction",
                this.viewport.scene._data.scrollingTransitionTimingFunction
            );
            for (j = 0; j < this.viewport.scene.children.length; j++) {
                shape = this.viewport.scene.children[j].data;
                if (shape.type === "FlowSpline") {
                    spline = paths[k];
                    if (!spline) {
                        paths.push({
                            knots: []
                        });
                        spline = paths[k];
                    }
                    if (!spline.units) {
                        spline.units = {};
                    }
                    spline.units.rotateX = "";
                    spline.units.rotateY = "";
                    spline.units.rotateZ = "";
                    spline.units.opacity = "";
                    spline.headOffset = shape.headOffset;
                    spline.tailOffset = shape.tailOffset;
                    for (i = 0; i < shape.length; i++) {
                        bezier = shape.getBezierCurve(i);
                        if (bezier.length === 4) {
                            if (!spline.knots[i]) {
                                spline.knots[i] = {};
                            }
                            if (!spline.knots[i].knotPosition) {
                                spline.knots[i].knotPosition = [];
                            }
                            if (!spline.knots[i].nextHandlerPosition) {
                                spline.knots[i].nextHandlerPosition = [];
                            }
                            if (!spline.knots[i].previousHandlerPosition) {
                                spline.knots[i].previousHandlerPosition = [];
                            }
                            if (!spline.knots[i].nextDensity) {
                                spline.knots[i].nextDensity = [];
                            }
                            if (!spline.knots[i].previousDensity) {
                                spline.knots[i].previousDensity = [];
                            }
                            spline.knots[i].knotPosition[0] = (bezier.getControlPoint(0).x);
                            spline.knots[i].knotPosition[1] = (bezier.getControlPoint(0).y);
                            spline.knots[i].knotPosition[2] = (bezier.getControlPoint(0).z);
                            spline.knots[i].nextHandlerPosition[0] = (bezier.getControlPoint(1).x);
                            spline.knots[i].nextHandlerPosition[1] = (bezier.getControlPoint(1).y);
                            spline.knots[i].nextHandlerPosition[2] = (bezier.getControlPoint(1).z);
                            spline.knots[i].rotateX = bezier.getControlPoint(0).rotateX;
                            spline.knots[i].rotateY = bezier.getControlPoint(0).rotateY;
                            spline.knots[i].rotateZ = bezier.getControlPoint(0).rotateZ;
                            spline.knots[i].opacity = bezier.getControlPoint(0).opacity;
                            spline.knots[i].nextDensity = bezier.getControlPoint(0).density;
                            spline.knots[i].previousDensity = bezier.getControlPoint(0).density;
                            if (!spline.knots[i + 1]) {
                                spline.knots[i + 1] = {
                                    knotPosition: [],
                                    nextHandlerPosition: [],
                                    previousHandlerPosition: [],
                                    nextDensity: 10,
                                    previousDensity: 10
                                };
                            }
                            spline.knots[i + 1].previousHandlerPosition[0] = (bezier.getControlPoint(2).x);
                            spline.knots[i + 1].previousHandlerPosition[1] = (bezier.getControlPoint(2).y);
                            spline.knots[i + 1].previousHandlerPosition[2] = (bezier.getControlPoint(2).z);
                            spline.knots[i + 1].knotPosition[0] = (bezier.getControlPoint(3).x);
                            spline.knots[i + 1].knotPosition[1] = (bezier.getControlPoint(3).y);
                            spline.knots[i + 1].knotPosition[2] = (bezier.getControlPoint(3).z);
                            spline.knots[i + 1].rotateX = bezier.getControlPoint(3).rotateX;
                            spline.knots[i + 1].rotateY = bezier.getControlPoint(3).rotateY;
                            spline.knots[i + 1].rotateZ = bezier.getControlPoint(3).rotateZ;
                            spline.knots[i + 1].opacity = bezier.getControlPoint(3).opacity;
                            spline.knots[i + 1].nextDensity = bezier.getControlPoint(3).density;
                            spline.knots[i + 1].previousDensity = bezier.getControlPoint(3).density;
                        }
                    }
                    k++;
                }
            }
            this.object.editingDocument.setOwnedObjectProperty(this.object, "paths", paths);
            this.object.editingDocument.setOwnedObjectProperty(this.object, "cameraPosition", []);
            this.object.editingDocument.setOwnedObjectProperty(this.object, "cameraPosition", this.camera.data.cameraPosition);
            this.object.editingDocument.setOwnedObjectProperty(this.object, "cameraTargetPoint", this.camera.data.cameraTargetPoint);
            this.object.editingDocument.setOwnedObjectProperty(this.object, "cameraFov", this.camera.data.cameraFov);
        }
    },

    /*handleSceneUpdated: {
        value: function () {
            this.convertShapeToFlow();
            this.selection = this.viewport.scene.getSelection()[0];
        }
    },*/

    enterDocument: {
        enumerable: false,
        value: function (firstTime) {
            if (firstTime) {
                this.convertFlowToShape();
                //this.viewport.scene.addEventListener("sceneUpdated", this, false);
            }
        }
    },

    willDraw: {
        enumerable: false,
        value: function () {
            /*this.frontView.width = this._element.offsetWidth;
            this.frontView.height = (this._element.offsetHeight - this.toolbar.element.offsetHeight - 1) >> 1;
            this.topView.width = this._element.offsetWidth;
            this.topView.height = this._element.offsetHeight - this.toolbar.element.offsetHeight - this.frontView.height - 1;*/
        }
    },

    draw: {
        enumerable: false,
        value: function () {
            //this.frontView.element.style.top = (this.topView.height + 1) + "px";
            /*this.removeClass(this._addButton, "selected");
            this.removeClass(this._moveButton, "selected");
            this.removeClass(this._weightButton, "selected");
            this.removeClass(this._zoomExtentsButton, "selected");
            this.addClass(this._selectedTool, "selected");*/

            /*this._frontViewContext.clearRect(0, 0, this._frontViewWidth, this._frontViewHeight);
            this._topViewContext.clearRect(0, 0, this._topViewWidth, this._topViewHeight);

            this._drawGrid(this._topViewContext, this._topViewWidth, this._topViewHeight, this._centerX, this._centerZ, this._scale, true);
            this._drawGrid(this._frontViewContext, this._frontViewWidth, this._frontViewHeight, this._centerX, this._centerY, this._scale, true);
            this._spline.transformMatrix = [
                this._scale, 0, 0, 0,
                0, 0, this._scale, 0,
                0, this._scale, 0, 0,
                this._topViewWidth / 2 - this.centerX * this._scale, this._topViewHeight / 2 - this.centerZ * this._scale, 0, 1
            ];
            this._spline.drawSpline(this._topViewContext);
            this._spline.drawKnots(this._topViewContext);
            if (this._selectedTool === this._weightButton) {
                this._spline.drawDensities(this._topViewContext);
            }
            if (this._drawHandlers) {
                this._spline.drawHandlers(this._topViewContext, [this._selectedKnot - 1, this._selectedKnot]);
            }
            this._spline.transformMatrix = [
                this._scale, 0, 0, 0,
                0, this._scale, 0, 0,
                0, 0, this._scale, 0,
                this._topViewWidth / 2 - this.centerX * this._scale, this._topViewHeight / 2 - this.centerY * this._scale, 0, 1
            ];
            this._spline.drawSpline(this._frontViewContext);
            this._spline.drawKnots(this._frontViewContext);
            if (this._selectedTool === this._weightButton) {
                this._spline.drawDensities(this._frontViewContext);
            }
            if (this._drawHandlers) {
                this._spline.drawHandlers(this._frontViewContext, [this._selectedKnot - 1, this._selectedKnot]);
            }*/
        }
    }

});