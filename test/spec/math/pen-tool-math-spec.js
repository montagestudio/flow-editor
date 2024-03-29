var Montage = require("montage").Montage,
    Vector = require("flow-editor/ui/pen-tool-math").Vector,
    Vector2 = require("flow-editor/ui/pen-tool-math").Vector2,
    Vector3 = require("flow-editor/ui/pen-tool-math").Vector3,
    BezierCurve = require("flow-editor/ui/pen-tool-math").BezierCurve,
    BezierSpline = require("flow-editor/ui/pen-tool-math").BezierSpline,
    CubicBezierSpline = require("flow-editor/ui/pen-tool-math").CubicBezierSpline;

/* Vector spec */

describe("pen-tool-math Vector-spec", function() {
    describe("initialization", function() {
        describe("using init", function() {
            it("dimensions should be defined", function() {
                var vector = new Vector().init();

                expect(vector.dimensions).toBeDefined();
                // note the value of dimensions after init is not part of Vector's spec
            });
        });
        describe("using initWithCoordinates", function() {
            var vector,
                coordinates = [1, 2, 3];

            beforeEach(function() {
                vector = new Vector().initWithCoordinates(coordinates);
            });
            it("should return expected dimensions", function() {
                expect(vector.dimensions).toEqual(3);
            });
            it("_data should be a copy of the initWithCoordinates parameter", function() {
                expect(vector._data).not.toBe(coordinates);
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
                var vector = new Vector().init();

                vector.setCoordinates([1, 2, 3]);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
        });
    });
    describe("magnitude", function() {
        it("should return expected value", function() {
            var vector = new Vector().initWithCoordinates([5, 6, 7]);

            expect(vector.magnitude).toBeCloseTo(10.4880884, 6);
        });
    });
    describe("changing coordinates separetely", function() {
        it("should return expected value", function() {
            var vector = new Vector().initWithCoordinates([0, 0, 0, 0]);

            vector.x = 1;
            vector.y = 2;
            vector.z = 3;
            vector.setCoordinate(3, 4);
            expect(vector._data).toEqual([1, 2, 3, 4]);
        });
        it("setCoordinate should return this", function() {
            var vector = new Vector().initWithCoordinates([0, 0, 0, 0]);

            vector.x = 1;
            vector.y = 2;
            vector.z = 3;
            expect(vector.setCoordinate(3, 4)).toBe(vector);
        });
    });
    describe("in-place operations", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = new Vector().initWithCoordinates([2, 4, 6]);
            vector2 = new Vector().initWithCoordinates([1, 2, 3]);
        });
        describe("normalize", function() {
            it("should define expected coordinates", function() {
                vector.normalize();
                expect(vector.getCoordinate(0)).toBeCloseTo(0.26726, 5);
                expect(vector.getCoordinate(1)).toBeCloseTo(0.53452, 5);
                expect(vector.getCoordinate(2)).toBeCloseTo(0.80178, 5);
            });
            it("should return this", function() {
                expect(vector.normalize()).toBe(vector);
            });
        });
        describe("add", function() {
            it("should define expected coordinates", function() {
                vector.add(vector2);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
                expect(vector.getCoordinate(2)).toEqual(9);
            });
            it("should return this", function() {
                expect(vector.add(vector2)).toBe(vector);
            });
        });
        describe("subtract", function() {
            it("should define expected coordinates", function() {
                vector.subtract(vector2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
            it("should return this", function() {
                expect(vector.subtract(vector2)).toBe(vector);
            });
        });
        describe("multiply", function() {
            it("should define expected coordinates", function() {
                vector.multiply(2);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(8);
                expect(vector.getCoordinate(2)).toEqual(12);
            });
            it("should return this", function() {
                expect(vector.multiply(2)).toBe(vector);
            });
        });
        describe("divide", function() {
            it("should define expected coordinates", function() {
                vector.divide(2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
            it("should return this", function() {
                expect(vector.divide(2)).toBe(vector);
            });
        });
        describe("negate", function() {
            it("should define expected coordinates", function() {
                vector.negate();
                expect(vector.getCoordinate(0)).toEqual(-2);
                expect(vector.getCoordinate(1)).toEqual(-4);
                expect(vector.getCoordinate(2)).toEqual(-6);
            });
            it("should return this", function() {
                expect(vector.negate()).toBe(vector);
            });
        });
        describe("translate", function() {
            it("should define expected coordinates", function() {
                vector.translate([1,2,3]);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
                expect(vector.getCoordinate(2)).toEqual(9);
            });
            it("should return this", function() {
                expect(vector.translate([1,2,3])).toBe(vector);
            });
        });
        describe("scale", function() {
            it("should define expected coordinates", function() {
                vector.scale([2,3,4]);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(12);
                expect(vector.getCoordinate(2)).toEqual(24);
            });
            it("should return this", function() {
                expect(vector.scale([2,3,4])).toBe(vector);
            });
        });
    });
    describe("dot product", function() {
        it("should return expected value", function() {
            var vector = new Vector().initWithCoordinates([2, 4, 6]),
                vector2 = new Vector().initWithCoordinates([1, 2, 3]);

            expect(vector.dot(vector2)).toEqual(28);
        });
    });
    describe("clone", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = new Vector().initWithCoordinates([1, 2, 3]);
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
    describe("outOfPlaceLerp", function() {
        var vector, vector2;

        vector = new Vector().initWithCoordinates([1, 2, 3]);
        vector2 = new Vector().initWithCoordinates([2, 3, 4]);
        it("should return expected vector", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25)._data).toEqual([1.25, 2.25, 3.25]);
        });
        it("should not return this", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25)).not.toBe(vector);
        });
    });
    describe("distanceTo", function() {
        var vector, vector2;

        vector = new Vector().initWithCoordinates([1, 2]);
        vector2 = new Vector().initWithCoordinates([5, 5]);
        it("should return expected vector", function() {
            expect(vector.distanceTo(vector2)).toBeCloseTo(5, 6);
        });
    });
    describe("MapReducible functions", function() {
        var vector;

        beforeEach(function() {
            vector = new Vector().initWithCoordinates([1, 2, 3]);
        });
        describe("every", function() {
            it("should work as expected", function() {
                expect(vector.every(function (coordinate) {
                    return (coordinate < 4);
                })).toBeTruthy();
                expect(vector.every(function (coordinate) {
                    return (coordinate < 3);
                })).toBeFalsy();
            });
        });
        describe("reduce", function() {
            it("should work as expected", function() {
                expect(vector.reduce(function (previous, next) {
                    return "" + previous + next;
                })).toEqual("123");
            });
        });
        describe("reduceRight", function() {
            it("should work as expected", function() {
                expect(vector.reduceRight(function (previous, next) {
                    return "" + previous + next;
                })).toEqual("321");
            });
        });
        describe("some", function() {
            it("should work as expected", function() {
                expect(vector.some(function (coordinate) {
                    return (coordinate > 2);
                })).toBeTruthy();
                expect(vector.some(function (coordinate) {
                    return (coordinate > 4);
                })).toBeFalsy();
            });
        });
        describe("forEach", function() {
            it("should work as expected", function() {
                var sum = 0;

                vector.forEach(function (coordinate) {
                    sum += coordinate;
                });
                expect(sum).toEqual(6);
            });
        });
        describe("map", function() {
            it("should work as expected", function() {
                var result = vector.map(function (coordinate) {
                    return coordinate * 2;
                });
                expect(result).toEqual([2, 4, 6]);
            });
        });
        describe("filter", function() {
            it("should work as expected", function() {
                var result = vector.filter(function (coordinate) {
                    return coordinate > 1;
                });
                expect(result).toEqual([2, 3]);
            });
        });
    });
    describe("save and restore", function() {
        it("should work as expected", function() {
            var vector = new Vector().initWithCoordinates([1, 2, 3]);

            vector.save();
            vector.setCoordinate(0, 9);
            vector.setCoordinate(1, 9);
            vector.setCoordinate(2, 9);
            vector.restore();
            expect(vector.getCoordinate(0)).toEqual(1);
            expect(vector.getCoordinate(1)).toEqual(2);
            expect(vector.getCoordinate(2)).toEqual(3);
        });
    });
});

/* Vector2 spec */

