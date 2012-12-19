var Montage = require("montage").Montage;

var MapReducible = exports.MapReducible = Montage.create(Montage, {

    init: {
        value: function () {
            this._data = [];
            return this;
        }
    },

    _data: {
        serializable: true,
        value: null
    },

    every: {
        value: function () {
            return this._data.every.apply(this._data, arguments);
        }
    },

    reduce: {
        value: function () {
            return this._data.reduce.apply(this._data, arguments);
        }
    },

    reduceRight: {
        value: function () {
            return this._data.reduceRight.apply(this._data, arguments);
        }
    },

    some: {
        value: function () {
            return this._data.some.apply(this._data, arguments);
        }
    },

    forEach: {
        value: function () {
            return this._data.forEach.apply(this._data, arguments);
        }
    },

    map: {
        value: function () {
            return this._data.map.apply(this._data, arguments);
        }
    },

    filter: {
        value: function () {
            return this._data.filter.apply(this._data, arguments);
        }
    }
});

var Vector = exports.Vector = Montage.create(MapReducible, {

    initWithCoordinates: {
        value: function (coordinatesArray) {
            this.setCoordinates(coordinatesArray);
            return this;
        }
    },

    /**
        Length of the _data array. Using "dimensions" instead of "length"
        to avoid confusion with vector magnitude that is also known as length
    */
    dimensions: {
        get: function () {
            return this._data.length;
        }
    },

    /**
        Copy the provided array into the internal _data array
    */
    setCoordinates: {
        value: function (coordinatesArray) {
            this._data = coordinatesArray.slice(0);
        }
    },

    /**
        Sets coordinate at provided index to the provided value
    */
    setCoordinate: {
        value: function (index, value) {
            this._data[index] = value;
        }
    },

    /**
        Returns coordinate at provided index
    */
    getCoordinate: {
        value: function (index) {
            return this._data[index];
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
            return Montage.create(Vector).initWithCoordinates(this._data);
        }
    },

    /**
        In-place translation by provided offsets array. Dimensions of self vector and
        length of provided array are assumed to be the same
    */
    translate: {
        value: function (offsetsArray) {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, this.getCoordinate(i) + offsetsArray[i]);
            }
        }
    },

    /**
        In-place scaling by provided factors array. Dimensions of self vector and
        length of provided array are assumed to be the same
    */
    scale: {
        value: function (factorsArray) {
            var dimensions = this.dimensions,
                i;

            for (i = 0; i < dimensions; i++) {
                this.setCoordinate(i, this.getCoordinate(i) * factorsArray[i]);
            }
        }
    }
});

