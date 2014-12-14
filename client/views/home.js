Template.home.events({
    'change input[type=file]': function(event, template) {
        var files = event.target.files;
        for(var i in files) {
            MusicManager.addSong(files[i]);
        }
    },
    'click tbody tr': function(event, template) {
        var song = this;
        MusicManager.localStorage.getAsDataUrl(song._id, function(dataUrl) {
            if(!dataUrl) {
                WebRTC.stream(song);
            } else {
                AudioPlayer.loadFromDataUrl(dataUrl, song);
            }
        });
    }
});