describe("pen-tool-math Vector2-spec", function() {
    describe("initialization", function() {
        describe("using init", function() {
            it("dimensions should be defined", function() {
                var vector = new Vector2().init();

                expect(vector.dimensions).toEqual(2);
            });
        });
        describe("using initWithCoordinates", function() {
            var vector,
                coordinates = [1, 2];

            beforeEach(function() {
                vector = new Vector2().initWithCoordinates(coordinates);
            });
            it("_data should be a copy of the initWithCoordinates parameter", function() {
                expect(vector._data).not.toBe(coordinates);
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
                var vector = new Vector2().init();

                vector.setCoordinates([1, 2]);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
            });
            it("should return this", function() {
                var vector = new Vector2().init();

                expect(vector.setCoordinates([1, 2])).toBe(vector);
            });
        });
    });
    describe("magnitude", function() {
        it("should return expected value", function() {
            var vector = new Vector2().initWithCoordinates([3, 4]);

            expect(vector.magnitude).toBeCloseTo(5, 6);
        });
    });
    describe("changing coordinates separetely", function() {
        it("should return expected value", function() {
            var vector = new Vector2().initWithCoordinates([0, 0]);

            vector.x = 1;
            vector.y = 2;
            expect(vector._data).toEqual([1, 2]);
            vector.setCoordinate(0, 4);
            expect(vector._data).toEqual([4, 2]);
        });
    });
    describe("in-place operations", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = new Vector2().initWithCoordinates([2, 4]);
            vector2 = new Vector2().initWithCoordinates([1, 2]);
        });
        describe("normalize", function() {
            it("should define expected coordinates", function() {
                vector.normalize();
                expect(vector.getCoordinate(0)).toBeCloseTo(0.44721, 5);
                expect(vector.getCoordinate(1)).toBeCloseTo(0.89443, 5);
            });
            it("should return this", function() {
                expect(vector.normalize()).toBe(vector);
            });
        });
        describe("add", function() {
            it("should define expected coordinates", function() {
                vector.add(vector2);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
            });
            it("should return this", function() {
                expect(vector.add(vector2)).toBe(vector);
            });
        });
        describe("subtract", function() {
            it("should define expected coordinates", function() {
                vector.subtract(vector2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
            });
            it("should return this", function() {
                expect(vector.subtract(vector2)).toBe(vector);
            });
        });
        describe("multiply", function() {
            it("should define expected coordinates", function() {
                vector.multiply(2);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(8);
            });
            it("should return this", function() {
                expect(vector.multiply(2)).toBe(vector);
            });
        });
        describe("divide", function() {
            it("should define expected coordinates", function() {
                vector.divide(2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
            });
            it("should return this", function() {
                expect(vector.divide(2)).toBe(vector);
            });
        });
        describe("negate", function() {
            it("should define expected coordinates", function() {
                vector.negate();
                expect(vector.getCoordinate(0)).toEqual(-2);
                expect(vector.getCoordinate(1)).toEqual(-4);
            });
            it("should return this", function() {
                expect(vector.negate()).toBe(vector);
            });
        });
        describe("translate", function() {
            it("should define expected coordinates", function() {
                vector.translate([1,2]);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
            });
            it("should return this", function() {
                expect(vector.translate([1,2])).toBe(vector);
            });
        });
        describe("scale", function() {
            it("should define expected coordinates", function() {
                vector.scale([2,3]);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(12);
            });
            it("should return this", function() {
                expect(vector.scale([2,3])).toBe(vector);
            });
        });
        describe("skewX", function() {
            it("should define expected coordinates", function() {
                vector.skewX(45 * Math.PI * 2 / 360);
                expect(vector.getCoordinate(0)).toBeCloseTo(6, 6);
                expect(vector.getCoordinate(1)).toEqual(4);
            });
            it("should return this", function() {
                expect(vector.skewX(45 * Math.PI * 2 / 360)).toBe(vector);
            });
        });
        describe("skewY", function() {
            it("should define expected coordinates", function() {
                vector.skewY(45 * Math.PI * 2 / 360);
                expect(vector.getCoordinate(1)).toBeCloseTo(6, 6);
                expect(vector.getCoordinate(0)).toEqual(2);
            });
            it("should return this", function() {
                expect(vector.skewY(45 * Math.PI * 2 / 360)).toBe(vector);
            });
        });
        describe("rotate", function() {
            it("should return expected value", function() {
                var vector = new Vector2().initWithCoordinates([2, 4]),
                    vector2 = new Vector2().initWithCoordinates([1000, 600]);

                vector.rotate(Math.PI / 2);
                expect(vector.x).toBeCloseTo(-4, 6);
                expect(vector.y).toBeCloseTo(2, 6);
                vector2.rotate(0.3);
                expect(vector2.x).toBeCloseTo(778.024, 3);
                expect(vector2.y).toBeCloseTo(868.722, 3);
            });
            it("should return this", function() {
                expect(vector2.rotate(0.3)).toBe(vector2);
            });
        });
        describe("transformMatrix", function() {
            it("should return expected value", function() {
                var vector = new Vector2().initWithCoordinates([1000, 600]);

                vector.transformMatrix([0.5, 0.2, 0.7, 0.8, 300, 140]);
                expect(vector.x).toBeCloseTo(1220, 2);
                expect(vector.y).toBeCloseTo(820, 2);
            });
            it("should return this", function() {
                expect(vector.transformMatrix([0.5, 0.2, 0.7, 0.8, 300, 140])).toBe(vector);
            });
        });
    });
    describe("dot product", function() {
        it("should return expected value", function() {
            var vector = new Vector2().initWithCoordinates([2, 4]),
                vector2 = new Vector2().initWithCoordinates([1, 2]);

            expect(vector.dot(vector2)).toEqual(10);
        });
    });
    describe("clone", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = new Vector2().initWithCoordinates([1, 2]);
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
    describe("outOfPlaceLerp", function() {
        var vector, vector2;

        vector = new Vector2().initWithCoordinates([1, 2]);
        vector2 = new Vector2().initWithCoordinates([2, 3]);
        it("should return expected vector", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25)._data).toEqual([1.25, 2.25]);
        });
        it("should be an instance of Vector2", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25) instanceof Vector2).toBeTruthy();
        });
        it("should not return this", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25)).not.toBe(vector);
        });
    });
    describe("MapReducible functions", function() {
        var vector;

        beforeEach(function() {
            vector = new Vector2().initWithCoordinates([1, 2]);
        });
        describe("every", function() {
            it("should work as expected", function() {
                expect(vector.every(function (coordinate) {
                    return (coordinate < 3);
                })).toBeTruthy();
                expect(vector.every(function (coordinate) {
                    return (coordinate < 2);
                })).toBeFalsy();
            });
        });
        describe("reduce", function() {
            it("should work as expected", function() {
                expect(vector.reduce(function (previous, next) {
                    return "" + previous + next;
                })).toEqual("12");
            });
        });
        describe("reduceRight", function() {
            it("should work as expected", function() {
                expect(vector.reduceRight(function (previous, next) {
                    return "" + previous + next;
                })).toEqual("21");
            });
        });
        describe("some", function() {
            it("should work as expected", function() {
                expect(vector.some(function (coordinate) {
                    return (coordinate > 1);
                })).toBeTruthy();
                expect(vector.some(function (coordinate) {
                    return (coordinate > 4);
                })).toBeFalsy();
            });
        });
        describe("forEach", function() {
            it("should work as expected", function() {
                var sum = 0;

                vector.forEach(function (coordinate) {
                    sum += coordinate;
                });
                expect(sum).toEqual(3);
            });
        });
        describe("map", function() {
            it("should work as expected", function() {
                var result = vector.map(function (coordinate) {
                    return coordinate * 2;
                });
                expect(result).toEqual([2, 4]);
            });
        });
        describe("filter", function() {
            it("should work as expected", function() {
                var result = vector.filter(function (coordinate) {
                    return coordinate > 1;
                });
                expect(result).toEqual([2]);
            });
        });
    });
    describe("save and restore", function() {
        it("should work as expected", function() {
            var vector = new Vector2().initWithCoordinates([1, 2]);

            vector.save();
            vector.setCoordinate(0, 9);
            vector.setCoordinate(1, 9);
            vector.restore();
            expect(vector.getCoordinate(0)).toEqual(1);
            expect(vector.getCoordinate(1)).toEqual(2);
        });
    });
});

/* Vector3 spec */

