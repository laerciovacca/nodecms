// 1 — Chamar as dependências (modules dependencies)
const logger = require('koa-logger');
const route = require('koa-route');
const views = require('co-views');
const parse = require('co-body');
const koa = require('koa');
const app = koa();
const contatoController = require('./controllers/contatoController');
// 2 — Criar as variáveis ou arrays de armazenamento de dados
const contatos = [];
// 3 — Criar os middlewares, o garçom que vai trabalhar entre a mesa e a cozinha
app.use(logger());
// 4 — Criar as rotas, o caminho a ser percorrido separado por portas para cada caso
app.use(route.get('/', list));
app.use(route.get('/contato/new', add));
app.use(route.get('/contato/:id', show));
app.use(route.get('/contato/delete/:id', remove));
app.use(route.get('/contato/edit/:id', edit));
app.use(route.post('/contato/create', create));
app.use(route.post('/contato/update', update));
contatoController(app,route);

// 5 — Vamos deixar a tela (VIEW) mais inteligente para conversar como o CONTROLLER e o modules
const render = views(__dirname + '/views', { map: { html: 'swig' }});
// 6 — Vamos criar as funções para cada ação passada pela rota para o CRUD sendo elas
// 6.1 — Listar(list)
function *list() {
  this.body = yield render('index', { contatos: contatos });
}
// 6.2 — Adicionar(add)
function *add() {
 this.body = yield render('new');
}
// 6.3 — Editar(edit)
function *edit(id) {
 var contato = contatos[id];
 if (!contato) this.throw(404, 'invalid contato id');
 this.body = yield render('edit', { contato: contato });
}
// 6.4 — Mostrar(show)
function *show(id) {
 var contato = contatos[id];
 if (!contato) this.throw(404, 'invalid contato id');
 this.body = yield render('show', { contato: contato });
}
// 6.5 — Apagar(remove)
function *remove(id) {
 var contato = contatos[id];
 if (!contato) this.throw(404, 'invalid contato id');
 contatos.splice(id,1);
 //Changing the Id for working with index
 for (var i = 0; i < contatos.length; i++)
 {
 contatos[i].id=i;
 }
 this.redirect('/');
}
// 6.6 — Criar(create)
function *create() {
 var contato = yield parse(this);
 contato.created_on = new Date;
 contato.updated_on = new Date;
 var id = contatos.push(contato);
 contato.id = id-1;//Id with index of the array
 this.redirect('/');
}
// 6.7 — Atualizar(update)
function *update() {
 var contato = yield parse(this);
 var index=contato.id;
 contatos[index].nome=contato.nome;
 contatos[index].telefone=contato.telefone;
 contatos[index].operadora=contato.operadora;
 contatos[index].updated_on = new Date;
 this.redirect('/');
}
// 7 — Iniciar o servidor http
const server = require('http').createServer(app.callback());
server.listen(5000);
console.log('listening on port 5000');