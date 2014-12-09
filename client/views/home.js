var audio = new Audio();
audio.play();

Template.home.helpers({
    music: function() {
        return Music.find();
    }
});

Template.home.events({
    'change input[type=file]': function(event, template) {
        var files = event.target.files;
        for(var i in files) {
            var file = files[i];
            try {
                MusicManager.addSong(file);
            } catch(e) { /* ignore invalid file */ }
        }
    },
    'click ul li': function(event, template) {
        var song = this;
        var data = MusicData.findOne({ _id: song._id});
        if(!data) {
            WebRTC.stream(audio, song);
        } else {
            audio.src = data.url;
        }
    }
});
