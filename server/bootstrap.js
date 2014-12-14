Meteor.startup(function () {
    Meteor.publish('music', function(){
        return Music.find();
    });

    Meteor.users.find({'status.online': true}).observe({
        added: function(user) {
        },
        removed: function(user) {
            Music.remove({'owner': user._id});
        }
    });
});
