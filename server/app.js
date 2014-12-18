Meteor.startup(function () {
    Music.remove({});
    Meteor.users.find({'status.online': true}).observe({
        added: function(user) {
        },
        removed: function(user) {
            Music.remove({'owner': user._id});
        }
    });
});
