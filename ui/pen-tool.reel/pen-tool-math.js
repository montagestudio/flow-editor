var Montage = require("montage").Montage;

var Vector = exports.Vector = Montage.create(Montage, {

    init: {
        value: function () {
            this._coordinates = [];
            return this;
        }
    },

    initWithCoordinates: {
        value: function (coordinatesArray) {
            this.setCoordinates(coordinatesArray);
            return this;
        }
    },

    /**
        Internal array storing vector coordinates
    */
    _coordinates: {
        serializable: true,
        value: null
    },

    /**
        Length of the _coordinates array. Using "dimensions" instead of "length"
        to avoid confusion with vector magnitude that is also known as length
    */
    dimensions: {
        get: function () {
            return this._coordinates.length;
        }
    },

    /**
        Copy the provided array into the internal _coordinates array
    */
    setCoordinates: {
        value: function (coordinatesArray) {
            this._coordinates = coordinatesArray.slice(0);
        }
    },

    /**
        Sets coordinate at provided index to the provided value
    */
    setCoordinate: {
        value: function (index, value) {
            this._coordinates[index] = value;
        }
    },

    /**
        Returns coordinate at provided index
    */
    getCoordinate: {
        value: function (index) {
            return this._coordinates[index];
        }
    },

    /**
        Returns first coordinate
    */
    x: {
        serializable: false,
        get: function () {
            return this.getCoordinate(0);
        },
        set: function (value) {
            this.setCoordinate(0, value);
        }
    },

    /**
        Returns second coordinate
    */
    y: {
        serializable: false,
        get: function () {
            return this.getCoordinate(1);
        },
        set: function (value) {
            this.setCoordinate(1, value);
        }
    },

    /**
        Returns third coordinate
    */
    z: {
        serializable: false,
        get: function () {
            return this.getCoordinate(2);
        },
        set: function (value) {
            this.setCoordinate(2, value);
        }
    },

    /**
        Returns vector's euclidean magnitude
    */
    magnitude: {
        serializable: false,
        get: function () {
            var dimensions = this.dimensions,
                squaredMagnitude = 0,
                iCoordinate,
                i;

            for (i = 0; i < dimensions; i++) {
                iCoordinate = this.getCoordinate(i);
                squaredMagnitude += iCoordinate * iCoordinate;
            }
            return Math.sqrt(squaredMagnitude);
        }
    },

    /**
        In-place vector normalization. No division by zero check performed
    */
    normalize: {
        value: function () {
            this.divide(this.magnitude);
        }
    },

    /**
        In-place addition of provided vector. Dimensions are assumed to be the same,
        no checking is done in this function
    */
    add: {
        value: function (vector) {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, this.getCoordinate(i) + vector.getCoordinate(i));
            }
        }
    },

    /**
        In-place subtraction of provided vector. Dimensions are assumed to be the same,
        no checking is done in this function
    */
    subtract: {
        value: function (vector) {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, this.getCoordinate(i) - vector.getCoordinate(i));
            }
        }
    },

    /**
        In-place negation of vector coordinates
    */
    negate: {
        value: function () {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, -this.getCoordinate(i));
            }
        }
    },

    /**
        In-place vector multiplication by provided scalar
    */
    multiply: {
        value: function (scalar) {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, this.getCoordinate(i) * scalar);
            }
        }
    },

    /**
        In-place vector division by provided scalar. No division by zero check performed
    */
    divide: {
        value: function (scalar) {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, this.getCoordinate(i) / scalar);
            }
        }
    },

    /**
        Returns dot product of self vector with provided vector. Dimensions are assumed
        to be the same, no checking is done in this function
    */
    dot: {
        value: function (vector) {
            var dimensions = this.dimensions,
                dot = 0,
                i;

            for (i = 0; i < dimensions; i++) {
                dot += this.getCoordinate(i) * vector.getCoordinate(i);
            }
            return dot;
        }
    },

    /**
        Returns a copy of self vector
    */
    clone: {
        value: function () {
            return Montage.create(Vector).initWithCoordinates(this._coordinates);
        }
    }
});

