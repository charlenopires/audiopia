Hooks = {
    init: function() {
        Tracker.autorun(function() {
            var userId = Meteor.userId();
            if(!userId && Hooks._loggedIn) {
                Hooks.onLoggedOut(userId);
                Hooks._loggedIn = false;
            } else if(!Hooks._loggedIn) {
                Hooks._loggedIn = true;
                Hooks.onLoggedIn(userId);
            }
        });
    },
    _loggedIn: false,
    onLoggedIn: function(userId){
    },
    onLoggedOut: function(userId){
    }
};
