var http           = require('http');
var express        = require('express');
var nodemailer     = require('nodemailer');
var fs             = require('fs');
var bodyParser     = require('body-parser');
var swig           = require('swig');
var EmailTemplates = require('swig-email-templates');

var app = express();

app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded());

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('port', (process.env.PORT || 8080));

app.post('/email', function (req, res) {
  var directConfig = 'direct:?name=Gmail';
  var transporter = nodemailer.createTransport(directConfig);
  var templates = new EmailTemplates({root: __dirname});
  var signupTemplate = 'signup_email.html'
  var context = {
    firstName: req.body.firstName
  };

  templates.render('views/signup_email.html', context, function(err, html, text) {
    if (err) {
      res.status('500');
      return console.log(err);
    }

    transporter.sendMail({
      from: 'test@peek.com',
      to: req.body.email,
      subject: 'Welcome to Peek | Discover!',
      html: html
    });
  });

  res.status('200').send('Success!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
