Meteor.startup(function () {
    Hooks.init();
    Meteor.loginVisitor();

    UIkit.domObserve('body');
});
