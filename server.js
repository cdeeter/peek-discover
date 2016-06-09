var http           = require('http');
var express        = require('express');
var nodemailer     = require('nodemailer');
var fs             = require('fs');
var bodyParser     = require('body-parser');
var swig           = require('swig');
var EmailTemplates = require('swig-email-templates');

var app = express();

var membershipData = [
  {
    type: "standard",
    name: "Adventurer",
    price: "$20.00",
    description: "The Adventurer subscription offers fun activities right in your neighborhood such as historic walking tours, bike tours and family-friendy scavenger hunts.",
  },
  {
    type: "gold",
    name: "Explorer",
    price: "$50.00",
    description: "Do a variety of activities with our Explorer subscription, including food and cocktail tours, vintage VW bus tours and major city attractions.",
  },
  {
    type: "platinum",
    name: "Voyager",
    price: "$100.00",
    description: "With our Voyager subscription, experience thrilling outdoor adventures such as seaplane or hot air balloon tours, luxourious wine country tours, or private sailing charters.",
  },
];

var activityData = [
  {
    name: 'Boat Tour',
    description: 'Boat tour of SF',
    categories: ['Boat Tours & Cruises', 'Sailing', 'Whale Watching'],
    membership: 'gold',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Fishing Trip',
    description: 'A great fishing trip in SF',
    categories: ['Fishing Charters & Trips', 'Whale Watching'],
    membership: 'gold',
    date: 'Saturday June 14th, 9:00 AM',
  },
  {
    name: 'Street Art Tour',
    description: 'See beautiful art!',
    categories: ['Art & Street Art Tours', 'Cultural Tours', 'Neighborhood Tours', ' Historical & Heritage Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 12:00 PM',
  },
  {
    name: 'Food Tour',
    description: 'Eat delicious food!',
    categories: ['Cultural Tours', 'Neighborhood Tours', 'Food Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 1:00 PM',
  },
  {
    name: 'Booze Cruise',
    description: 'Have a great time!',
    categories: ['Boat Tours & Cruises', 'Dining Experiences', 'Sailing'],
    membership: 'platinum',
    date: 'Saturday June 14th, 4:00 PM',
  },
  {
    name: 'VIP Club Experience',
    description: 'Live like a VIP',
    categories: ['Nightlife', 'Bar & Pub Crawl'],
    membership: 'platinum',
    date: 'Saturday June 14th, 10:00 PM',
  }
];

var getPossibleActivities = function (membershipType, categories) {
  var activitiesWithMembership = activityData.filter(function (activity) {
    return activity.membership === membershipType;
  });

  return activitiesWithMembership.filter(function (activity) {
    var hasCategory = false;
    categories.forEach(function (category) {
      if (activity.categories.indexOf(category) !== -1) {
        hasCategory = true;

        return true;
      }
    });

    return hasCategory;
  });
};

var getMembershipData = function (membershipType) {
  return membershipData.filter(function (item) {
    return item.type === membershipType;
  });
};

var sendActivityEmail = function (userData) {
  var directConfig       = 'direct:?name=Gmail';
  var transporter        = nodemailer.createTransport(directConfig);
  var templates          = new EmailTemplates({root: __dirname});
  var possibleActivities = getPossibleActivities(userData.membership.type, userData.categories);
  var randomNum          = Math.floor(Math.random() * (possibleActivities.length - 0 + 1) + 0);
  var randomActivity     = possibleActivities[randomNum];
  var context = {
    userData    : userData,
    activityData: randomActivity,
  };

  templates.render('activity_email.html', context, function(err, html, text) {
    if (err) {
      res.status('500');
      return console.log(err);
    }

    transporter.sendMail({
      from   : 'discover@peek.com',
      to     : userData.email,
      subject: 'Welcome to peekDiscover!',
      html   : html
    });
  });
};

app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded());

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('port', (process.env.PORT || 8080));

app.post('/signup', function (req, res) {
  var directConfig = 'direct:?name=Gmail';
  var transporter  = nodemailer.createTransport(directConfig);
  var templates    = new EmailTemplates({root: __dirname});
  var categories   = req.body.selectedCategories.split(", ").slice(0, -1);
  var membership   = getMembershipData(req.body.selectedMembership);
  var titleize     = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  var context = {
    categories: categories,
    membership: membership[0],
    firstName : titleize(req.body.firstName),
    lastName  : titleize(req.body.lastName),
    location  : req.body.location,
    email     : req.body.email,
  };

  templates.render('signup_email.html', context, function(err, html, text) {
    if (err) {
      res.status('500');
      return console.log(err);
    }

    transporter.sendMail({
      from   : 'discover@peek.com',
      to     : req.body.email,
      subject: 'Welcome to peekDiscover!',
      html   : html
    }, function(err){
      console.log(err);
    });
  });

  setTimeout(sendActivityEmail(context), 30000);

  res.sendFile('confirmation.html', {root: __dirname });
});

app.listen(app.get('port'));
