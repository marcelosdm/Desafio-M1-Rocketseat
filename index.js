const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const moment = require('moment');
const bodyParser = require('body-parser');

const app = express();

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.render('main');
});

app.post('/check', (req, res) => {
	const { nome, nascimento } = req.body;
	const dataNascimento = moment(nascimento).format('DD/MM/YYYY');
	const idade = moment().diff(moment(nascimento, 'DD/MM/YYYY'), 'years');

	if (idade < 18) {
		res.redirect(`/minor?nome=${nome}`)
	}
	res.redirect(`/major?nome=${nome}`)
});

const validate = (req, res, next) => {
	if (!req.query.nome) {
		return res.redirect('/');
	}
	return next();
};

app.get('/major', validate, (req, res) => {
	res.render('major', { nome: req.query.nome });
});

app.get('/minor', validate, (req, res) => {
	res.render('minor', { nome: req.query.nome });
});

app.listen(3000);
