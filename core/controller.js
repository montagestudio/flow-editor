var Montage = require("montage").Montage;

exports.Controller = Montage.create(Montage, {

    hasEditor: {
        value: function () {
            return true;
        }
    },

    editorComponent: {
        value: function () {
            return require.async("ui/editor.reel").get("Editor");
        }
    }

});