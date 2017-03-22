var koa = require('koa');
var app = koa();
 
app.use(function *(next){
this.type = 'json';
    this.status = 200;
    this.body = {'Welcome': 'Essa é uma aplicação Olá Mundo de nível 2!!'};
});
 
if (!module.parent) app.listen(3000);
console.log('Olá Mundo executando em http://localhost:3000/');