var Vector2 = exports.Vector2 = Montage.create(Vector, {

    init: {
        value: function () {
            this._coordinates = [0, 0];
            return this;
        }
    },

    /**
        Coordinates array expected to be of length 2
    */
    initWithCoordinates: {
        value: function (coordinatesArray) {
            this._coordinates = [];
            this.setCoordinates(coordinatesArray);
            return this;
        }
    },

    /**
        Using "dimensions" instead of "length" to avoid confusion with
        vector magnitude that is also known as length
    */
    dimensions: {
        serializable: false,
        value: 2
    },

    /**
        Copy the provided array into the internal _coordinates array
        Provided array expected to be of length 2
    */
    setCoordinates: {
        value: function (coordinatesArray) {
            this._coordinates[0] = coordinatesArray[0];
            this._coordinates[1] = coordinatesArray[1];
        }
    },

    /**
        Returns first coordinate
    */
    x: {
        serializable: false,
        get: function () {
            return this._coordinates[0];
        },
        set: function (value) {
            this._coordinates[0] = value;
        }
    },

    /**
        Returns second coordinate
    */
    y: {
        serializable: false,
        get: function () {
            return this._coordinates[1];
        },
        set: function (value) {
            this._coordinates[1] = value;
        }
    },

    /**
        Returns vector's euclidean magnitude
    */
    magnitude: {
        serializable: false,
        get: function () {
            return Math.sqrt(
                this._coordinates[0] * this._coordinates[0] +
                this._coordinates[1] * this._coordinates[1]
            );
        }
    },

    /**
        In-place addition of provided vector. Vector2 type expected as parameter
    */
    add: {
        value: function (vector2) {
            this._coordinates[0] += vector2._coordinates[0];
            this._coordinates[1] += vector2._coordinates[1];
        }
    },

    /**
        In-place subtraction of provided vector. Vector2 type expected as parameter
    */
    subtract: {
        value: function (vector2) {
            this._coordinates[0] -= vector2._coordinates[0];
            this._coordinates[1] -= vector2._coordinates[1];
        }
    },

    /**
        In-place negation of vector coordinates
    */
    negate: {
        value: function () {
            this._coordinates[0] = -this._coordinates[0];
            this._coordinates[1] = -this._coordinates[1];
        }
    },

    /**
        In-place vector multiplication by provided scalar
    */
    multiply: {
        value: function (scalar) {
            this._coordinates[0] *= scalar;
            this._coordinates[1] *= scalar;
        }
    },

    /**
        In-place vector division by provided scalar. No division by zero check performed
    */
    divide: {
        value: function (scalar) {
            this._coordinates[0] /= scalar;
            this._coordinates[1] /= scalar;
        }
    },

    /**
        Returns dot product of self vector with provided vector.
        Vector2 type expected as parameter
    */
    dot: {
        value: function (vector2) {
            return (
                this._coordinates[0] * vector2._coordinates[0] +
                this._coordinates[1] * vector2._coordinates[1]
            );
        }
    },

    /**
        In-place CCW rotation by a given angle in radians
    */
    rotate: {
        value: function (angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                tmp = this._coordinates[0];

            this._coordinates[0] = this._coordinates[0] * cos - this._coordinates[1] * sin;
            this._coordinates[1] = this._coordinates[1] * cos + tmp * sin;
        }
    },

    /**
        In-place matrix transform. It takes a 2 rows by 3 colums matrix linearized as
        an array in the same format as CSS 2d transform matrix (column-major order)
    */
    transform: {
        value: function (matrix) {
            var tmp = this._coordinates[0];

            this._coordinates[0] =
                this._coordinates[0] * matrix[0] +
                this._coordinates[1] * matrix[2] +
                matrix[4];
            this._coordinates[1] =
                tmp * matrix[1] +
                this._coordinates[1] * matrix[3] +
                matrix[5];
        }
    }
});

