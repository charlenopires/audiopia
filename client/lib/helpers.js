WebRTC = null;

Meteor.startup(function () {
    Meteor.loginVisitor();

});

Tracker.autorun(function() {
    var loginId = Meteor.userId();
    if(loginId) {
        WebRTC = new Peer(loginId, {key: '62is9f6ozx2mx6r'});
        WebRTC.on('connection', function(conn) {
            var id = conn.metadata.song;
            conn.on('open', function() {
                var data = MusicData.findOne({_id: id});
                if(!data) {
                } else {
                    var request = new XMLHttpRequest();
                    request.open('GET', data.url, true);
                    request.responseType = 'blob';
                    request.onload = function(error) {
                        if(this.status == 200) {
                            var reader = new FileReader();
                            reader.onload = (function(e) {
                                var context = new AudioContext();
                                context.decodeAudioData(e.target.result, function(buffer) {
                                    var remote = context.createMediaStreamDestination();
                                    var source = context.createBufferSource();
                                    source.buffer = buffer;
                                    source.start(0);
                                    source.connect(remote);
                                    WebRTC.call(conn.peer, remote.stream, {metadata:{song:id}});
                                });
                            });
                            reader.readAsArrayBuffer(this.response);
                        }
                    }
                    request.send();
                }
            });
        });
        WebRTC.on('call', function(call) {
            call.answer(null);
            call.on('stream', function(stream) {
                var dataUrl = URL.createObjectURL(stream);
                var player = new Audio(dataUrl);
                player.play();
            });
        });
    }
});
