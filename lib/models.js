Music = new Mongo.Collection('music');

fields = ['title', 'artist', 'album']

MusicPaginated = new Meteor.Pagination(Music, {
    infinite: true,
    fastRender: true,
    perPage: 100,
    sort: {
        artist: 1,
        year: -1,
        album: 1,
        track: 1
    },
    table: {
        class: 'uk-table uk-table-striped uk-table-hover',
        fields: fields,
        header: _.map(fields, function(f) {
            return f[0].toUpperCase() +  f.slice(1);
        })
    },
    availableSettings: {
        filters: true
    },
});

if(Meteor.isClient) {
    Tracker.autorun(function() {
        var query = Session.get('query');
        if(query) {
            MusicPaginated.set({
                filters: query
            });
        }
    });
}