describe("pen-tool-math Vector3-spec", function() {
    describe("initialization", function() {
        describe("using init", function() {
            it("dimensions should be defined", function() {
                var vector = new Vector3().init();

                expect(vector.dimensions).toEqual(3);
            });
        });
        describe("using initWithCoordinates", function() {
            var vector,
                coordinates = [1, 2, 3];

            beforeEach(function() {
                vector = new Vector3().initWithCoordinates(coordinates);
            });
            it("_data should be a copy of the initWithCoordinates parameter", function() {
                expect(vector._data).not.toBe(coordinates);
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
                var vector = new Vector3().init();

                vector.setCoordinates([1, 2, 3]);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
            it("should return this", function() {
                var vector = new Vector3().init();

                expect(vector.setCoordinates([1, 2, 3])).toBe(vector);
            });
        });
    });
    describe("magnitude", function() {
        it("should return expected value", function() {
            var vector = new Vector3().initWithCoordinates([3, 4, 5]);

            expect(vector.magnitude).toBeCloseTo(7.071068, 6);
        });
    });
    describe("changing coordinates separetely", function() {
        it("should return expected value", function() {
            var vector = new Vector3().initWithCoordinates([0, 0, 0]);

            vector.x = 1;
            vector.y = 2;
            vector.z = 3;
            expect(vector._data).toEqual([1, 2, 3]);
            vector.setCoordinate(0, 4);
            expect(vector._data).toEqual([4, 2, 3]);
        });
    });
    describe("in-place operations", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = new Vector3().initWithCoordinates([2, 4, 6]);
            vector2 = new Vector3().initWithCoordinates([1, 2, 3]);
        });
        describe("normalize", function() {
            it("should define expected coordinates", function() {
                vector.normalize();
                expect(vector.getCoordinate(0)).toBeCloseTo(0.26726, 5);
                expect(vector.getCoordinate(1)).toBeCloseTo(0.53452, 5);
                expect(vector.getCoordinate(2)).toBeCloseTo(0.80178, 5);
            });
            it("should return this", function() {
                expect(vector.normalize()).toBe(vector);
            });
        });
        describe("add", function() {
            it("should define expected coordinates", function() {
                vector.add(vector2);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
                expect(vector.getCoordinate(2)).toEqual(9);
            });
            it("should return this", function() {
                expect(vector.add(vector2)).toBe(vector);
            });
        });
        describe("subtract", function() {
            it("should define expected coordinates", function() {
                vector.subtract(vector2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
            it("should return this", function() {
                expect(vector.subtract(vector2)).toBe(vector);
            });
        });
        describe("multiply", function() {
            it("should define expected coordinates", function() {
                vector.multiply(2);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(8);
                expect(vector.getCoordinate(2)).toEqual(12);
            });
            it("should return this", function() {
                expect(vector.multiply(2)).toBe(vector);
            });
        });
        describe("divide", function() {
            it("should define expected coordinates", function() {
                vector.divide(2);
                expect(vector.getCoordinate(0)).toEqual(1);
                expect(vector.getCoordinate(1)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(3);
            });
            it("should return this", function() {
                expect(vector.divide(2)).toBe(vector);
            });
        });
        describe("negate", function() {
            it("should define expected coordinates", function() {
                vector.negate();
                expect(vector.getCoordinate(0)).toEqual(-2);
                expect(vector.getCoordinate(1)).toEqual(-4);
                expect(vector.getCoordinate(2)).toEqual(-6);
            });
            it("should return this", function() {
                expect(vector.negate()).toBe(vector);
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
            it("should return this", function() {
                expect(vector.cross(vector2)).toBe(vector);
            });
        });
        describe("translate", function() {
            it("should define expected coordinates", function() {
                vector.translate([1,2,3]);
                expect(vector.getCoordinate(0)).toEqual(3);
                expect(vector.getCoordinate(1)).toEqual(6);
                expect(vector.getCoordinate(2)).toEqual(9);
            });
            it("should return this", function() {
                expect(vector.translate([1,2,3])).toBe(vector);
            });
        });
        describe("scale", function() {
            it("should define expected coordinates", function() {
                vector.scale([2,3,4]);
                expect(vector.getCoordinate(0)).toEqual(4);
                expect(vector.getCoordinate(1)).toEqual(12);
                expect(vector.getCoordinate(2)).toEqual(24);
            });
            it("should return this", function() {
                expect(vector.scale([2,3,4])).toBe(vector);
            });
        });
        describe("skewX", function() {
            it("should define expected coordinates", function() {
                vector.skewX(45 * Math.PI * 2 / 360);
                expect(vector.getCoordinate(0)).toBeCloseTo(6, 6);
                expect(vector.getCoordinate(1)).toEqual(4);
                expect(vector.getCoordinate(2)).toEqual(6);
            });
            it("should return this", function() {
                expect(vector.skewX(45 * Math.PI * 2 / 360)).toBe(vector);
            });
        });
        describe("skewY", function() {
            it("should define expected coordinates", function() {
                vector.skewY(45 * Math.PI * 2 / 360);
                expect(vector.getCoordinate(1)).toBeCloseTo(6, 6);
                expect(vector.getCoordinate(0)).toEqual(2);
                expect(vector.getCoordinate(2)).toEqual(6);
            });
            it("should return this", function() {
                expect(vector.skewY(45 * Math.PI * 2 / 360)).toBe(vector);
            });
        });
        describe("rotateX", function() {
            it("should return expected value", function() {
                var vector = new Vector3().initWithCoordinates([400, 1000, 600]);

                vector.rotateX(0.3);
                expect(vector.y).toBeCloseTo(778.024, 3);
                expect(vector.z).toBeCloseTo(868.722, 3);
            });
            it("should return this", function() {
                expect(vector.rotateX(0.3)).toBe(vector);
            });
        });
        describe("rotateY", function() {
            it("should return expected value", function() {
                var vector = new Vector3().initWithCoordinates([1000, 400, 600]);

                vector.rotateY(-0.3);
                expect(vector.x).toBeCloseTo(778.024, 3);
                expect(vector.z).toBeCloseTo(868.722, 3);
            });
            it("should return this", function() {
                expect(vector.rotateY(-0.3)).toBe(vector);
            });
        });
        describe("rotateZ", function() {
            it("should return expected value", function() {
                var vector = new Vector3().initWithCoordinates([1000, 600, 400]);

                vector.rotateZ(0.3);
                expect(vector.x).toBeCloseTo(778.024, 3);
                expect(vector.y).toBeCloseTo(868.722, 3);
            });
            it("should return this", function() {
                expect(vector.rotateZ(0.3)).toBe(vector);
            });
        });
        describe("multiple rotations", function() {
            it("should return expected value", function() {
                var vector = new Vector3().initWithCoordinates([1000, 600, 400]);

                vector.rotateX(Math.PI);
                vector.rotateY(Math.PI);
                vector.rotateZ(Math.PI);
                expect(vector.x).toBeCloseTo(1000, 3);
                expect(vector.y).toBeCloseTo(600, 3);
                expect(vector.z).toBeCloseTo(400, 3);
            });
        });
        describe("transformMatrix", function() {
            it("should return expected value", function() {
                var vector = new Vector3().initWithCoordinates([1000, 600, 123]);

                vector.transformMatrix([0.5, 0.2, 0.7, 0.8, 300, 140]);
                expect(vector.x).toBeCloseTo(1220, 2);
                expect(vector.y).toBeCloseTo(820, 2);
                expect(vector.z).toEqual(123);
            });
            it("should return this", function() {
                expect(vector.transformMatrix([0.5, 0.2, 0.7, 0.8, 300, 140])).toBe(vector);
            });
        });
        describe("transformMatrix3d", function() {
            it("should return expected value", function() {
                vector.transformMatrix3d([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]);
                expect(vector.x).toBeCloseTo(2, 6);
                expect(vector.y).toBeCloseTo(4, 6);
                expect(vector.z).toBeCloseTo(6, 6);
                vector.transformMatrix3d([
                    2, 6, 10, 14,
                    3, 7, 11, 15,
                    4, 8, 12, 16,
                    5, 9, 13, 17
                ]);
                expect(vector.x).toBeCloseTo(2 * 2 + 4 * 3 + 6 * 4 + 5, 5);
                expect(vector.y).toBeCloseTo(2 * 6 + 4 * 7 + 6 * 8 + 9, 5);
                expect(vector.z).toBeCloseTo(10 * 2 + 4 * 11 + 6 * 12 + 13, 5);
            });
            it("should return this", function() {
                expect(vector.transformMatrix3d([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])).toBe(vector);
            });
        });
        describe("transformPerspectiveMatrix3d", function() {
            it("should return expected value", function() {
                vector.transformPerspectiveMatrix3d([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ]);
                expect(vector.x).toBeCloseTo(2, 6);
                expect(vector.y).toBeCloseTo(4, 6);
                expect(vector.z).toBeCloseTo(6, 6);
                vector.transformPerspectiveMatrix3d([
                    2, 6, 10, 14,
                    3, 7, 11, 15,
                    4, 8, 12, 16,
                    5, 9, 13, 17
                ]);
                var w = 2 * 14 + 4 * 15 + 6 * 16 + 17;
                expect(vector.x).toBeCloseTo((2 * 2 + 4 * 3 + 6 * 4 + 5) / w, 5);
                expect(vector.y).toBeCloseTo((2 * 6 + 4 * 7 + 6 * 8 + 9) / w, 5);
                expect(vector.z).toBeCloseTo((10 * 2 + 4 * 11 + 6 * 12 + 13) / w, 5);
            });
            it("should return this", function() {
                expect(vector.transformPerspectiveMatrix3d([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])).toBe(vector);
            });
        });
    });
    describe("dot product", function() {
        it("should return expected value", function() {
            var vector = new Vector3().initWithCoordinates([2, 4, 6]),
                vector2 = new Vector3().initWithCoordinates([1, 2, 3]);

            expect(vector.dot(vector2)).toEqual(28);
        });
    });
    describe("clone", function() {
        var vector, vector2;

        beforeEach(function() {
            vector = new Vector3().initWithCoordinates([1, 2, 3]);
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
    describe("outOfPlaceLerp", function() {
        var vector, vector2;

        vector = new Vector3().initWithCoordinates([1, 2, 3]);
        vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
        it("should return expected vector", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25)._data).toEqual([1.25, 2.25, 3.25]);
        });
        it("should be an instance of Vector3", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25) instanceof Vector3).toBeTruthy();
        });
        it("should not return this", function() {
            expect(vector.outOfPlaceLerp(vector2, 0.25)).not.toBe(vector);
        });
    });
    describe("MapReducible functions", function() {
        var vector;

        beforeEach(function() {
            vector = new Vector3().initWithCoordinates([1, 2, 3]);
        });
        describe("every", function() {
            it("should work as expected", function() {
                expect(vector.every(function (coordinate) {
                    return (coordinate < 4);
                })).toBeTruthy();
                expect(vector.every(function (coordinate) {
                    return (coordinate < 3);
                })).toBeFalsy();
            });
        });
        describe("reduce", function() {
            it("should work as expected", function() {
                expect(vector.reduce(function (previous, next) {
                    return "" + previous + next;
                })).toEqual("123");
            });
        });
        describe("reduceRight", function() {
            it("should work as expected", function() {
                expect(vector.reduceRight(function (previous, next) {
                    return "" + previous + next;
                })).toEqual("321");
            });
        });
        describe("some", function() {
            it("should work as expected", function() {
                expect(vector.some(function (coordinate) {
                    return (coordinate > 2);
                })).toBeTruthy();
                expect(vector.some(function (coordinate) {
                    return (coordinate > 4);
                })).toBeFalsy();
            });
        });
        describe("forEach", function() {
            it("should work as expected", function() {
                var sum = 0;

                vector.forEach(function (coordinate) {
                    sum += coordinate;
                });
                expect(sum).toEqual(6);
            });
        });
        describe("map", function() {
            it("should work as expected", function() {
                var result = vector.map(function (coordinate) {
                    return coordinate * 2;
                });
                expect(result).toEqual([2, 4, 6]);
            });
        });
        describe("filter", function() {
            it("should work as expected", function() {
                var result = vector.filter(function (coordinate) {
                    return coordinate > 1;
                });
                expect(result).toEqual([2, 3]);
            });
        });
    });
    describe("save and restore", function() {
        it("should work as expected", function() {
            var vector = new Vector3().initWithCoordinates([1, 2, 3]);

            vector.save();
            vector.setCoordinate(0, 9);
            vector.setCoordinate(1, 9);
            vector.setCoordinate(2, 9);
            vector.restore();
            expect(vector.getCoordinate(0)).toEqual(1);
            expect(vector.getCoordinate(1)).toEqual(2);
            expect(vector.getCoordinate(2)).toEqual(3);
        });
    });
});

/* Bézier Curve spec */

describe("pen-tool-math Bezier-Curve-spec", function() {
    var bezierCurve, vector1, vector2, vector3, vector4;

    describe("initialization using init", function() {
        beforeEach(function() {
            bezierCurve = new BezierCurve().init();
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
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1]);
            vector2 = new Vector().initWithCoordinates([2]);
            vector3 = new Vector().initWithCoordinates([3]);
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
            expect(bezierCurve.getControlPoint(2)).toEqual(null);
            expect(controlPoint).toBe(vector3);
        });
        it("setControlPoint", function() {
            bezierCurve.setControlPoint(0, vector1);
            expect(bezierCurve.order).toEqual(0);
            expect(bezierCurve.getControlPoint(0)).toBe(vector1);
        });
        it("removeControlPoint", function() {
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.isComplete).toBeTruthy();
            bezierCurve.removeControlPoint(0);
            expect(bezierCurve.isComplete).toBeFalsy();
            expect(bezierCurve.getControlPoint(0)).toEqual(null);
            expect(bezierCurve.getControlPoint(1)).toBe(vector2);
        });
    });
    describe("isComplete", function() {
        beforeEach(function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1]);
            vector2 = new Vector().initWithCoordinates([2]);
            vector3 = new Vector().initWithCoordinates([3]);
        });
        it("should return expected values", function() {
            expect(bezierCurve.isComplete).toBeFalsy();
            bezierCurve.pushControlPoint(vector1);
            expect(bezierCurve.isComplete).toBeFalsy();
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.isComplete).toBeTruthy();
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.isComplete).toBeTruthy();
        });
        it("should return expected values", function() {
            expect(bezierCurve.isComplete).toBeFalsy();
            bezierCurve.setControlPoint(2, vector3);
            expect(bezierCurve.isComplete).toBeFalsy();
            bezierCurve.setControlPoint(1, vector2);
            expect(bezierCurve.isComplete).toBeFalsy();
            bezierCurve.setControlPoint(0, vector1);
            expect(bezierCurve.isComplete).toBeTruthy();
        });
    });
    describe("length", function() {
        beforeEach(function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1]);
            vector2 = new Vector().initWithCoordinates([2]);
            vector3 = new Vector().initWithCoordinates([3]);
        });
        it("should return expected values", function() {
            expect(bezierCurve.length).toEqual(0);
            bezierCurve.pushControlPoint(vector1);
            expect(bezierCurve.length).toEqual(1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.length).toEqual(2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.length).toEqual(3);
        });
    });
    describe("getCloserPointTo", function() {
        beforeEach(function() {
            bezierCurve = new BezierCurve().init();
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([0, 0]));
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([1, 0]));
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([2, 0]));
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([3, 0]));
        });
        it("should return expected values", function() {
            var result = bezierCurve.getCloserPointTo(new Vector().initWithCoordinates([1.5, 1]));

            expect(result.distance).toBeCloseTo(1, 3);
            expect(result.vector.x).toBeCloseTo(1.5, 3);
            expect(result.vector.y).toBeCloseTo(0, 3);
            expect(result.t).toBeCloseTo(0.5, 3);
        });
    });
    describe("value", function() {
        describe("for linear Bézier Curve", function() {
            it("should return expected result", function() {
                bezierCurve = new BezierCurve().init();
                vector1 = new Vector().initWithCoordinates([1]);
                vector2 = new Vector().initWithCoordinates([2]);
                bezierCurve.pushControlPoint(vector1);
                bezierCurve.pushControlPoint(vector2);
                var value = bezierCurve.value(0.4);

                expect(value.x).toBeCloseTo(1.4, 6);
            });
        });
        describe("for quadratic Bézier Curve", function() {
            it("should return expected result", function() {
                bezierCurve = new BezierCurve().init();
                vector1 = new Vector().initWithCoordinates([1, 3, 7]);
                vector2 = new Vector().initWithCoordinates([2, 5, 11]);
                vector3 = new Vector().initWithCoordinates([3, 13, 17]);
                bezierCurve.pushControlPoint(vector1);
                bezierCurve.pushControlPoint(vector2);
                bezierCurve.pushControlPoint(vector3);
                var value = bezierCurve.value(0.5);

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
                value = bezierCurve.value(0.25);
                expect(value.x).toBeCloseTo(1.5, 6);
            });
        });
        describe("for cubic Bézier Curve", function() {
            it("should return expected result", function() {
                bezierCurve = new BezierCurve().init();
                vector1 = new Vector().initWithCoordinates([1]);
                vector2 = new Vector().initWithCoordinates([2]);
                vector3 = new Vector().initWithCoordinates([3]);
                vector4 = new Vector().initWithCoordinates([4]);
                bezierCurve.pushControlPoint(vector1);
                bezierCurve.pushControlPoint(vector2);
                bezierCurve.pushControlPoint(vector3);
                bezierCurve.pushControlPoint(vector4);
                var value = bezierCurve.value(0.4);

                expect(value.x).toBeCloseTo(2.2, 6);
            });
        });
    });
    describe("translate", function() {
        it("should produce expected result", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1, 2]);
            vector2 = new Vector().initWithCoordinates([2, 3]);
            vector3 = new Vector().initWithCoordinates([3, 4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.translate([1, 2]);
            expect(bezierCurve.getControlPoint(0)._data).toEqual([2,4]);
            expect(bezierCurve.getControlPoint(1)._data).toEqual([3,5]);
            expect(bezierCurve.getControlPoint(2)._data).toEqual([4,6]);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1, 2]);
            vector2 = new Vector().initWithCoordinates([2, 3]);
            vector3 = new Vector().initWithCoordinates([3, 4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.translate([1, 2])).toBe(bezierCurve);
        });
    });
    describe("scale", function() {
        it("should produce expected result", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1, 2]);
            vector2 = new Vector().initWithCoordinates([2, 3]);
            vector3 = new Vector().initWithCoordinates([3, 4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.scale([2, 3]);
            expect(bezierCurve.getControlPoint(0)._data).toEqual([2,6]);
            expect(bezierCurve.getControlPoint(1)._data).toEqual([4,9]);
            expect(bezierCurve.getControlPoint(2)._data).toEqual([6,12]);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1, 2]);
            vector2 = new Vector().initWithCoordinates([2, 3]);
            vector3 = new Vector().initWithCoordinates([3, 4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.scale([2, 3])).toBe(bezierCurve);
        });
    });
    describe("rotate", function() {
        it("should produce expected result", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([1, 2]);
            vector2 = new Vector2().initWithCoordinates([2, 3]);
            vector3 = new Vector2().initWithCoordinates([3, 4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.rotate(Math.PI/2);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(-2, 6);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(1, 6);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(-3, 6);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(2, 6);
            expect(bezierCurve.getControlPoint(2).x).toBeCloseTo(-4, 6);
            expect(bezierCurve.getControlPoint(2).y).toBeCloseTo(3, 6);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([1, 2]);
            vector2 = new Vector2().initWithCoordinates([2, 3]);
            vector3 = new Vector2().initWithCoordinates([3, 4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.rotate(Math.PI/2)).toBe(bezierCurve);
        });
    });
    describe("rotateX", function() {
        it("should produce expected result", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1, 2, 3]);
            vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
            vector3 = new Vector3().initWithCoordinates([3, 4, 5]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.rotateX(Math.PI/2);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(1, 6);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(-3, 6);
            expect(bezierCurve.getControlPoint(0).z).toBeCloseTo(2, 6);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(2, 6);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(-4, 6);
            expect(bezierCurve.getControlPoint(1).z).toBeCloseTo(3, 6);
            expect(bezierCurve.getControlPoint(2).x).toBeCloseTo(3, 6);
            expect(bezierCurve.getControlPoint(2).y).toBeCloseTo(-5, 6);
            expect(bezierCurve.getControlPoint(2).z).toBeCloseTo(4, 6);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1, 2, 3]);
            vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
            vector3 = new Vector3().initWithCoordinates([3, 4, 5]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.rotateX(Math.PI/2)).toBe(bezierCurve);
        });
    });
    describe("rotateY", function() {
        it("should produce expected result", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1, 2, 3]);
            vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
            vector3 = new Vector3().initWithCoordinates([3, 4, 5]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.rotateY(Math.PI/2);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(3, 6);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(2, 6);
            expect(bezierCurve.getControlPoint(0).z).toBeCloseTo(-1, 6);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(4, 6);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(3, 6);
            expect(bezierCurve.getControlPoint(1).z).toBeCloseTo(-2, 6);
            expect(bezierCurve.getControlPoint(2).x).toBeCloseTo(5, 6);
            expect(bezierCurve.getControlPoint(2).y).toBeCloseTo(4, 6);
            expect(bezierCurve.getControlPoint(2).z).toBeCloseTo(-3, 6);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1, 2, 3]);
            vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
            vector3 = new Vector3().initWithCoordinates([3, 4, 5]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.rotateY(Math.PI/2)).toBe(bezierCurve);
        });
    });
    describe("rotateZ", function() {
        it("should produce expected result", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1, 2, 3]);
            vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
            vector3 = new Vector3().initWithCoordinates([3, 4, 5]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.rotateZ(Math.PI/2);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(-2, 6);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(1, 6);
            expect(bezierCurve.getControlPoint(0).z).toBeCloseTo(3, 6);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(-3, 6);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(2, 6);
            expect(bezierCurve.getControlPoint(1).z).toBeCloseTo(4, 6);
            expect(bezierCurve.getControlPoint(2).x).toBeCloseTo(-4, 6);
            expect(bezierCurve.getControlPoint(2).y).toBeCloseTo(3, 6);
            expect(bezierCurve.getControlPoint(2).z).toBeCloseTo(5, 6);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1, 2, 3]);
            vector2 = new Vector3().initWithCoordinates([2, 3, 4]);
            vector3 = new Vector3().initWithCoordinates([3, 4, 5]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            expect(bezierCurve.rotateZ(Math.PI/2)).toBe(bezierCurve);
        });
    });
    describe("transformMatrix", function() {
        it("should return expected value", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1000, 600, 123]);
            vector2 = new Vector3().initWithCoordinates([2000, 1200, 246]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.transformMatrix([0.5, 0.2, 0.7, 0.8, 300, 140]);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(1220, 2);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(820, 2);
            expect(bezierCurve.getControlPoint(0).z).toEqual(123);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(2140, 2);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(1500, 2);
            expect(bezierCurve.getControlPoint(1).z).toEqual(246);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([1000, 600, 123]);
            vector2 = new Vector3().initWithCoordinates([2000, 1200, 246]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.transformMatrix([0.5, 0.2, 0.7, 0.8, 300, 140])).toBe(bezierCurve);
        });
    });
    describe("transformMatrix3d", function() {
        it("should return expected value", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([2, 4, 6]);
            vector2 = new Vector3().initWithCoordinates([1, 2, 3]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.transformMatrix3d([
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
                5, 9, 13, 17
            ]);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(2 * 2 + 4 * 3 + 6 * 4 + 5, 5);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(2 * 6 + 4 * 7 + 6 * 8 + 9, 5);
            expect(bezierCurve.getControlPoint(0).z).toBeCloseTo(10 * 2 + 4 * 11 + 6 * 12 + 13, 5);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(1 * 2 + 2 * 3 + 3 * 4 + 5, 5);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(1 * 6 + 2 * 7 + 3 * 8 + 9, 5);
            expect(bezierCurve.getControlPoint(1).z).toBeCloseTo(10 * 1 + 2 * 11 + 3 * 12 + 13, 5);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector3().initWithCoordinates([2, 4, 6]);
            vector2 = new Vector3().initWithCoordinates([1, 2, 3]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.transformMatrix3d([
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
                5, 9, 13, 17
            ])).toBe(bezierCurve);
        });
    });
    describe("skewX", function() {
        it("should return expected value", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([2, 4]);
            vector2 = new Vector2().initWithCoordinates([1, 2]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.skewX(45 * Math.PI * 2 / 360);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(6, 5);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(4, 5);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(3, 5);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(2, 5);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([2, 4]);
            vector2 = new Vector2().initWithCoordinates([1, 2]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.skewX(45 * Math.PI * 2 / 360)).toBe(bezierCurve);
        });
    });
    describe("skewY", function() {
        it("should return expected value", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([2, 4]);
            vector2 = new Vector2().initWithCoordinates([1, 2]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.skewY(45 * Math.PI * 2 / 360);
            expect(bezierCurve.getControlPoint(0).x).toBeCloseTo(2, 5);
            expect(bezierCurve.getControlPoint(0).y).toBeCloseTo(6, 5);
            expect(bezierCurve.getControlPoint(1).x).toBeCloseTo(1, 5);
            expect(bezierCurve.getControlPoint(1).y).toBeCloseTo(3, 5);
        });
        it("should return this", function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([2, 4]);
            vector2 = new Vector2().initWithCoordinates([1, 2]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            expect(bezierCurve.skewY(45 * Math.PI * 2 / 360)).toBe(bezierCurve);
        });
    });
    describe("clone", function() {
        var bezierCurve, bezierCurve2, vector1, vector2;

        beforeEach(function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector2().initWithCoordinates([2, 4]);
            vector2 = new Vector2().initWithCoordinates([1, 2]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve2 = bezierCurve.clone();
        });
        it("should copy control points", function() {
            expect(bezierCurve2.getControlPoint(0).x).toEqual(2);
            expect(bezierCurve2.getControlPoint(0).y).toEqual(4);
            expect(bezierCurve2.getControlPoint(1).x).toEqual(1);
            expect(bezierCurve2.getControlPoint(1).y).toEqual(2);
        });
        it("after modifying coordinates of cloned bezierCurve control points, original bezierCurve should be intact", function() {
            bezierCurve2.getControlPoint(0).x = 5;
            expect(bezierCurve2.getControlPoint(0).x).toEqual(5);
            expect(bezierCurve.getControlPoint(0).x).toEqual(2);
        });
    });
    describe("split", function() {
        var bezierCurve = new BezierCurve().init(),
            rightPart,
            leftPart;

        bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([0, 0]));
        bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([2, 4]));
        bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([4, -4]));
        bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([6, 0]));
        rightPart = bezierCurve.split(0.25);
        leftPart = bezierCurve;
        it("left part control points should be the expected", function() {
            expect(leftPart.getControlPoint(0).x).toBeCloseTo(0, 5);
            expect(leftPart.getControlPoint(0).y).toBeCloseTo(0, 5);
            expect(leftPart.getControlPoint(1).x).toBeCloseTo(0.5, 5);
            expect(leftPart.getControlPoint(1).y).toBeCloseTo(1, 5);
            expect(leftPart.getControlPoint(2).x).toBeCloseTo(1, 5);
            expect(leftPart.getControlPoint(2).y).toBeCloseTo(1.25, 5);
            expect(leftPart.getControlPoint(3).x).toBeCloseTo(1.5, 5);
            expect(leftPart.getControlPoint(3).y).toBeCloseTo(1.125, 5);
        });
        it("right part control points should be the expected", function() {
            expect(rightPart.getControlPoint(0).x).toBeCloseTo(1.5, 5);
            expect(rightPart.getControlPoint(0).y).toBeCloseTo(1.125, 5);
            expect(rightPart.getControlPoint(1).x).toBeCloseTo(3, 5);
            expect(rightPart.getControlPoint(1).y).toBeCloseTo(0.75, 5);
            expect(rightPart.getControlPoint(2).x).toBeCloseTo(4.5, 5);
            expect(rightPart.getControlPoint(2).y).toBeCloseTo(-3, 5);
            expect(rightPart.getControlPoint(3).x).toBeCloseTo(6, 5);
            expect(rightPart.getControlPoint(3).y).toBeCloseTo(0, 5);
        });
        it("right part first control point should be a copy of right part last point", function() {
            expect(rightPart.getControlPoint(0)).not.toBe(leftPart.getControlPoint(3));
        });
    });
    describe("reverse", function() {
        var bezierCurve = new BezierCurve().init();

        beforeEach(function() {
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([0]));
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([1]));
        });
        it("even number of control points should be reversed", function() {
            bezierCurve.reverse();
            expect(bezierCurve.getControlPoint(0).x).toEqual(1);
            expect(bezierCurve.getControlPoint(1).x).toEqual(0);
        });
        it("odd number of control points should be reversed", function() {
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([2]));
            bezierCurve.reverse();
            expect(bezierCurve.getControlPoint(0).x).toEqual(2);
            expect(bezierCurve.getControlPoint(1).x).toEqual(1);
            expect(bezierCurve.getControlPoint(2).x).toEqual(0);
        });
        it("should return this", function() {
            expect(bezierCurve.reverse()).toBe(bezierCurve);
        });
    });
    describe("softAxisAlignedBoundaries", function() {
        var bezierCurve = new BezierCurve().init();

        beforeEach(function() {
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([0, 1]));
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([2, 3]));
        });
        it("should return expected results", function() {
            var boundaries = bezierCurve.softAxisAlignedBoundaries;
            expect(boundaries[0].min).toEqual(0);
            expect(boundaries[0].max).toEqual(2);
            expect(boundaries[1].min).toEqual(1);
            expect(boundaries[1].max).toEqual(3);
        });
    });
    describe("hardAxisAlignedBoundaries", function() {
        var bezierCurve = new BezierCurve().init();

        beforeEach(function() {
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([1, 0]));
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([2, 3]));
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([7, 6]));
            bezierCurve.pushControlPoint(new Vector2().initWithCoordinates([4, 5]));
        });
        it("should return expected results", function() {
            var boundaries = bezierCurve.hardAxisAlignedBoundaries;
            expect(boundaries[0].min).toBeCloseTo(1, 3);
            expect(boundaries[0].max).toBeCloseTo(4.946, 3);
            expect(boundaries[1].min).toBeCloseTo(0, 3);
            expect(boundaries[1].max).toBeCloseTo(5.1957, 3);
        });
    });
    describe("MapReducible functions", function() {
        var bezierCurve;

        beforeEach(function() {
            bezierCurve = new BezierCurve().init();
            vector1 = new Vector().initWithCoordinates([1]);
            vector2 = new Vector().initWithCoordinates([2]);
            vector3 = new Vector().initWithCoordinates([3]);
            vector4 = new Vector().initWithCoordinates([4]);
            bezierCurve.pushControlPoint(vector1);
            bezierCurve.pushControlPoint(vector2);
            bezierCurve.pushControlPoint(vector3);
            bezierCurve.pushControlPoint(vector4);
        });
        describe("every", function() {
            it("should work as expected", function() {
                expect(bezierCurve.every(function (controlPoint) {
                    return (controlPoint.getCoordinate(0) < 5);
                })).toBeTruthy();
                expect(bezierCurve.every(function (controlPoint) {
                    return (controlPoint.getCoordinate(0) < 3);
                })).toBeFalsy();
            });
        });
        describe("reduce", function() {
            it("should work as expected", function() {
                expect(bezierCurve.reduce(function (previous, next) {
                    return "" + previous + next.getCoordinate(0);
                }, "")).toEqual("1234");
            });
        });
        describe("reduceRight", function() {
            it("should work as expected", function() {
                expect(bezierCurve.reduceRight(function (previous, next) {
                    return "" + previous + next.getCoordinate(0);
                }, "")).toEqual("4321");
            });
        });
        describe("some", function() {
            it("should work as expected", function() {
                expect(bezierCurve.some(function (controlPoint) {
                    return (controlPoint.getCoordinate(0) > 2);
                })).toBeTruthy();
                expect(bezierCurve.some(function (controlPoint) {
                    return (controlPoint.getCoordinate(0) > 5);
                })).toBeFalsy();
            });
        });
        describe("forEach", function() {
            it("should work as expected", function() {
                var sum = 0;

                bezierCurve.forEach(function (controlPoint) {
                    sum += controlPoint.getCoordinate(0);
                });
                expect(sum).toEqual(10);
            });
        });
        describe("map", function() {
            it("should work as expected", function() {
                var result = bezierCurve.map(function (controlPoint) {
                    return controlPoint.getCoordinate(0) * 2;
                });
                expect(result).toEqual([2, 4, 6, 8]);
            });
        });
        describe("filter", function() {
            it("should work as expected", function() {
                var result = bezierCurve.filter(function (controlPoint) {
                    return controlPoint.getCoordinate(0) > 1;
                });
                expect(result[0].getCoordinate(0)).toEqual(2);
                expect(result[1].getCoordinate(0)).toEqual(3);
                expect(result[2].getCoordinate(0)).toEqual(4);
            });
        });
    });
});

