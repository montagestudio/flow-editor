var Montage = require("montage").Montage;

exports.Controller = Montage.specialize({

}, {

    hasEditor: {
        value: true
    },

    editorComponent: {
        value: function () {
            return require.async("ui/editor.reel").get("Editor");
        }
    }

});
