Meteor.startup(function () {
    Meteor.users.find({'status.online': true}).observe({
        added: function(user) {
        },
        removed: function(user) {
            Music.remove({'owner': user._id});
        }
    });
});