/* Bézier Spline spec */

describe("pen-tool-math Bezier-Spline-spec", function() {
    var bezierSpline, bezierCurve1, bezierCurve2, vector1, vector2, vector3, vector4;

    describe("initialization using init", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
        });
        it("length should be defined", function() {
            expect(bezierSpline.length).toBeDefined();
        });
        it("length should be equal to 0", function() {
            expect(bezierSpline.length).toEqual(0);
        });
    });
    describe("adding/removing/getting Bezier curves", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([1]));
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([2]));
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([3]));
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([4]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([5]));
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([6]));
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([7]));
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([8]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("pushBezierCurve should work as expected", function() {
            expect(bezierSpline.length).toEqual(2);
        });
        it("getBezierCurve should work as expected", function() {
            expect(bezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(bezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
        });
        it("pushBezierCurve is linking Bézier curves correctly", function() {
            expect(bezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
        });
        it("popBezierCurve should work as expected", function() {
            var curve = bezierSpline.popBezierCurve();

            expect(bezierSpline.length).toEqual(1);
            expect(bezierSpline.getBezierCurve(1)).toEqual(null);
            expect(curve).toBe(bezierCurve2);
            expect(curve.getControlPoint(0).x).toEqual(4);
            expect(bezierSpline.getBezierCurve(0).getControlPoint(3).x).toEqual(4);
            expect(bezierSpline.getBezierCurve(0).getControlPoint(3)).not.toBe(curve.getControlPoint(0));
        });
        it("removeBezierCurve(0) should work as expected", function() {
            var rightSide = bezierSpline.removeBezierCurve(0);

            expect(rightSide).toEqual(null);
            expect(bezierSpline.length).toEqual(1);
            expect(bezierSpline.getBezierCurve(0).getControlPoint(0).x).toEqual(4);
            rightSide = bezierSpline.removeBezierCurve(0);
            expect(rightSide).toEqual(null);
            expect(bezierSpline.length).toEqual(0);
        });
        it("removeBezierCurve at last index should work as expected", function() {
            var rightSide = bezierSpline.removeBezierCurve(1);

            expect(rightSide).toEqual(null);
            expect(bezierSpline.length).toEqual(1);
            expect(bezierSpline.getBezierCurve(0).getControlPoint(0).x).toEqual(1);
        });
        it("removeBezierCurve at an index in the middle should work as expected", function() {
            var bezierCurve = new BezierCurve().init(),
                rightSide;

            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([9]));
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([10]));
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([11]));
            bezierCurve.pushControlPoint(new Vector().initWithCoordinates([12]));
            bezierSpline.pushBezierCurve(bezierCurve);
            rightSide = bezierSpline.removeBezierCurve(1);
            expect(rightSide.length).toEqual(1);
            expect(bezierSpline.length).toEqual(1);
            expect(bezierSpline.getBezierCurve(0).getControlPoint(0).x).toEqual(1);
            expect(rightSide.getBezierCurve(0).getControlPoint(0).x).toEqual(8);
        });
    });
    describe("axisAlignedBoundaries", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([0, 0]));
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([10, -50]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([10, -50]));
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([-20, 50]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("should return expected value", function() {
            var result = bezierSpline.axisAlignedBoundaries;

            expect(result[0].min).toBeCloseTo(-20, 3);
            expect(result[0].max).toBeCloseTo(10, 3);
            expect(result[1].min).toBeCloseTo(-50, 3);
            expect(result[1].max).toBeCloseTo(50, 3);
        });
        it("should return expected value when a curve is not complete", function() {
            var bezierCurve3 = new BezierCurve().init();
            bezierCurve3.pushControlPoint(new Vector().initWithCoordinates([100, 100]));
            bezierSpline.pushBezierCurve(bezierCurve3);

            var result = bezierSpline.axisAlignedBoundaries;

            expect(result[0].min).toBeCloseTo(-20, 3);
            expect(result[0].max).toBeCloseTo(10, 3);
            expect(result[1].min).toBeCloseTo(-50, 3);
            expect(result[1].max).toBeCloseTo(50, 3);
        });
    });
    describe("getCloserPointTo", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([0, 0]));
            bezierCurve1.pushControlPoint(new Vector().initWithCoordinates([10, 0]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([10, 0]));
            bezierCurve2.pushControlPoint(new Vector().initWithCoordinates([10, 10]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("should return expected value", function() {
            var result = bezierSpline.getCloserPointTo(new Vector().initWithCoordinates([5, -1]));

            expect(result.distance).toBeCloseTo(1, 3);
            expect(result.vector.x).toBeCloseTo(5, 3);
            expect(result.vector.y).toBeCloseTo(0, 3);
            expect(result.t).toBeCloseTo(0.5, 3);
            expect(result.index).toEqual(0);
            result = bezierSpline.getCloserPointTo(new Vector().initWithCoordinates([11, 5]));
            expect(result.distance).toBeCloseTo(1, 3);
            expect(result.vector.x).toBeCloseTo(10, 3);
            expect(result.vector.y).toBeCloseTo(5, 3);
            expect(result.t).toBeCloseTo(0.5, 3);
            expect(result.index).toEqual(1);
        });
    });
    describe("rotate", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([0, 0]));
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 10]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("should return expected value", function() {
            var result = bezierSpline.rotate(Math.PI / 2);

            expect(result.getBezierCurve(0).getControlPoint(0).x).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(0).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).x).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).y).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).x).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).y).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).x).toBeCloseTo(-10, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).y).toBeCloseTo(10, 5);
        });
    });
    describe("scale", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([0, 0]));
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 10]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("should return expected value", function() {
            var result = bezierSpline.scale([2, 3]);

            expect(result.getBezierCurve(0).getControlPoint(0).x).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(0).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).x).toBeCloseTo(20, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).x).toBeCloseTo(20, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).x).toBeCloseTo(20, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).y).toBeCloseTo(30, 5);
        });
    });
    describe("translate", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([0, 0]));
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 10]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("should return expected value", function() {
            var result = bezierSpline.translate([20, 30]);

            expect(result.getBezierCurve(0).getControlPoint(0).x).toBeCloseTo(20, 5);
            expect(result.getBezierCurve(0).getControlPoint(0).y).toBeCloseTo(30, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).x).toBeCloseTo(30, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).y).toBeCloseTo(30, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).x).toBeCloseTo(30, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).y).toBeCloseTo(30, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).x).toBeCloseTo(30, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).y).toBeCloseTo(40, 5);
        });
    });
    describe("splitCurveAtPosition", function() {
        beforeEach(function() {
            bezierSpline = new BezierSpline().init();
            bezierCurve1 = new BezierCurve().init();
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([0, 0]));
            bezierCurve1.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2 = new BezierCurve().init();
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 0]));
            bezierCurve2.pushControlPoint(new Vector2().initWithCoordinates([10, 10]));
            bezierSpline.pushBezierCurve(bezierCurve1);
            bezierSpline.pushBezierCurve(bezierCurve2);
        });
        it("should return expected value", function() {
            var result = bezierSpline.splitCurveAtPosition(1, 0.5);
            expect(result.getBezierCurve(0).getControlPoint(0).x).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(0).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).x).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(0).getControlPoint(1).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).x).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(1).getControlPoint(0).y).toBeCloseTo(0, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).x).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(1).getControlPoint(1).y).toBeCloseTo(5, 5);
            expect(result.getBezierCurve(2).getControlPoint(0).x).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(2).getControlPoint(0).y).toBeCloseTo(5, 5);
            expect(result.getBezierCurve(2).getControlPoint(1).x).toBeCloseTo(10, 5);
            expect(result.getBezierCurve(2).getControlPoint(1).y).toBeCloseTo(10, 5);
        });
    });
    xdescribe("clone", function() {
        it("test is missing", function() {
            expect(0).toBe(1);
        });
    });
    xdescribe("transformMatrix3d", function() {
        it("test is missing", function() {
            expect(0).toBe(1);
        });
    });
});

