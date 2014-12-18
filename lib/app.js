Meteor.methods({
    addSong: function(song) {
        return Music.insert(_.extend(song, {
            owner: this.userId
        }));
    }
});
