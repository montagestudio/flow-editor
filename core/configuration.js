var FlowEditorConfig = {

    viewPort: {
        _types: null,

        matrix: {
            top: [
                0.1,  0,    0,   0,
                0,    0,    1,   0,
                0,    0.1,  0,   0,
                0,    0,    0,   1
            ],
            front: [
                0.1,  0,    0,   0,
                0,    0.1,  0,   0,
                0,    0,    1,   0,
                0,    0,    0,   1
            ],
            profile: [
                0,    0,    0.1, 0,
                0,    0.1,  0,   0,
                0.1,  0,    0,   0,
                0,    0,    0,   1
            ]
        }
    }

};

Object.defineProperty(FlowEditorConfig.viewPort, "types", {
    configurable: false,
    get: function () {
        if (this._types === null) {
            var types = this._types = {};

            Object.keys(FlowEditorConfig.viewPort.matrix).forEach(function (key) {
                types[key] = key
            });
        }

        return this._types;
    }
});

exports.FlowEditorConfig = FlowEditorConfig;
