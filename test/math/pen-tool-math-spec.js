var Montage = require("montage").Montage,
    Vector = require("flow-editor/ui/pen-tool.reel/pen-tool-math").Vector,
    Vector2 = require("flow-editor/ui/pen-tool.reel/pen-tool-math").Vector2,
    Vector3 = require("flow-editor/ui/pen-tool.reel/pen-tool-math").Vector3,
    BezierCurve = require("flow-editor/ui/pen-tool.reel/pen-tool-math").BezierCurve;

/* Vector spec */

describe("pen-tool-math Vector-spec", function() {
    describe("initialization", function() {
        describe("using init", function() {
            it("dimensions should be defined", function() {
                var vector = Vector.create().init();

                expect(vector.dimensions).toBeDefined();
                // note the value of dimensions after init is not part of Vector's spec
            });
        });
        describe("using initWithCoordinates", function() {
            var vector,
                coordinates = [1, 2, 3];

            beforeEach(function() {
                vector = Vector.create().initWithCoordinates(coordinates);
            });
            it("should return expected dimensions", function() {
                expect(vector.dimensions).toEqual(3);
            });
            it("_coordinates should be a copy of the initWithCoordinates parameter", function() {
                expect(vector._coordinates).not.toBe(coordinates);
            });
            it("should define expected coordinates", function() {
                expect(vector.getCoordinate(0)).toEqual(coordinates[0]);
                expect(vector.getCoordinate(1)).toEqual(coordinates[1]);
                expect(vector.getCoordinate(2)).toEqual(coordinates[2]);
            });
            it("x, y and z should return expected coordinates", function() {
                expect(vector.x).toEqual(vector.getCoordinate(0));
                expect(vector.y).toEqual(vector.getCoordinate(1));
                expect(vector.z).toEqual(vector.getCoordinate(2));
            });
        });
        describe("using init and setCoordinates", function() {
            it("should define expected coordinates", function() {
                var vector = Vector.create().init();

                vector.setCoordinates([1, 2, 3]);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
    });
    describe("magnitude", function() {
        it("should return expected value", function() {
            var vector = Vector.create().initWithCoordinates([5, 6, 7]);

            expect(vector.magnitude).toBeCloseTo(10.4880884, 6);
        });
    });
    describe("changing coordinates separetely", function() {
        it("should return expected value", function() {
            var vector = Vector.create().initWithCoordinates([0, 0, 0, 0]);

            vector.x = 1;
            vector.y = 2;
            vector.z = 3;
            vector.setCoordinate(3, 4);
            expect(vector._coordinates).toEqual([1, 2, 3, 4]);
        });
    });
    describe("in-place operations", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = Vector.create().initWithCoordinates([2, 4, 6]);
            vector2 = Vector.create().initWithCoordinates([1, 2, 3]);
        });
        describe("normalize", function() {
            it("should define expected coordinates", function() {
                vector.normalize();
                expect(vector.getCoordinate(0)).toBeCloseTo(.26726, 5);
                expect(vector.getCoordinate(1)).toBeCloseTo(.53452, 5);
                expect(vector.getCoordinate(2)).toBeCloseTo(.80178, 5);
            });
        });
        describe("add", function() {
            it("should define expected coordinates", function() {
                vector.add(vector2);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
                expect(vector.getCoordinate(2)).toEqual(9);
            });
        });
        describe("subtract", function() {
            it("should define expected coordinates", function() {
                vector.subtract(vector2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
        describe("multiply", function() {
            it("should define expected coordinates", function() {
                vector.multiply(2);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(8);
                expect(vector.getCoordinate(2)).toEqual(12);
            });
        });
        describe("divide", function() {
            it("should define expected coordinates", function() {
                vector.divide(2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
        describe("negate", function() {
            it("should define expected coordinates", function() {
                vector.negate();
                expect(vector.getCoordinate(0)).toEqual(-2);
                expect(vector.getCoordinate(1)).toEqual(-4);
                expect(vector.getCoordinate(2)).toEqual(-6);
            });
        });
    });
    describe("dot product", function() {
        it("should return expected value", function() {
            var vector = Vector.create().initWithCoordinates([2, 4, 6]),
                vector2 = Vector.create().initWithCoordinates([1, 2, 3]);

            expect(vector.dot(vector2)).toEqual(28);
        });
    });
    describe("clone", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = Vector.create().initWithCoordinates([1, 2, 3]);
            vector2 = vector.clone();
        });
        it("should copy coordinates", function() {
            expect(vector2.getCoordinate(0)).toEqual(1);
            expect(vector2.getCoordinate(1)).toEqual(2);
            expect(vector2.getCoordinate(2)).toEqual(3);
        });
        it("after modifying coordinates of cloned vector, original vector should be intact", function() {
            vector2.setCoordinate(0, 5);
            expect(vector2.getCoordinate(0)).toEqual(5);
            expect(vector.getCoordinate(0)).toEqual(1);
        });
    });
});

/* Vector2 spec */

describe("pen-tool-math Vector2-spec", function() {
    describe("initialization", function() {
        describe("using init", function() {
            it("dimensions should be defined", function() {
                var vector = Vector2.create().init();

                expect(vector.dimensions).toEqual(2);
            });
        });
        describe("using initWithCoordinates", function() {
            var vector,
                coordinates = [1, 2];

            beforeEach(function() {
                vector = Vector2.create().initWithCoordinates(coordinates);
            });
            it("_coordinates should be a copy of the initWithCoordinates parameter", function() {
                expect(vector._coordinates).not.toBe(coordinates);
            });
            it("should define expected coordinates", function() {
                expect(vector.getCoordinate(0)).toEqual(coordinates[0]);
                expect(vector.getCoordinate(1)).toEqual(coordinates[1]);
            });
            it("x and y should return expected coordinates", function() {
                expect(vector.x).toEqual(vector.getCoordinate(0));
                expect(vector.y).toEqual(vector.getCoordinate(1));
            });
        });
        describe("using init and setCoordinates", function() {
            it("should define expected coordinates", function() {
                var vector = Vector2.create().init();

                vector.setCoordinates([1, 2]);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
            });
        });
    });
    describe("magnitude", function() {
        it("should return expected value", function() {
            var vector = Vector2.create().initWithCoordinates([3, 4]);

            expect(vector.magnitude).toBeCloseTo(5, 6);
        });
    });
    describe("changing coordinates separetely", function() {
        it("should return expected value", function() {
            var vector = Vector2.create().initWithCoordinates([0, 0]);

            vector.x = 1;
            vector.y = 2;
            expect(vector._coordinates).toEqual([1, 2]);
            vector.setCoordinate(0, 4);
            expect(vector._coordinates).toEqual([4, 2]);
        });
    });
    describe("in-place operations", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = Vector2.create().initWithCoordinates([2, 4]);
            vector2 = Vector2.create().initWithCoordinates([1, 2]);
        });
        describe("normalize", function() {
            it("should define expected coordinates", function() {
                vector.normalize();
                expect(vector.getCoordinate(0)).toBeCloseTo(.44721, 5);
                expect(vector.getCoordinate(1)).toBeCloseTo(.89443, 5);
            });
        });
        describe("add", function() {
            it("should define expected coordinates", function() {
                vector.add(vector2);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
            });
        });
        describe("subtract", function() {
            it("should define expected coordinates", function() {
                vector.subtract(vector2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
            });
        });
        describe("multiply", function() {
            it("should define expected coordinates", function() {
                vector.multiply(2);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(8);
            });
        });
        describe("divide", function() {
            it("should define expected coordinates", function() {
                vector.divide(2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
            });
        });
        describe("negate", function() {
            it("should define expected coordinates", function() {
                vector.negate();
                expect(vector.getCoordinate(0)).toEqual(-2);
                expect(vector.getCoordinate(1)).toEqual(-4);
            });
        });
    });
    describe("dot product", function() {
        it("should return expected value", function() {
            var vector = Vector2.create().initWithCoordinates([2, 4]),
                vector2 = Vector2.create().initWithCoordinates([1, 2]);

            expect(vector.dot(vector2)).toEqual(10);
        });
    });
    describe("clone", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = Vector2.create().initWithCoordinates([1, 2]);
            vector2 = vector.clone();
        });
        it("should copy coordinates", function() {
            expect(vector2.getCoordinate(0)).toEqual(1);
            expect(vector2.getCoordinate(1)).toEqual(2);
        });
        it("after modifying coordinates of cloned vector, original vector should be intact", function() {
            vector2.setCoordinate(0, 5);
            expect(vector2.getCoordinate(0)).toEqual(5);
            expect(vector.getCoordinate(0)).toEqual(1);
        });
    });
    describe("rotate", function() {
        it("should return expected value", function() {
            var vector = Vector2.create().initWithCoordinates([2, 4]),
                vector2 = Vector2.create().initWithCoordinates([1000, 600]);

            vector.rotate(Math.PI / 2);
            expect(vector.x).toBeCloseTo(-4, 6);
            expect(vector.y).toBeCloseTo(2, 6);
            vector2.rotate(.3);
            expect(vector2.x).toBeCloseTo(778.024, 3);
            expect(vector2.y).toBeCloseTo(868.722, 3);
        });
    });
    describe("transform", function() {
        it("should return expected value", function() {
            var vector = Vector2.create().initWithCoordinates([1000, 600]);

            vector.transform([.5, .2, .7, .8, 300, 140]);
            expect(vector.x).toBeCloseTo(1220, 2);
            expect(vector.y).toBeCloseTo(820, 2);
        });
    });
});

/* Vector3 spec */

describe("pen-tool-math Vector3-spec", function() {
    describe("initialization", function() {
        describe("using init", function() {
            it("dimensions should be defined", function() {
                var vector = Vector3.create().init();

                expect(vector.dimensions).toEqual(3);
            });
        });
        describe("using initWithCoordinates", function() {
            var vector,
                coordinates = [1, 2, 3];

            beforeEach(function() {
                vector = Vector3.create().initWithCoordinates(coordinates);
            });
            it("_coordinates should be a copy of the initWithCoordinates parameter", function() {
                expect(vector._coordinates).not.toBe(coordinates);
            });
            it("should define expected coordinates", function() {
                expect(vector.getCoordinate(0)).toEqual(coordinates[0]);
                expect(vector.getCoordinate(1)).toEqual(coordinates[1]);
                expect(vector.getCoordinate(2)).toEqual(coordinates[2]);
            });
            it("x, y and z should return expected coordinates", function() {
                expect(vector.x).toEqual(vector.getCoordinate(0));
                expect(vector.y).toEqual(vector.getCoordinate(1));
                expect(vector.z).toEqual(vector.getCoordinate(2));
            });
        });
        describe("using init and setCoordinates", function() {
            it("should define expected coordinates", function() {
                var vector = Vector3.create().init();

                vector.setCoordinates([1, 2, 3]);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
    });
    describe("magnitude", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([3, 4, 5]);

            expect(vector.magnitude).toBeCloseTo(7.071068, 6);
        });
    });
    describe("changing coordinates separetely", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([0, 0, 0]);

            vector.x = 1;
            vector.y = 2;
            vector.z = 3;
            expect(vector._coordinates).toEqual([1, 2, 3]);
            vector.setCoordinate(0, 4);
            expect(vector._coordinates).toEqual([4, 2, 3]);
        });
    });
    describe("in-place operations", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = Vector3.create().initWithCoordinates([2, 4, 6]);
            vector2 = Vector3.create().initWithCoordinates([1, 2, 3]);
        });
        describe("normalize", function() {
            it("should define expected coordinates", function() {
                vector.normalize();
                expect(vector.getCoordinate(0)).toBeCloseTo(.26726, 5);
                expect(vector.getCoordinate(1)).toBeCloseTo(.53452, 5);
                expect(vector.getCoordinate(2)).toBeCloseTo(.80178, 5);
            });
        });
        describe("add", function() {
            it("should define expected coordinates", function() {
                vector.add(vector2);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
                expect(vector.getCoordinate(2)).toEqual(9);
            });
        });
        describe("subtract", function() {
            it("should define expected coordinates", function() {
                vector.subtract(vector2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
        describe("multiply", function() {
            it("should define expected coordinates", function() {
                vector.multiply(2);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(8);
                expect(vector.getCoordinate(2)).toEqual(12);
            });
        });
        describe("divide", function() {
            it("should define expected coordinates", function() {
                vector.divide(2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
        describe("negate", function() {
            it("should define expected coordinates", function() {
                vector.negate();
                expect(vector.getCoordinate(0)).toEqual(-2);
                expect(vector.getCoordinate(1)).toEqual(-4);
                expect(vector.getCoordinate(2)).toEqual(-6);
            });
        });
        describe("cross", function() {
            it("should define expected coordinates", function() {
                vector.cross(vector2);
                expect(vector.getCoordinate(0)).toEqual(0);
                expect(vector.getCoordinate(1)).toEqual(0);
                expect(vector.getCoordinate(2)).toEqual(0);
                vector.setCoordinates([2, 4, 6]);
                vector2.setCoordinates([-5, 7, -11]);
                vector.cross(vector2);
                expect(vector.getCoordinate(0)).toEqual(-86);
                expect(vector.getCoordinate(1)).toEqual(-8);
                expect(vector.getCoordinate(2)).toEqual(34);
            });
        });
    });
    describe("dot product", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([2, 4, 6]),
                vector2 = Vector3.create().initWithCoordinates([1, 2, 3]);

            expect(vector.dot(vector2)).toEqual(28);
        });
    });
    describe("clone", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = Vector3.create().initWithCoordinates([1, 2, 3]);
            vector2 = vector.clone();
        });
        it("should copy coordinates", function() {
            expect(vector2.getCoordinate(0)).toEqual(1);
            expect(vector2.getCoordinate(1)).toEqual(2);
            expect(vector2.getCoordinate(2)).toEqual(3);
        });
        it("after modifying coordinates of cloned vector, original vector should be intact", function() {
            vector2.setCoordinate(0, 5);
            expect(vector2.getCoordinate(0)).toEqual(5);
            expect(vector.getCoordinate(0)).toEqual(1);
        });
    });
    describe("rotateX", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([400, 1000, 600]);

            vector.rotateX(.3);
            expect(vector.y).toBeCloseTo(778.024, 3);
            expect(vector.z).toBeCloseTo(868.722, 3);
        });
    });
    describe("rotateY", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([1000, 400, 600]);

            vector.rotateY(-.3);
            expect(vector.x).toBeCloseTo(778.024, 3);
            expect(vector.z).toBeCloseTo(868.722, 3);
        });
    });
    describe("rotateZ", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([1000, 600, 400]);

            vector.rotateZ(.3);
            expect(vector.x).toBeCloseTo(778.024, 3);
            expect(vector.y).toBeCloseTo(868.722, 3);
        });
    });
    describe("multiple rotations", function() {
        it("should return expected value", function() {
            var vector = Vector3.create().initWithCoordinates([1000, 600, 400]);

            vector.rotateX(Math.PI);
            vector.rotateY(Math.PI);
            vector.rotateZ(Math.PI);
            expect(vector.x).toBeCloseTo(1000, 3);
            expect(vector.y).toBeCloseTo(600, 3);
            expect(vector.z).toBeCloseTo(400, 3);
        });
    });
});