/* Cubic Bézier Spline spec */

describe("pen-tool-math Cubic-Bezier-Spline-spec", function() {
    var cubicBezierSpline,
        cubicBezierCurve1, cubicBezierCurve2, cubicBezierCurve3, cubicBezierCurve4,
        knot1, knot2, knot3, knot4, knot5, knot6;


    describe("initialization using init", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
        });
        it("length should be defined", function() {
            expect(cubicBezierSpline.length).toBeDefined();
        });
        it("length should be equal to 0", function() {
            expect(cubicBezierSpline.length).toEqual(0);
        });
    });

    describe("knot operations in complete splines", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(0, knot1 = new Vector().initWithCoordinates([1]));
            cubicBezierCurve1.setControlPoint(1, new Vector().initWithCoordinates([2]));
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot2 = new Vector().initWithCoordinates([4]));
            cubicBezierCurve2 = new BezierCurve().init();
            cubicBezierCurve2.setControlPoint(0, new Vector().initWithCoordinates([5]));
            cubicBezierCurve2.setControlPoint(1, new Vector().initWithCoordinates([6]));
            cubicBezierCurve2.setControlPoint(2, new Vector().initWithCoordinates([7]));
            cubicBezierCurve2.setControlPoint(3, knot3 = new Vector().initWithCoordinates([8]));
            cubicBezierCurve3 = new BezierCurve().init();
            cubicBezierCurve3.setControlPoint(0, new Vector().initWithCoordinates([9]));
            cubicBezierCurve3.setControlPoint(1, new Vector().initWithCoordinates([10]));
            cubicBezierCurve3.setControlPoint(2, new Vector().initWithCoordinates([11]));
            cubicBezierCurve3.setControlPoint(3, knot4 = new Vector().initWithCoordinates([12]));
            cubicBezierCurve4 = new BezierCurve().init();
            cubicBezierCurve4.setControlPoint(0, new Vector().initWithCoordinates([13]));
            cubicBezierCurve4.setControlPoint(1, new Vector().initWithCoordinates([14]));
            cubicBezierCurve4.setControlPoint(2, new Vector().initWithCoordinates([15]));
            cubicBezierCurve4.setControlPoint(3, knot5 = new Vector().initWithCoordinates([16]));
            knot6 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve2);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve3);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve4);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(0).getCoordinate(0)).toEqual(12);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(16);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getKnot(1).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getKnot(2).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getKnot(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getKnot(4).getCoordinate(0)).toEqual(16);
            expect(cubicBezierSpline.getKnot(5)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(5);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(4);
            expect(cubicBezierSpline.getIndexForKnot(knot6)).toEqual(null);
        });
        it("removeKnot from the left should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(3);
        });
        it("removeKnot from the right should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot5)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(null);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(7);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(15);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3).getCoordinate(0)).toEqual(16);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot3)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(15);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3).getCoordinate(0)).toEqual(16);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot4)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(7);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(15);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3).getCoordinate(0)).toEqual(16);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot6)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(5);
        });
    });
    describe("knot operations in incomplete splines by the left", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot1 = new Vector().initWithCoordinates([4]));
            cubicBezierCurve2 = new BezierCurve().init();
            cubicBezierCurve2.setControlPoint(0, new Vector().initWithCoordinates([5]));
            cubicBezierCurve2.setControlPoint(1, new Vector().initWithCoordinates([6]));
            cubicBezierCurve2.setControlPoint(2, new Vector().initWithCoordinates([7]));
            cubicBezierCurve2.setControlPoint(3, knot2 = new Vector().initWithCoordinates([8]));
            cubicBezierCurve3 = new BezierCurve().init();
            cubicBezierCurve3.setControlPoint(0, new Vector().initWithCoordinates([9]));
            cubicBezierCurve3.setControlPoint(1, new Vector().initWithCoordinates([10]));
            cubicBezierCurve3.setControlPoint(2, new Vector().initWithCoordinates([11]));
            cubicBezierCurve3.setControlPoint(3, knot3 = new Vector().initWithCoordinates([12]));
            cubicBezierCurve4 = new BezierCurve().init();
            cubicBezierCurve4.setControlPoint(0, new Vector().initWithCoordinates([13]));
            cubicBezierCurve4.setControlPoint(1, new Vector().initWithCoordinates([14]));
            cubicBezierCurve4.setControlPoint(2, new Vector().initWithCoordinates([15]));
            cubicBezierCurve4.setControlPoint(3, knot4 = new Vector().initWithCoordinates([16]));
            knot5 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve2);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve3);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve4);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(0).getCoordinate(0)).toEqual(12);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(16);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getKnot(1).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getKnot(2).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getKnot(3).getCoordinate(0)).toEqual(16);
            expect(cubicBezierSpline.getKnot(4)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(4);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(null);
        });
        it("removeKnot from the left should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
        });
        it("removeKnot from the right should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot4)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(null);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(15);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3).getCoordinate(0)).toEqual(16);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot3)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(7);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(15);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3).getCoordinate(0)).toEqual(16);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot5)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
        });
    });
    describe("knot operations in incomplete splines by the right", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(0, knot1 = new Vector().initWithCoordinates([1]));
            cubicBezierCurve1.setControlPoint(1, new Vector().initWithCoordinates([2]));
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot2 = new Vector().initWithCoordinates([4]));
            cubicBezierCurve2 = new BezierCurve().init();
            cubicBezierCurve2.setControlPoint(0, new Vector().initWithCoordinates([5]));
            cubicBezierCurve2.setControlPoint(1, new Vector().initWithCoordinates([6]));
            cubicBezierCurve2.setControlPoint(2, new Vector().initWithCoordinates([7]));
            cubicBezierCurve2.setControlPoint(3, knot3 = new Vector().initWithCoordinates([8]));
            cubicBezierCurve3 = new BezierCurve().init();
            cubicBezierCurve3.setControlPoint(0, new Vector().initWithCoordinates([9]));
            cubicBezierCurve3.setControlPoint(1, new Vector().initWithCoordinates([10]));
            cubicBezierCurve3.setControlPoint(2, new Vector().initWithCoordinates([11]));
            cubicBezierCurve3.setControlPoint(3, knot4 = new Vector().initWithCoordinates([12]));
            cubicBezierCurve4 = new BezierCurve().init();
            cubicBezierCurve4.setControlPoint(0, new Vector().initWithCoordinates([13]));
            cubicBezierCurve4.setControlPoint(1, new Vector().initWithCoordinates([14]));
            knot5 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve2);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve3);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve4);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(0).getCoordinate(0)).toEqual(12);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(12);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getKnot(1).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getKnot(2).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getKnot(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getKnot(4)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(4);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot5)).toEqual(null);
        });
        it("removeKnot from the left should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
        });
        it("removeKnot from the right should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot4)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(null);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(7);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3)).toEqual(null);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot3)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3)).toEqual(null);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot5)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(4);
        });
    });
    describe("knot operations in incomplete splines in both sides", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot1 = new Vector().initWithCoordinates([4]));
            cubicBezierCurve2 = new BezierCurve().init();
            cubicBezierCurve2.setControlPoint(0, new Vector().initWithCoordinates([5]));
            cubicBezierCurve2.setControlPoint(1, new Vector().initWithCoordinates([6]));
            cubicBezierCurve2.setControlPoint(2, new Vector().initWithCoordinates([7]));
            cubicBezierCurve2.setControlPoint(3, knot2 = new Vector().initWithCoordinates([8]));
            cubicBezierCurve3 = new BezierCurve().init();
            cubicBezierCurve3.setControlPoint(0, new Vector().initWithCoordinates([9]));
            cubicBezierCurve3.setControlPoint(1, new Vector().initWithCoordinates([10]));
            cubicBezierCurve3.setControlPoint(2, new Vector().initWithCoordinates([11]));
            cubicBezierCurve3.setControlPoint(3, knot3 = new Vector().initWithCoordinates([12]));
            cubicBezierCurve4 = new BezierCurve().init();
            cubicBezierCurve4.setControlPoint(0, new Vector().initWithCoordinates([13]));
            cubicBezierCurve4.setControlPoint(1, new Vector().initWithCoordinates([14]));
            knot4 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve2);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve3);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve4);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(0).getCoordinate(0)).toEqual(12);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(12);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getKnot(1).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getKnot(2).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getKnot(3)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(3);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot4)).toEqual(null);
        });
        it("removeKnot from the left should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
        });
        it("removeKnot from the right should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot3)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(null);
        });
        it("removeKnot from the middle should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(3);
            expect(cubicBezierSpline.knotsLength).toEqual(2);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(3).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(3).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2)).toEqual(null);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(3)).toEqual(null);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot4)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(3);
        });
    });
    describe("knot operations in empty splines", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            knot1 = new Vector().initWithCoordinates([0]);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(0);
            expect(cubicBezierSpline.getBezierCurve(0)).toEqual(null);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot).toEqual(null);
            expect(cubicBezierSpline.lastKnot).toEqual(null);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0)).toEqual(null);
            expect(cubicBezierSpline.getKnot(1)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(0);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(0);
        });
    });
    describe("knot operations in spline width single complete curve", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(0, knot1 = new Vector().initWithCoordinates([1]));
            cubicBezierCurve1.setControlPoint(1, new Vector().initWithCoordinates([2]));
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot2 = new Vector().initWithCoordinates([4]));
            knot3 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(4);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getKnot(1).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getKnot(2)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(2);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot3)).toEqual(null);
        });
        it("removeKnot from the left should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(1);
            expect(cubicBezierSpline.knotsLength).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(0);
        });
        it("removeKnot from the right should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(1);
            expect(cubicBezierSpline.knotsLength).toEqual(1);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot3)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(2);
        });
    });
    describe("knot operations in spline width single incomplete curve by the left", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot1 = new Vector().initWithCoordinates([4]));
            knot2 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(4);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getKnot(1)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(1);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
        });
        it("removeKnot from the left should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(0);
            expect(cubicBezierSpline.knotsLength).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(1);
        });
    });
    describe("knot operations in spline width single incomplete curve by the right", function() {
        beforeEach(function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(0, knot1 = new Vector().initWithCoordinates([1]));
            cubicBezierCurve1.setControlPoint(1, new Vector().initWithCoordinates([2]));
            knot2 = new Vector().initWithCoordinates([0]);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
        });
        it("spline should be properly initialized", function() {
            expect(cubicBezierSpline.length).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
        });
        it("firstKnot and lastKnot should work properly", function() {
            expect(cubicBezierSpline.firstKnot.getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.lastKnot.getCoordinate(0)).toEqual(1);
        });
        it("getKnot should work properly", function () {
            expect(cubicBezierSpline.getKnot(-1)).toEqual(null);
            expect(cubicBezierSpline.getKnot(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getKnot(1)).toEqual(null);
        });
        it("knotsLength should return expected results", function () {
            expect(cubicBezierSpline.knotsLength).toEqual(1);
        });
        it("getIndexForKnot should return expected results", function () {
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot2)).toEqual(null);
        });
        it("removeKnot from the right should work as expected", function () {
            expect(cubicBezierSpline.removeKnot(knot1)).toEqual(true);
            expect(cubicBezierSpline.length).toEqual(0);
            expect(cubicBezierSpline.knotsLength).toEqual(0);
            expect(cubicBezierSpline.getIndexForKnot(knot1)).toEqual(null);
        });
        it("removeKnot with a knot that is not part of the spline should return false", function () {
            expect(cubicBezierSpline.removeKnot(knot2)).toEqual(false);
            expect(cubicBezierSpline.knotsLength).toEqual(1);
        });
    });
    describe("save and restore operations", function() {
        it("should work as expected", function() {
            cubicBezierSpline = new CubicBezierSpline().init();
            cubicBezierCurve1 = new BezierCurve().init();
            cubicBezierCurve1.setControlPoint(0, knot1 = new Vector().initWithCoordinates([1]));
            cubicBezierCurve1.setControlPoint(1, new Vector().initWithCoordinates([2]));
            cubicBezierCurve1.setControlPoint(2, new Vector().initWithCoordinates([3]));
            cubicBezierCurve1.setControlPoint(3, knot2 = new Vector().initWithCoordinates([4]));
            cubicBezierCurve2 = new BezierCurve().init();
            cubicBezierCurve2.setControlPoint(0, new Vector().initWithCoordinates([5]));
            cubicBezierCurve2.setControlPoint(1, new Vector().initWithCoordinates([6]));
            cubicBezierCurve2.setControlPoint(2, new Vector().initWithCoordinates([7]));
            cubicBezierCurve2.setControlPoint(3, knot3 = new Vector().initWithCoordinates([8]));
            cubicBezierCurve3 = new BezierCurve().init();
            cubicBezierCurve3.setControlPoint(0, new Vector().initWithCoordinates([9]));
            cubicBezierCurve3.setControlPoint(1, new Vector().initWithCoordinates([10]));
            cubicBezierCurve3.setControlPoint(2, new Vector().initWithCoordinates([11]));
            cubicBezierCurve3.setControlPoint(3, knot4 = new Vector().initWithCoordinates([12]));
            cubicBezierCurve4 = new BezierCurve().init();
            cubicBezierCurve4.setControlPoint(0, new Vector().initWithCoordinates([13]));
            cubicBezierCurve4.setControlPoint(1, new Vector().initWithCoordinates([14]));
            cubicBezierCurve4.setControlPoint(2, new Vector().initWithCoordinates([15]));
            cubicBezierCurve4.setControlPoint(3, knot5 = new Vector().initWithCoordinates([16]));
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve1);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve2);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve3);
            cubicBezierSpline.pushBezierCurve(cubicBezierCurve4);
            cubicBezierSpline.save();
            cubicBezierSpline.translate([100]);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(101);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(102);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(103);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(104);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(106);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(107);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(108);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(110);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(111);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(0).getCoordinate(0)).toEqual(112);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(1).getCoordinate(0)).toEqual(114);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(2).getCoordinate(0)).toEqual(115);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(3).getCoordinate(0)).toEqual(116);
            cubicBezierSpline.restore();
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(0).getCoordinate(0)).toEqual(1);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(1).getCoordinate(0)).toEqual(2);
            expect(cubicBezierSpline.getBezierCurve(0).getControlPoint(2).getCoordinate(0)).toEqual(3);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(0).getCoordinate(0)).toEqual(4);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(1).getCoordinate(0)).toEqual(6);
            expect(cubicBezierSpline.getBezierCurve(1).getControlPoint(2).getCoordinate(0)).toEqual(7);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(0).getCoordinate(0)).toEqual(8);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(1).getCoordinate(0)).toEqual(10);
            expect(cubicBezierSpline.getBezierCurve(2).getControlPoint(2).getCoordinate(0)).toEqual(11);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(0).getCoordinate(0)).toEqual(12);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(1).getCoordinate(0)).toEqual(14);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(2).getCoordinate(0)).toEqual(15);
            expect(cubicBezierSpline.getBezierCurve(3).getControlPoint(3).getCoordinate(0)).toEqual(16);
        });
    });
});