var Vector3 = exports.Vector3 = Montage.create(Vector, {

    init: {
        value: function () {
            this._coordinates = [0, 0, 0];
            return this;
        }
    },

    /**
        Coordinates array expected to be of length 3
    */
    initWithCoordinates: {
        value: function (coordinatesArray) {
            this._coordinates = [];
            this.setCoordinates(coordinatesArray);
            return this;
        }
    },

    /**
        Using "dimensions" instead of "length" to avoid confusion with
        vector magnitude that is also known as length
    */
    dimensions: {
        serializable: false,
        value: 3
    },

    /**
        Copy the provided array into the internal _coordinates array
        Provided array expected to be of length 2
    */
    setCoordinates: {
        value: function (coordinatesArray) {
            this._coordinates[0] = coordinatesArray[0];
            this._coordinates[1] = coordinatesArray[1];
            this._coordinates[2] = coordinatesArray[2];
        }
    },

    /**
        Returns first coordinate
    */
    x: {
        serializable: false,
        get: function () {
            return this._coordinates[0];
        },
        set: function (value) {
            this._coordinates[0] = value;
        }
    },

    /**
        Returns second coordinate
    */
    y: {
        serializable: false,
        get: function () {
            return this._coordinates[1];
        },
        set: function (value) {
            this._coordinates[1] = value;
        }
    },

    /**
        Returns third coordinate
    */
    z: {
        serializable: false,
        get: function () {
            return this._coordinates[2];
        },
        set: function (value) {
            this._coordinates[2] = value;
        }
    },

    /**
        Returns vector's euclidean magnitude
    */
    magnitude: {
        serializable: false,
        get: function () {
            return Math.sqrt(
                this._coordinates[0] * this._coordinates[0] +
                this._coordinates[1] * this._coordinates[1] +
                this._coordinates[2] * this._coordinates[2]
            );
        }
    },

    /**
        In-place addition of provided vector. Vector3 type expected as parameter
    */
    add: {
        value: function (vector3) {
            this._coordinates[0] += vector3._coordinates[0];
            this._coordinates[1] += vector3._coordinates[1];
            this._coordinates[2] += vector3._coordinates[2];
        }
    },

    /**
        In-place subtraction of provided vector. Vector3 type expected as parameter
    */
    subtract: {
        value: function (vector3) {
            this._coordinates[0] -= vector3._coordinates[0];
            this._coordinates[1] -= vector3._coordinates[1];
            this._coordinates[2] -= vector3._coordinates[2];
        }
    },

    /**
        In-place negation of vector coordinates
    */
    negate: {
        value: function () {
            this._coordinates[0] = -this._coordinates[0];
            this._coordinates[1] = -this._coordinates[1];
            this._coordinates[2] = -this._coordinates[2];
        }
    },

    /**
        In-place vector multiplication by provided scalar
    */
    multiply: {
        value: function (scalar) {
            this._coordinates[0] *= scalar;
            this._coordinates[1] *= scalar;
            this._coordinates[2] *= scalar;
        }
    },

    /**
        In-place vector division by provided scalar. No division by zero check performed
    */
    divide: {
        value: function (scalar) {
            this._coordinates[0] /= scalar;
            this._coordinates[1] /= scalar;
            this._coordinates[2] /= scalar;
        }
    },

    /**
        In-place cross product by provided vector. Vector3 type expected as parameter
    */
    cross: {
        value: function (vector3) {
            var tmpX = this._coordinates[0],
                tmpY = this._coordinates[1];

            this._coordinates[0] =
                this._coordinates[1] * vector3._coordinates[2] -
                this._coordinates[2] * vector3._coordinates[1];
            this._coordinates[1] =
                this._coordinates[2] * vector3._coordinates[0] -
                tmpX * vector3._coordinates[2];
            this._coordinates[2] =
                tmpX * vector3._coordinates[1] -
                tmpY * vector3._coordinates[0];
        }
    },

    /**
        Returns dot product of self vector with provided vector.
        Vector3 type expected as parameter
    */
    dot: {
        value: function (vector3) {
            return (
                this._coordinates[0] * vector3._coordinates[0] +
                this._coordinates[1] * vector3._coordinates[1] +
                this._coordinates[2] * vector3._coordinates[2]
            );
        }
    },

    /**
        In-place rotation around axis X by a given angle in radians.
        It follows CCW rotation pattern found in CSS 3d transforms
    */
    rotateX: {
        value: function (angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                tmp = this._coordinates[1];

            this._coordinates[1] = this._coordinates[1] * cos - this._coordinates[2] * sin;
            this._coordinates[2] = this._coordinates[2] * cos + tmp * sin;
        }
    },

    /**
        In-place rotation around axis Y by a given angle in radians.
        It follows CCW rotation pattern found in CSS 3d transforms
    */
    rotateY: {
        value: function (angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                tmp = this._coordinates[0];

            this._coordinates[0] = this._coordinates[0] * cos + this._coordinates[2] * sin;
            this._coordinates[2] = this._coordinates[2] * cos - tmp * sin;
        }
    },

    /**
        In-place rotation around axis Z by a given angle in radians.
        It follows CCW rotation pattern found in CSS 3d transforms
    */
    rotateZ: {
        value: function (angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                tmp = this._coordinates[0];

            this._coordinates[0] = this._coordinates[0] * cos - this._coordinates[1] * sin;
            this._coordinates[1] = this._coordinates[1] * cos + tmp * sin;
        }
    }
});