/* Bézier Curve spec */

describe("pen-tool-math Bezier-Curve-spec", function() {
    var bezierCurve, vector1, vector2, vector3, vector4;

    describe("initialization using init", function() {
        beforeEach(function() {
            bezierCurve = BezierCurve.create().init();
        });
        it("order should be defined", function() {
            expect(bezierCurve.order).toBeDefined();
        });
        it("order should be equal to -1", function() {
            expect(bezierCurve.order).toEqual(-1);
        });
    });
    describe("adding/removing/getting control points", function() {
        beforeEach(function() {
            bezierCurve = BezierCurve.create().init();
            vector1 = Vector.create().initWithCoordinates([1]);
            vector2 = Vector.create().initWithCoordinates([2]);
            vector3 = Vector.create().initWithCoordinates([3]);
        });
        it("pushControlPoint", function() {
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.order).toEqual(2);
        });
        it("getControlPoint", function() {
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.getControlPoint(0)).toBe(vector1);
            expect(bezierCurve.getControlPoint(1)).toBe(vector2);
        });
        it("popControlPoint", function() {
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            var controlPoint = bezierCurve.popControlPoint();
            expect(bezierCurve.order).toEqual(1);
            expect(bezierCurve.getControlPoint(2)).not.toBeDefined();
            expect(controlPoint).toBe(vector3);
        });
        it("setControlPoint", function() {
            bezierCurve.setControlPoint(0, vector1);
            expect(bezierCurve.order).toEqual(0);
            expect(bezierCurve.getControlPoint(0)).toBe(vector1);
        });
    });
    describe("value", function() {
        describe("for linear Bézier Curve", function() {
            beforeEach(function() {
                bezierCurve = BezierCurve.create().init();
                vector1 = Vector.create().initWithCoordinates([1]);
                vector2 = Vector.create().initWithCoordinates([2]);
                bezierCurve.pushControlPoint(vector1);
                bezierCurve.pushControlPoint(vector2);
            });
            it("should return expected result", function() {
                var value = bezierCurve.value(.4);

                expect(value.x).toBeCloseTo(1.4, 6);
            });
        });
        describe("for quadratic Bézier Curve", function() {
            beforeEach(function() {
                bezierCurve = BezierCurve.create().init();
                vector1 = Vector.create().initWithCoordinates([1, 3, 7]);
                vector2 = Vector.create().initWithCoordinates([2, 5, 11]);
                vector3 = Vector.create().initWithCoordinates([3, 13, 17]);
                bezierCurve.pushControlPoint(vector1);
                bezierCurve.pushControlPoint(vector2);
                bezierCurve.pushControlPoint(vector3);
            });
            it("should return expected result", function() {
                var value = bezierCurve.value(.5);

                expect(value.x).toBeCloseTo(2, 6);
                expect(value.y).toBeCloseTo(6.5, 6);
                expect(value.z).toBeCloseTo(11.5, 6);
                value = bezierCurve.value(0);
                expect(value.x).toBeCloseTo(1, 6);
                expect(value.y).toBeCloseTo(3, 6);
                expect(value.z).toBeCloseTo(7, 6);
                value = bezierCurve.value(1);
                expect(value.x).toBeCloseTo(3, 6);
                expect(value.y).toBeCloseTo(13, 6);
                expect(value.z).toBeCloseTo(17, 6);
                value = bezierCurve.value(.25);
                expect(value.x).toBeCloseTo(1.5, 6);
            });
        });
        describe("for cubic Bézier Curve", function() {
            beforeEach(function() {
                bezierCurve = BezierCurve.create().init();
                vector1 = Vector.create().initWithCoordinates([1]);
                vector2 = Vector.create().initWithCoordinates([2]);
                vector3 = Vector.create().initWithCoordinates([3]);
                vector4 = Vector.create().initWithCoordinates([4]);
                bezierCurve.pushControlPoint(vector1);
                bezierCurve.pushControlPoint(vector2);
                bezierCurve.pushControlPoint(vector3);
                bezierCurve.pushControlPoint(vector4);
            });
            it("should return expected result", function() {
                var value = bezierCurve.value(.4);

                expect(value.x).toBeCloseTo(2.2, 6);
            });
        });
    });
});