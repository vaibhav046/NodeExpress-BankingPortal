const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const accountData = fs.readFileSync(path.join(__dirname, '/json/accounts.json'), 'UTF8');
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(path.join(__dirname, '/json/users.json'), 'UTF8');
const users = JSON.parse(userData);

app.get('/', (req, res) => {
    res.render('index', { title: 'Account Summary', accounts: accounts });
})

app.get('/savings', (req, res) => {
    res.render('account', { account: accounts.savings });
});

app.get('/checking', (req, res) => {
    res.render('account', { account: accounts.checking });
});

app.get('/credit', (req, res) => {
    res.render('account', { account: accounts.credit });
});

app.get('/profile', (req, res) => {
    res.render('profile', { user: users[0] });
});

app.get('/transfer', (req, res) => {
    res.render('transfer');
});

app.post('/transfer', (req, res) => {
    let from = req.body.from;
    let to = req.body.to;
    console.log(req.body);
    let amount = parseInt(req.body.amount);
    accounts[from].balance = accounts[from].balance - amount;
    accounts[to].balance = parseInt(accounts[to].balance) + amount;
    const accountsJSON = JSON.stringify(accounts, null, 4);
    fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8');
    res.render('transfer', { message: "Transfer Completed" });
});

app.get('/payment', (req, res) => {
    res.render('payment', { account: accounts.credit });
});

app.post('/payment', (req, res) => {
    accounts.credit.balance = req.body.amount - accounts.credit.balance;
    accounts.credit.available = parseInt(accounts.credit.available) + parseInt(req.body.amount);
    const accountsJSON = JSON.stringify(accounts, null, 4);
    fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8');
    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

app.listen(3000, () => {
    console.log('server running');

});