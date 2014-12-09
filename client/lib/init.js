Meteor.startup(function () {
    Hooks.init();
    Meteor.loginVisitor();
});
