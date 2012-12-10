var Montage = require("montage").Montage,
    Vector = require("flow-editor/ui/pen-tool.reel/pen-tool-math").Vector;

describe("pen-tool-math-spec", function() {

    describe("initialization", function() {

        describe("using init", function() {
            var vector;
            beforeEach(function() {
                vector = Vector.create().init();
            });

            it("should define empty coordinates", function() {
                expect(vector._coordinates).toBeDefined();
                expect(vector._coordinates.length).toEqual(0);
            });
        });
        describe("using initWithCoordinates", function() {
            var vector;
            var coordinates = [1,2];
            beforeEach(function() {
                vector = Vector.create().initWithCoordinates();
            });

            it("should define expected coordinates", function() {
                expect(vector._coordinates).toBeDefined();
                expect(vector._coordinates[1]).toEqual(1);
                expect(vector._coordinates[2]).toEqual(2);
            });

        });
    });

});