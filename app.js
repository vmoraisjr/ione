var express     = require('express');
var load        = require('express-load');
var bodyParser  = require('body-parser');
var ejs         = require('ejs');
var jade		= require('jade');//***
var mongoose    = require('mongoose').set('debug', true);
var session     = require('express-session');

var app = express();

// view engine setup
app.set('view engine', 'ejs');
//app.set('view engine', 'jade');//***
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.locals.pretty = true;

app.set('trust proxy', 1)
app.use(session({
	secret: 'secret cat',
	resave: false,
	saveUninitialized: true,
	cookie:{scure: true}
}));

//instance routes to mvc
load('models').then('controllers').then('routes').into(app);

//configur server port
app.listen(3000, function(err){
	if (err) {
		console.log('erro ao estabelecer conexão com servidor '+ err);
	}else{
		console.log('Servidor estabelecido em http://localhost:3000'); 
	}
})

//configure data base connection - mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ioneappbd', function (err) {
	if (err){
		console.log('erro ao conectar com banco de dados '+ err);
	}else{
		console.log('Conectado ao banco de dados (Mongodb)');
	}
});


/*
views
	index	{cad_usuario, login}
	home	{}
	jardim	{cad_jardim}{editar}
	usuario {editar}{red_senha}{red_senha_email}
	relatorio {}

	*/

