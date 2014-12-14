Meteor.startup(function () {
    Hooks.init();
    Meteor.loginVisitor();
    Meteor.subscribe('music');
});
