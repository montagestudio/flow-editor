var Montage = require("montage").Montage,
    Target = require("montage/core/target").Target;

exports.CanvasShape = Montage.create(Target, {

    didCreate: {
        value: function () {
            this.children = [];
        }
    },

    children: {
        value: null
    },

    appendChild: {
        value: function (canvasShape) {
            this.children.push(canvasShape);
            if (this._data) {
                this._data.dispatchEventNamed("sceneChange");
            }
        }
    },

    insertChildAtStart: {
        value: function (canvasShape) {
            this.children.splice(0, 0, canvasShape);
            if (this._data) {
                this._data.dispatchEventNamed("sceneChange");
            }
        }
    },

    deleteChild: {
        value: function (index) {
            this.children.splice(index, 1);
            this._data.dispatchEventNamed("sceneChange", true, true);
            this._data.dispatchEventNamed("selectionChange", true, true);
        }
    },

    hasChild: {
        value: function (shape) {
            var children = this.children,
                length = children.length,
                i;

            for (i = 0; i < length; i++) {
                if (shape.data === children[i].data) {
                    return [i];
                }
            }
            return false;
        }
    },

    bindings: {
        value: null
    },

    zIndex: {
        value: 0
    },

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

    initWithData: {
        value: function (data) {
            this.data = data;
            return this;
        }
    },

    _canvas: {
        value: null
    },

    _context: {
        value: null
    },

    canvas: {
        get: function () {
            return this._canvas;
        },
        set: function (value) {
            var children = this.children,
                length = children.length,
                i;

            this._canvas = value;
            if (value) {
                this._context = value.getContext("2d");
            } else {
                this._context = null;
            }
            for (i = 0; i < length; i++) {
                children[i].canvas = value;
            }
        }
    },

    getSelection: {
        value: function (scene, selection) {
            var s = selection ? selection : [],
                children = this.children,
                length = children.length,
                i;

            for (i = 0; i < length; i++) {
                children[i].getSelection(scene, s);
            }
            if (this.isSelected) {
                s.push(this);
            }
            if (!selection) {
                //console.log(s[0] ? s[0]._data.type : "no selection");
                if (!s[0]) {
                    return [scene];
                }
                return s;
            }
        }
    },

    sortByZIndex: {
        value: function (a, b) {
            if (b.isSelected && !a.isSelected) {
                return 1;
            }
            if (!b.isSelected && a.isSelected) {
                return -1;
            }
            return b.zIndex - a.zIndex;
        }
    },

    sortByReversedZIndex: {
        value: function (a, b) {
            if (b.isSelected && !a.isSelected) {
                return -1;
            }
            if (!b.isSelected && a.isSelected) {
                return 1;
            }
            return a.zIndex - b.zIndex;
        }
    },

    sortedChildrenIndexesBy: {
        value: function (sortingMethod) {
            var result = [],
                children = this.children,
                length = children.length,
                i;

            for (i = 0; i < length; i++) {
                result[i] = {
                    zIndex: children[i].zIndex,
                    isSelected: children[i].isSelected,
                    index: i
                }
            }
            result.sort(sortingMethod);
            return result;
        }
    },

    findSelectedShape: {
        value: function (x, y, transformMatrix) {
            var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                children = this.children,
                length = children.length,
                sortedIndexes,
                result,
                i;

            if (this.pointOnShape && this.pointOnShape(x, y, transform)) {
                return this;
            }
            sortedIndexes = this.sortedChildrenIndexesBy(this.sortByZIndex);
            for (i = 0; i < length; i++) {
                result = children[sortedIndexes[i].index].findSelectedShape(x, y, transform);
                if (result) {
                    return result;
                }
            }
            return null;
        }
    },

    findPathToNode: {
        value: function (node, path) {
            var p = path ? path : [],
                children = this.children,
                length = children.length,
                found = false,
                i;

            if (this.data === node.data) {
                p.push(this);
                found = true;
            } else {
                for (i = 0; i < length; i++) {
                    if (children[i].findPathToNode(node, p)) {
                        p.push(this);
                        found = true;
                    }
                }
            }
            if (!path) {
                return p;
            }
            return found;
        }
    },

    findSelectedLeaf: {
        value: function (x, y, transformMatrix) {
            if (this.isVisible) {
                var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                    children = this.children,
                    length = children.length,
                    sortedIndexes,
                    result,
                    i;

                if (length) {
                    sortedIndexes = this.sortedChildrenIndexesBy(this.sortByZIndex);
                    for (i = 0; i < length; i++) {
                        result = children[sortedIndexes[i].index].findSelectedLeaf(x, y, transform);
                        if (result) {
                            return result;
                        }
                    }
                }
                if (this.pointOnShape && this.pointOnShape(x, y, transform)) {
                    return this;
                }
            }
            return null;
        }
    },

    findCloserShapeType: {
        value: function (type, x, y, transformMatrix) {
            var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                children = this.children,
                length = children.length,
                sortedIndexes,
                result,
                i;

            if (length) {
                sortedIndexes = this.sortedChildrenIndexesBy(this.sortByZIndex);
                for (i = 0; i < length; i++) {
                    result = children[sortedIndexes[i].index].findCloserShapeType(type, x, y, transform);
                    if (result) {
                        return result;
                    }
                }
            }
            if ((this._data) && (this._data.type === type) && this.pointOnShape && this.pointOnShape(x, y, transform)) {
                return this;
            }
            return null;
        }
    },

    draw: {
        value: function (transformMatrix) {
            if (this.isVisible) {
                var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                    children = this.children,
                    length = children.length,
                    sortedIndexes,
                    i;

                if (this.drawSelf) {
                    this.drawSelf(transform);
                }
                sortedIndexes = this.sortedChildrenIndexesBy(this.sortByReversedZIndex);
                for (i = 0; i < length; i++) {
                    children[sortedIndexes[i].index].canvas = this.canvas;
                    children[sortedIndexes[i].index].draw(transform);
                }
            }
        }
    },

    pointOnShape: {
        value: null
    },

    _color: {
        value: "black"
    },

    color: {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            this.needsDraw = true;
        }
    },

    _selectedColor: {
        value: "#07f"
    },

    selectedColor: {
        get: function () {
            return this._selectedColor;
        },
        set: function (value) {
            this._selectedColor = value;
            this.needsDraw = true;
        }
    },

    isSelected: {
        get: function () {
            if (this._data) {
                if (typeof this._data._isSelected !== "undefined") {
                    return this._data._isSelected;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        set: function (value) {
            if (this._data && (this._data._isSelected !== value) && this._data.dispatchEventNamed) {
                this._data._isSelected = value;
                this._data.dispatchEventNamed("selectionChange", true, true);
                this.needsDraw = true;
            }
        }
    },

    _isVisible: {
        value: true
    },

    isVisible: {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            if (this._isVisible !== value) {
                this._isVisible = value;
                if (this._data && this._data.dispatchEventNamed) {
                    this._data.dispatchEventNamed("visibilityChange", true, true);
                }
                this.needsDraw = true;
            }
        }
    },

    unselect: {
        value: function () {
            var children = this.children,
                length = children.length,
                i;

            this.isSelected = false;
            for (i = 0; i < length; i++) {
                children[i].unselect();
            }
        }
    },

    translate: {
        value: function (vector) {
            this.data.translate(vector);
        }
    },

    _pointToPointDistance: {
        value: function (x1, y1, x2, y2) {
            var dX = x1 - x2,
                dY = y1 - y2;

            return Math.sqrt(dX * dX + dY * dY);
        }
    },

    _distanceToSegment: {
        value: function (pX, pY, vX, vY, wX, wY) {
            var l = this._pointToPointDistance(vX, vY, wX, wY),
                t;

            if (l === 0) {
                return this._pointToPointDistance(pX, pY, vX, vY);
            }
            t = ((pX - vX) * (wX - vX) + (pY - vY) * (wY - vY)) / (l * l);
            if (t < 0) {
                return this._pointToPointDistance(pX, pY, vX, vY);
            }
            if (t > 1) {
                return this._pointToPointDistance(pX, pY, wX, wY);
            }
            return this._pointToPointDistance(
                pX, pY,
                vX + t * (wX - vX),
                vY + t * (wY - vY)
            );
        }
    }

});