var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    Flow = require("montage/ui/flow.reel").Flow,
    FlowBezierSpline = require("montage/ui/flow.reel/flow-bezier-spline").FlowBezierSpline,
    PenToolMath = require("ui/pen-tool-math"),
    FlowKnot = require("ui/flow-spline-handlers").FlowKnot,
    Vector3 = PenToolMath.Vector3,
    BezierCurve = PenToolMath.CubicBezierCurve,
    Scene = PenToolMath.Scene,
    FlowSpline = require("ui/flow-spline").FlowSpline,
    CanvasFlowSpline = require("ui/flow-spline").CanvasFlowSpline,
    FlowHelix = require("ui/flow-helix").FlowHelix,
    CanvasFlowHelix = require("ui/flow-helix").CanvasFlowHelix,
    Grid = require("ui/grid").Grid,
    CanvasGrid = require("ui/grid").CanvasGrid,
    Camera = require("ui/camera").Camera,
    CanvasCamera = require("ui/camera").CanvasCamera,
    Cross = require("ui/cross").Cross,
    CanvasCross = require("ui/cross").CanvasCross,
    CanvasSplineAppendMark = require("ui/canvas-spline-append-mark").CanvasSplineAppendMark;

exports.Editor = Montage.create(Component, {

    flowEditorVersion: {
        value: 0.1
    },

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

    spline: {
        value: null
    },

    convertFlowToShape: {
        value: function () {
            var shape, spline, i, k, j, knot,
                paths = this.object.getObjectProperty("paths"),
                metadata = this.object.getObjectProperty("flowEditorMetadata"),
                grid = Grid.create().init(),
                canvasGrid = CanvasGrid.create().initWithData(grid),
                cross = CanvasCross.create().initWithData(Cross.create()),
                canvasSpline,
                camera = Camera.create().init(),
                iShape,
                specialPaths = {},
                canvasHelix;

            if (metadata) {
                if (metadata.flowEditorVersion <= this.flowEditorVersion) {
                    if (metadata.shapes) {
                        for (i = 0; i < metadata.shapes.length; i++) {
                            iShape = metadata.shapes[i];
                            switch (iShape.type) {
                                case "FlowHelix":
                                    if (typeof iShape.pathIndex !== "undefined") {
                                        specialPaths[iShape.pathIndex] = metadata.shapes[i];
                                    }
                                    break;
                            }
                        }
                    }
                } else {
                    // Could not parse metadata from newer versions of Flow Editor
                }
            }
            canvasGrid.appendMark = CanvasSplineAppendMark.create().initWithData(Vector3.create().initWithCoordinates([0, 0, 0]));
            cross.zIndex = 2;
            this.camera = CanvasCamera.create().initWithData(camera);
            canvasGrid.children = [];
            canvasGrid.children.push(cross);
            canvasGrid.children.push(this.camera);
            canvasGrid.children.push(canvasGrid.appendMark);
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
                if (!specialPaths[j]) {
                    shape = FlowSpline.create().init();
                    spline = paths[j];
                    shape.headOffset = spline.headOffset;
                    shape.tailOffset = spline.tailOffset;
                    canvasSpline = canvasGrid.appendFlowSpline(shape);
                    for (i = 0; i < spline.knots.length - 1; i++) {
                        if (!i) {
                            canvasSpline.appendControlPoint(knot = FlowKnot.create().initWithCoordinates([
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
                        }
                        canvasSpline.appendControlPoint(Vector3.create().initWithCoordinates([
                            spline.knots[i].nextHandlerPosition[0],
                            spline.knots[i].nextHandlerPosition[1],
                            spline.knots[i].nextHandlerPosition[2]
                        ]));
                        canvasSpline.appendControlPoint(Vector3.create().initWithCoordinates([
                            spline.knots[i + 1].previousHandlerPosition[0],
                            spline.knots[i + 1].previousHandlerPosition[1],
                            spline.knots[i + 1].previousHandlerPosition[2]
                        ]));
                        canvasSpline.appendControlPoint(knot = FlowKnot.create().initWithCoordinates([
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
                    }
                } else {
                    switch (specialPaths[j].type) {
                        case "FlowHelix":
                            canvasHelix = CanvasFlowHelix.create();
                            if (specialPaths[j].axisOriginPosition) {
                                canvasHelix._x = specialPaths[j].axisOriginPosition[0];
                                canvasHelix._y = specialPaths[j].axisOriginPosition[1];
                                canvasHelix._z = specialPaths[j].axisOriginPosition[2];
                            }
                            if (specialPaths[j].radius) {
                                canvasHelix.radius = specialPaths[j].radius;
                            }
                            if (specialPaths[j].density) {
                                canvasHelix.density = specialPaths[j].density;
                            }
                            if (specialPaths[j].pitch) {
                                canvasHelix.pitch = specialPaths[j].pitch;
                            }
                            if (specialPaths[j].segments) {
                                canvasHelix.segments = specialPaths[j].segments;
                            }
                            canvasHelix.update();
                            canvasGrid.children.push(canvasHelix);
                            grid.pushShape(canvasHelix._data);
                            break;
                    }
                }
            }
            if (typeof this.object.getObjectProperty("cameraPosition") !== "undefined") {
                this.camera.cameraPosition = this.object.getObjectProperty("cameraPosition")
            } else {
                this.camera.cameraPosition = Object.clone(Flow._cameraPosition);
            }
            if (typeof this.object.getObjectProperty("cameraTargetPoint") !== "undefined") {
                this.camera.cameraTargetPoint = this.object.getObjectProperty("cameraTargetPoint")
            } else {
                this.camera.cameraTargetPoint = Object.clone(Flow._cameraTargetPoint);
            }
            if (typeof this.object.getObjectProperty("cameraFov") !== "undefined") {
                this.camera.cameraFov = this.object.getObjectProperty("cameraFov")
            } else {
                this.camera.cameraFov = Object.clone(Flow._cameraFov);
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
            camera.translate([0, 0, 0]);
        }
    },

    _objectProperties: {
        value: {
            flowEditorMetadata: true,
            isSelectionEnabled: true,
            hasSelectedIndexScrolling: true,
            scrollingTransitionDuration: true,
            scrollingTransitionTimingFunction: true,
            paths: true,
            cameraPosition: true,
            cameraTargetPoint: true,
            cameraFov: true
        }
    },

    sceneWillChange: {
        value: function () {
            this._previousValues = this.object.editingDocument.getOwnedObjectProperties(this.object, this._objectProperties);
        }
    },

    sceneDidChange: {
        value: function () {
            this.object.editingDocument.setOwnedObjectProperties(this.object, this._objectProperties, this._previousValues);
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
                paths, n,
                pathIndex = 0;

            this._objectProperties.flowEditorMetadata = {
                flowEditorVersion: this.flowEditorVersion,
                shapes: []
            };
            for (j = 0; j < this.viewport.scene.children.length; j++) {
                shape = this.viewport.scene.children[j];
                switch (shape.type) {
                    case "FlowHelix":
                        this._objectProperties.flowEditorMetadata.shapes.push({
                            type: "FlowHelix",
                            pathIndex: pathIndex,
                            axisOriginPosition: [shape._x, shape._y, shape._z],
                            radius: shape.radius,
                            pitch: shape.pitch,
                            density: shape.density,
                            segments: shape.segments
                        });
                        pathIndex++;
                        break;
                    case "FlowSpline":
                        pathIndex++;
                        break;
                }
            }
            paths = [];
            this._objectProperties.isSelectionEnabled = this.viewport.scene._data.isSelectionEnabled;
            this._objectProperties.hasSelectedIndexScrolling = this.viewport.scene._data.hasSelectedIndexScrolling;
            this._objectProperties.scrollingTransitionDuration = this.viewport.scene._data.scrollingTransitionDuration;
            this._objectProperties.scrollingTransitionTimingFunction = this.viewport.scene._data.scrollingTransitionTimingFunction;
            for (j = 0; j < this.viewport.scene.children.length; j++) {
                shape = this.viewport.scene.children[j].data;
                if ((shape.type === "FlowSpline") || (shape.type === "FlowHelix")) {
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
                    n = 0;
                    for (i = 0; i < shape.length; i++) {
                        bezier = shape.getBezierCurve(i);
                        if (bezier.isComplete) {
                            if (!spline.knots[n]) {
                                spline.knots[n] = {};
                            }
                            if (!spline.knots[n].knotPosition) {
                                spline.knots[n].knotPosition = [];
                            }
                            if (!spline.knots[n].nextHandlerPosition) {
                                spline.knots[n].nextHandlerPosition = [];
                            }
                            if (!spline.knots[n].previousHandlerPosition) {
                                spline.knots[n].previousHandlerPosition = [];
                            }
                            if (!spline.knots[n].nextDensity) {
                                spline.knots[n].nextDensity = [];
                            }
                            if (!spline.knots[n].previousDensity) {
                                spline.knots[n].previousDensity = [];
                            }
                            spline.knots[n].knotPosition[0] = (bezier.getControlPoint(0).x);
                            spline.knots[n].knotPosition[1] = (bezier.getControlPoint(0).y);
                            spline.knots[n].knotPosition[2] = (bezier.getControlPoint(0).z);
                            spline.knots[n].nextHandlerPosition[0] = (bezier.getControlPoint(1).x);
                            spline.knots[n].nextHandlerPosition[1] = (bezier.getControlPoint(1).y);
                            spline.knots[n].nextHandlerPosition[2] = (bezier.getControlPoint(1).z);
                            spline.knots[n].rotateX = bezier.getControlPoint(0).rotateX;
                            spline.knots[n].rotateY = bezier.getControlPoint(0).rotateY;
                            spline.knots[n].rotateZ = bezier.getControlPoint(0).rotateZ;
                            spline.knots[n].opacity = bezier.getControlPoint(0).opacity;
                            spline.knots[n].nextDensity = bezier.getControlPoint(0).density;
                            spline.knots[n].previousDensity = bezier.getControlPoint(0).density;
                            if (!spline.knots[n + 1]) {
                                spline.knots[n + 1] = {
                                    knotPosition: [],
                                    nextHandlerPosition: [],
                                    previousHandlerPosition: [],
                                    nextDensity: 10,
                                    previousDensity: 10
                                };
                            }
                            spline.knots[n + 1].previousHandlerPosition[0] = (bezier.getControlPoint(2).x);
                            spline.knots[n + 1].previousHandlerPosition[1] = (bezier.getControlPoint(2).y);
                            spline.knots[n + 1].previousHandlerPosition[2] = (bezier.getControlPoint(2).z);
                            spline.knots[n + 1].knotPosition[0] = (bezier.getControlPoint(3).x);
                            spline.knots[n + 1].knotPosition[1] = (bezier.getControlPoint(3).y);
                            spline.knots[n + 1].knotPosition[2] = (bezier.getControlPoint(3).z);
                            spline.knots[n + 1].rotateX = bezier.getControlPoint(3).rotateX;
                            spline.knots[n + 1].rotateY = bezier.getControlPoint(3).rotateY;
                            spline.knots[n + 1].rotateZ = bezier.getControlPoint(3).rotateZ;
                            spline.knots[n + 1].opacity = bezier.getControlPoint(3).opacity;
                            spline.knots[n + 1].nextDensity = bezier.getControlPoint(3).density;
                            spline.knots[n + 1].previousDensity = bezier.getControlPoint(3).density;
                            n++;
                        }
                    }
                    k++;
                }
            }
            this._objectProperties.paths = paths;
            this._objectProperties.cameraPosition = this.camera.cameraPosition.slice(0);
            this._objectProperties.cameraTargetPoint = this.camera.cameraTargetPoint.slice(0);
            this._objectProperties.cameraFov = this.camera.cameraFov;
            this.object.setObjectProperties(this._objectProperties);
        }
    },

    enterDocument: {
        enumerable: false,
        value: function (firstTime) {
            if (firstTime) {
                this.convertFlowToShape();
            }
        }
    },

    willDraw: {
        enumerable: false,
        value: function () {
            if (!this.standAlone && !window.top.document.getElementsByTagName("iframe")[0].parentNode.component.currentMode) {
                window.top.document.getElementsByTagName("iframe")[0].parentNode.component.currentMode = 1;
            }
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