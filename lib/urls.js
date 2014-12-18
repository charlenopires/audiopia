Router.configure({
    layoutTemplate: '_layout',
    onBeforeAction: function() {
        if(!Meteor.userId()) {
            Meteor.loginVisitor();
        } else {
            this.next();
        }
    }
});

Router.route('/', function() {
    this.render('Dashboard');
},{
    name: 'dashboard'
});

Router.route('/music', function() {
    this.render('Music');
}, {
    name: 'music',
    onBeforeAction: function() {
        Session.set('query', {});
        this.next();
    }
});

Router.route('/music/local', function() {
    this.render('Music', {
    });
}, {
    name: 'music.local',
    onBeforeAction: function() {
        Session.set('query', {
            owner: Meteor.userId()
        });
        this.next();
    }
});
