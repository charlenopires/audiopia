Template.music.rendered = function() {
    var fields = MusicPaginated.table.fields;
    if(_.isEqual(fields, ['title', 'artist', 'album'])) {
        var headers = this.findAll('thead th');
        for(var i in headers) {
            var className = 'uk-width-1-4';
            if(fields[i] == 'title') {
                className = 'uk-width-1-2';
            }
            $(headers[i]).addClass(className);
        }
    }
};