var Vector2 = exports.Vector2 = Montage.create(Vector, {

    init: {
        value: function () {
            this._data = [0, 0];
            return this;
        }
    },

    /**
        Coordinates array expected to be of length 2
    */
    initWithCoordinates: {
        value: function (coordinatesArray) {
            this._data = [];
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
        Copy the provided array into the internal _data array
        Provided array expected to be of length 2
    */
    setCoordinates: {
        value: function (coordinatesArray) {
            this._data[0] = coordinatesArray[0];
            this._data[1] = coordinatesArray[1];
        }
    },

    /**
        Returns first coordinate
    */
    x: {
        serializable: false,
        get: function () {
            return this._data[0];
        },
        set: function (value) {
            this._data[0] = value;
        }
    },

    /**
        Returns second coordinate
    */
    y: {
        serializable: false,
        get: function () {
            return this._data[1];
        },
        set: function (value) {
            this._data[1] = value;
        }
    },

    /**
        Returns vector's euclidean magnitude
    */
    magnitude: {
        serializable: false,
        get: function () {
            return Math.sqrt(
                this._data[0] * this._data[0] +
                this._data[1] * this._data[1]
            );
        }
    },

    /**
        In-place addition of provided vector. Vector2 type expected as parameter
    */
    add: {
        value: function (vector2) {
            this._data[0] += vector2._data[0];
            this._data[1] += vector2._data[1];
        }
    },

    /**
        In-place subtraction of provided vector. Vector2 type expected as parameter
    */
    subtract: {
        value: function (vector2) {
            this._data[0] -= vector2._data[0];
            this._data[1] -= vector2._data[1];
        }
    },

    /**
        In-place negation of vector coordinates
    */
    negate: {
        value: function () {
            this._data[0] = -this._data[0];
            this._data[1] = -this._data[1];
        }
    },

    /**
        In-place vector multiplication by provided scalar
    */
    multiply: {
        value: function (scalar) {
            this._data[0] *= scalar;
            this._data[1] *= scalar;
        }
    },

    /**
        In-place vector division by provided scalar. No division by zero check performed
    */
    divide: {
        value: function (scalar) {
            this._data[0] /= scalar;
            this._data[1] /= scalar;
        }
    },

    /**
        Returns dot product of self vector with provided vector.
        Vector2 type expected as parameter
    */
    dot: {
        value: function (vector2) {
            return (
                this._data[0] * vector2._data[0] +
                this._data[1] * vector2._data[1]
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
                tmp = this._data[0];

            this._data[0] = this._data[0] * cos - this._data[1] * sin;
            this._data[1] = this._data[1] * cos + tmp * sin;
        }
    },

    /**
        In-place matrix transform. It takes a 2 rows by 3 colums matrix linearized as
        an array in the same format as CSS 2d transform matrix (column-major order)
    */
    transformMatrix: {
        value: function (matrix) {
            var tmp = this._data[0];

            this._data[0] =
                this._data[0] * matrix[0] +
                this._data[1] * matrix[2] +
                matrix[4];
            this._data[1] =
                tmp * matrix[1] +
                this._data[1] * matrix[3] +
                matrix[5];
        }
    },

    /**
        In-place translation by provided offsets array. Length of provided
        array is assumed to be 2
    */
    translate: {
        value: function (offsetsArray) {
            this._data[0] += offsetsArray[0];
            this._data[1] += offsetsArray[1];
        }
    },

    /**
        In-place scaling by provided factors array. Length of provided
        array is assumed to be 2
    */
    scale: {
        value: function (factorsArray) {
            this._data[0] *= factorsArray[0];
            this._data[1] *= factorsArray[1];
        }
    },

    /**
        In-place skewing x axis by provided angle (in radians)
    */
    skewX: {
        value: function (angle) {
            this._data[0] += this._data[1] * Math.tan(angle);
        }
    },

    /**
        In-place skewing y axis by provided angle (in radians)
    */
    skewY: {
        value: function (angle) {
            this._data[1] += this._data[0] * Math.tan(angle);
        }
    }
});

var Vector3 = exports.Vector3 = Montage.create(Vector, {

    init: {
        value: function () {
            this._data = [0, 0, 0];
            return this;
        }
    },

    /**
        Coordinates array expected to be of length 3
    */
    initWithCoordinates: {
        value: function (coordinatesArray) {
            this._data = [];
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
        Copy the provided array into the internal _data array
        Provided array expected to be of length 2
    */
    setCoordinates: {
        value: function (coordinatesArray) {
            this._data[0] = coordinatesArray[0];
            this._data[1] = coordinatesArray[1];
            this._data[2] = coordinatesArray[2];
        }
    },

    /**
        Returns first coordinate
    */
    x: {
        serializable: false,
        get: function () {
            return this._data[0];
        },
        set: function (value) {
            this._data[0] = value;
        }
    },

    /**
        Returns second coordinate
    */
    y: {
        serializable: false,
        get: function () {
            return this._data[1];
        },
        set: function (value) {
            this._data[1] = value;
        }
    },

    /**
        Returns third coordinate
    */
    z: {
        serializable: false,
        get: function () {
            return this._data[2];
        },
        set: function (value) {
            this._data[2] = value;
        }
    },

    /**
        Returns vector's euclidean magnitude
    */
    magnitude: {
        serializable: false,
        get: function () {
            return Math.sqrt(
                this._data[0] * this._data[0] +
                this._data[1] * this._data[1] +
                this._data[2] * this._data[2]
            );
        }
    },

    /**
        In-place addition of provided vector. Vector3 type expected as parameter
    */
    add: {
        value: function (vector3) {
            this._data[0] += vector3._data[0];
            this._data[1] += vector3._data[1];
            this._data[2] += vector3._data[2];
        }
    },

    /**
        In-place subtraction of provided vector. Vector3 type expected as parameter
    */
    subtract: {
        value: function (vector3) {
            this._data[0] -= vector3._data[0];
            this._data[1] -= vector3._data[1];
            this._data[2] -= vector3._data[2];
        }
    },

    /**
        In-place negation of vector coordinates
    */
    negate: {
        value: function () {
            this._data[0] = -this._data[0];
            this._data[1] = -this._data[1];
            this._data[2] = -this._data[2];
        }
    },

    /**
        In-place vector multiplication by provided scalar
    */
    multiply: {
        value: function (scalar) {
            this._data[0] *= scalar;
            this._data[1] *= scalar;
            this._data[2] *= scalar;
        }
    },

    /**
        In-place vector division by provided scalar. No division by zero check performed
    */
    divide: {
        value: function (scalar) {
            this._data[0] /= scalar;
            this._data[1] /= scalar;
            this._data[2] /= scalar;
        }
    },

    /**
        In-place cross product by provided vector. Vector3 type expected as parameter
    */
    cross: {
        value: function (vector3) {
            var tmpX = this._data[0],
                tmpY = this._data[1];

            this._data[0] =
                this._data[1] * vector3._data[2] -
                this._data[2] * vector3._data[1];
            this._data[1] =
                this._data[2] * vector3._data[0] -
                tmpX * vector3._data[2];
            this._data[2] =
                tmpX * vector3._data[1] -
                tmpY * vector3._data[0];
        }
    },

    /**
        Returns dot product of self vector with provided vector.
        Vector3 type expected as parameter
    */
    dot: {
        value: function (vector3) {
            return (
                this._data[0] * vector3._data[0] +
                this._data[1] * vector3._data[1] +
                this._data[2] * vector3._data[2]
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
                tmp = this._data[1];

            this._data[1] = this._data[1] * cos - this._data[2] * sin;
            this._data[2] = this._data[2] * cos + tmp * sin;
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
                tmp = this._data[0];

            this._data[0] = this._data[0] * cos + this._data[2] * sin;
            this._data[2] = this._data[2] * cos - tmp * sin;
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
                tmp = this._data[0];

            this._data[0] = this._data[0] * cos - this._data[1] * sin;
            this._data[1] = this._data[1] * cos + tmp * sin;
        }
    },

    /**
        In-place matrix 2d transform. It takes a 2 rows by 3 colums matrix linearized as
        an array in the same format as CSS 2d transform matrix (column-major order).
        It only affects x and y coordinates
    */
    transformMatrix: {
        value: function (matrix) {
            var tmp = this._data[0];

            this._data[0] =
                this._data[0] * matrix[0] +
                this._data[1] * matrix[2] +
                matrix[4];
            this._data[1] =
                tmp * matrix[1] +
                this._data[1] * matrix[3] +
                matrix[5];
        }
    },

    /**
        In-place matrix 3d transform. It takes a 4 by 4 matrix linearized
        as an array in column-major order
    */
    transformMatrix3d: {
        value: function (matrix) {
            var tmpX = this._data[0],
                tmpY = this._data[1];

            this._data[0] =
                this._data[0] * matrix[0] +
                this._data[1] * matrix[4] +
                this._data[2] * matrix[8] +
                matrix[12];
            this._data[1] =
                tmpX * matrix[1] +
                this._data[1] * matrix[5] +
                this._data[2] * matrix[9] +
                matrix[13];
            this._data[2] =
                tmpX * matrix[2] +
                tmpY * matrix[6] +
                this._data[2] * matrix[10] +
                matrix[14];
        }
    },

    /**
        In-place perspective matrix 3d transform. It takes a 4 by 4 matrix
        linearized as an array in column-major order. The result is equivalent
        to CSS 3d transform matrix3d
    */
    transformPerspectiveMatrix3d: {
        value: function (matrix) {
            var tmpX = this._data[0],
                tmpY = this._data[1],
                w;

            w = this._data[0] * matrix[3] +
                this._data[1] * matrix[7] +
                this._data[2] * matrix[11] +
                matrix[15];

            this._data[0] =
               (this._data[0] * matrix[0] +
                this._data[1] * matrix[4] +
                this._data[2] * matrix[8] +
                matrix[12]) / w;
            this._data[1] =
               (tmpX * matrix[1] +
                this._data[1] * matrix[5] +
                this._data[2] * matrix[9] +
                matrix[13]) / w;
            this._data[2] =
               (tmpX * matrix[2] +
                tmpY * matrix[6] +
                this._data[2] * matrix[10] +
                matrix[14]) / w;
        }
    },

    /**
        In-place translation by provided offsets array. Length of provided
        array is assumed to be 3
    */
    translate: {
        value: function (offsetsArray) {
            this._data[0] += offsetsArray[0];
            this._data[1] += offsetsArray[1];
            this._data[2] += offsetsArray[2];
        }
    },

    /**
        In-place scaling by provided factors array. Length of provided
        array is assumed to be 3
    */
    scale: {
        value: function (factorsArray) {
            this._data[0] *= factorsArray[0];
            this._data[1] *= factorsArray[1];
            this._data[2] *= factorsArray[2];
        }
    },

    /**
        In-place skewing x axis relative to y axis by provided angle (in radians)
    */
    skewX: {
        value: function (angle) {
            this._data[0] += this._data[1] * Math.tan(angle);
        }
    },

    /**
        In-place skewing y axis relative to x axis by provided angle (in radians)
    */
    skewY: {
        value: function (angle) {
            this._data[1] += this._data[0] * Math.tan(angle);
        }
    }

    // TODO: skewXZ / YZ / ZX / ZY, translateX / Y / Z, rotate3d (very low priority)
});

var BezierCurve = exports.BezierCurve = Montage.create(MapReducible, {

    /**
        Number of control points not including starting point.
        Linear: order 1, quadratic: order 2, cubic: order 3...
        It will return -1 when no control points are set
    */
    order: {
        get: function () {
            return this._data.length - 1;
        }
    },

    /**
        Inserts the provided vector at the end of
        the control points array
    */
    pushControlPoint: {
        value: function (vector) {
            this._data.push(vector);
        }
    },

    /**
        Returns removed vector control point from
        the end of the controls points array
    */
    popControlPoint: {
        value: function () {
            return this._data.pop();
        }
    },

    /**
        Returns vector control point at the given index
    */
    getControlPoint: {
        value: function (index) {
            return this._data[index];
        }
    },

    /**
        Sets the given vector at the given index position in
        the control points array
    */
    setControlPoint: {
        value: function (index, vector) {
            this._data[index] = vector;
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
    },

    /**
        In-place translation of control points by provided offsets array. Dimensions
        of control points and length of provided array are assumed to be the same
    */
    translate: {
        value: function (offsetsArray) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).translate(offsetsArray);
            }
        }
    },

    /**
        In-place scaling of control points by provided factors array. Dimensions
        of control points and length of provided array are assumed to be the same
    */
    scale: {
        value: function (factorsArray) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).scale(factorsArray);
            }
        }
    },

    /**
        In-place CCW 2d rotation of control points by a given angle in radians
    */
    rotate: {
        value: function (angle) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).rotate(angle);
            }
        }
    },

    /**
        In-place CCW 3d rotation around X axis of control points by a
        given angle in radians
    */
    rotateX: {
        value: function (angle) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).rotateX(angle);
            }
        }
    },

    /**
        In-place CCW 3d rotation around Y axis of control points by a
        given angle in radians
    */
    rotateY: {
        value: function (angle) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).rotateY(angle);
            }
        }
    },

    /**
        In-place CCW 3d rotation around Z axis of control points by a
        given angle in radians
    */
    rotateZ: {
        value: function (angle) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).rotateZ(angle);
            }
        }
    },

    /**
        In-place matrix 2d transform. It takes a 2 rows by 3 colums matrix linearized as
        an array in the same format as CSS 2d transform matrix (column-major order).
        It only affects x and y coordinates of control points
    */
    transformMatrix: {
        value: function (matrix) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).transformMatrix(matrix);
            }
        }
    },

    /**
        In-place matrix 3d transform. It takes a 4 by 4 matrix linearized
        as an array in column-major order
    */
    transformMatrix3d: {
        value: function (matrix) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).transformMatrix3d(matrix);
            }
        }
    },

    /**
        In-place skewing x axis relative to y axis by provided angle (in radians)
    */
    skewX: {
        value: function (angle) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).skewX(angle);
            }
        }
    },

    /**
        In-place skewing y axis relative to x axis by provided angle (in radians)
    */
    skewY: {
        value: function (angle) {
            var order = this.order,
                i;

            for (i = 0; i <= order; i++) {
                this.getControlPoint(i).skewY(angle);
            }
        }
    }
});
