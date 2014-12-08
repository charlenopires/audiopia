WebRTC = null;

Meteor.startup(function () {
    Meteor.loginVisitor();

});

Tracker.autorun(function() {
  var loginId = Meteor.userId();
  if(loginId) {
    WebRTC = new Peer(loginId, {key: '62is9f6ozx2mx6r'});
    WebRTC.on('connection', function(conn) {
        var data = MusicData.findOne({_id: conn.metadata.song});
        if(!data) {
        } else {
            conn.on('open', function() {
                var request = new XMLHttpRequest();
                request.open('GET', data.url, true);
                request.responseType = 'blob';
                request.onload = function(error) {
                    if(this.status == 200) {
                        conn.send(this.response);
                    }
                }
                request.send();
            });
        }
    });
  }
});
