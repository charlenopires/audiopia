Router.configure({
    layoutTemplate: '_layout'
});

Router.route('/', function () {
    this.render('Home');
});