var BezierCurve = exports.BezierCurve = Montage.create(Montage, {

    init: {
        value: function () {
            this._controlPoints = [];
            return this;
        }
    },

    /**
        Internal array for control points storage
    */
    _controlPoints: {
        value: null
    },

    /**
        Number of control points not including starting point.
        Linear: order 1, quadratic: order 2, cubic: order 3...
        It will return -1 when no control points are set
    */
    order: {
        get: function () {
            return this._controlPoints.length - 1;
        }
    },

    /**
        Inserts the provided vector at the end of
        the control points array
    */
    pushControlPoint: {
        value: function (vector) {
            this._controlPoints.push(vector);
        }
    },

    /**
        Returns removed vector control point from
        the end of the controls points array
    */
    popControlPoint: {
        value: function () {
            return this._controlPoints.pop();
        }
    },

    /**
        Returns vector control point at the given index
    */
    getControlPoint: {
        value: function (index) {
            return this._controlPoints[index];
        }
    },

    /**
        Sets the given vector at the given index position in
        the control points array
    */
    setControlPoint: {
        value: function (index, vector) {
            this._controlPoints[index] = vector;
        }
    },

    /**
        Evaluates Bezier curve at t with De Casteljau's algorithm
        and returns a vector with the resulting coordinates
    */
    value: {
        value: function (t) {
            var order = this.order,
                i, j, n, m,
                k = 1 - t,
                intermediateValues = [],
                dimensions = this.getControlPoint(0).dimensions,
                currentPoint, nextPoint = this.getControlPoint(0);

            for (i = 1; i <= order; i++) {
                currentPoint = nextPoint;
                nextPoint = this.getControlPoint(i);
                for (n = 0; n < dimensions; n++) {
                    intermediateValues.push(
                        currentPoint.getCoordinate(n) * k +
                        nextPoint.getCoordinate(n) * t
                    );
                }
            }
            for (j = order - 1; j > 0; j--) {
                m = 0;
                for (i = 0; i < j; i++) {
                    for (n = 0; n < dimensions; n++) {
                        intermediateValues[m] =
                            intermediateValues[m] * k +
                            intermediateValues[m + dimensions] * t;
                        m++;
                    }
                }
            }
            return Montage.create(Vector).initWithCoordinates(
                intermediateValues.slice(0, dimensions)
            );
        }
    }
});
