Template.music.rendered = function() {
    var fields = MusicPaginated.table.fields;
    if(_.isEqual(fields, ['title', 'artist', 'album'])) {
        var headers = this.findAll('thead th');
        for(var i in headers) {
            var className = 'col-md-3';
            if(fields[i] == 'title') {
                className = 'col-md-6';
            }
            $(headers[i]).addClass(className);
        }
    }
};
