let controller = function(app,route){
    app.use(route.get('/laercio', function *(){
        this.body = 'vai manow!! ';
    }));
};

module.exports = controller;