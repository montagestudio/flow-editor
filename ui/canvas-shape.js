var Montage = require("montage").Montage,
    Target = require("montage/core/target").Target;

exports.CanvasShape = Montage.create(Target, {

    didCreate: {
        value: function () {

        }
    },

    children: {
        value: []
    },

    hasChild: {
        value: function (shape) {
            var children = this.children,
                length = children.length,
                i;

            for (i = 0; i < length; i++) {
                if (shape.data === children[i].data) {
                    return true;
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
            // this.addOwnPropertyChangeListener("_data", function(plus, minus, index) {
            //     //console.log("addOwnPropertyChangeListener plus:",plus,"minus:", minus,"index:", index)
            // })
            this._data = value;
            // if(this._data && this._data._data && this._data._data.length) {
            //     console.log(this._data)
            //     this._data.addRangeAtPathChangeListener("_data", function(plus, minus, index) {
            //         //console.log("addRangeAtPathChangeListener plus:",plus,"minus:", minus,"index:", index)
            //     })
            // }

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
        value: function (selection) {
            var s = selection ? selection : [],
                children = this.children,
                length = children.length,
                i;

            for (i = 0; i < length; i++) {
                children[i].getSelection(s);
            }
            if (this.isSelected) {
                s.push(this);
            }
            if (!selection) {
                //console.log(s[0] ? s[0]._data.type : "no selection");
                return s;
            }
        }
    },

    findSelectedShape: {
        value: function (x, y, transformMatrix) {
            var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                children = this.children,
                length = children.length,
                result,
                i;

            if (this.pointOnShape && this.pointOnShape(x, y, transform)) {
                return this;
            }
            children.sort(function (a, b) {
                return b.zIndex - a.zIndex;
            });
            for (i = 0; i < length; i++) {
                result = children[i].findSelectedShape(x, y, transform);
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
            var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                children = this.children,
                length = children.length,
                result,
                i;

            if (length) {
                children.sort(function (a, b) {
                    return b.zIndex - a.zIndex;
                });
                for (i = 0; i < length; i++) {
                    result = children[i].findSelectedLeaf(x, y, transform);
                    if (result) {
                        return result;
                    }
                }
            }
            // else {
                if (this.pointOnShape && this.pointOnShape(x, y, transform)) {
                    return this;
                }
            //}
            return null;
        }
    },

    draw: {
        value: function (transformMatrix) {
            var transform = this.getTransform ? this.getTransform(transformMatrix) : transformMatrix,
                children = this.children,
                length = children.length,
                i;

            if (this.drawSelf) {
                this.drawSelf(transform);
            }
            children.sort(function (a, b) {
                return a.zIndex - b.zIndex;
            });
            for (i = 0; i < length; i++) {
                children[i].canvas = this.canvas;
                children[i].draw(transform);
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

    _isSelected: {
        value: false
    },

    isSelected: {
        get: function () {
            return this._data._isSelected;
        },
        set: function (value) {
            this._data._isSelected = value;
            this.needsDraw = true;
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
    }

});