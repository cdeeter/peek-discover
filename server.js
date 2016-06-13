var http           = require('http');
var express        = require('express');
var nodemailer     = require('nodemailer');
var fs             = require('fs');
var bodyParser     = require('body-parser');
var swig           = require('swig');
var EmailTemplates = require('swig-email-templates');
var LocalStorage   = require('node-localstorage').LocalStorage;
var localStorage   = new LocalStorage('./scratch');


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
    name: 'Aquarium of the Bay Behind the Scenes Tour',
    description: "Go behind the scenes at the Aquarium of the Bay. Traverse the catwalk above the tanks, and learn how the staff cares for 20,000 marine animals.",
    categories: ['Aquarium Tickets & Passes', 'Museum Tickets & Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Aquarium of the Bay Feed the Sharks Tour',
    description: "Go behind the scenes at the Aquarium of the Bay and have the opportunity to feed the sharks and other marine animals.",
    categories: ['Aquarium Tickets & Passes', 'Museum Tickets & Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Cannery Row Full Day Bike Rental',
    description: "Spend a full day exploring the shops and restaurants of historic Cannery Row with a full day bike rental.",
    categories: ['Neighborhood Tours', 'Sight Seeing', 'Bike Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 9:00 AM',
  },
  {
    name: 'Portola Hotel Full Day Bike Rental',
    description: "Coast along bike lanes and nature trails on a 7-speed bike, exploring the sights the city has to offer.",
    categories: ['Neighborhood Tours', 'Sight Seeing', 'Bike Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 9:00 AM',
  },
  {
    name: 'Union Square & Chinatown Walking Tour',
    description: "Stroll the streets of Chinatown and Union Square to discover local landmarks and learn their history with the help of your knowledgable guide.",
    categories: ['Neighborhood Tours', 'Sight Seeing', 'Walking Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Financial District Walking Tour',
    description: "Learn the history behind this business-minded area and uncover local landmarks thanks to the experienced guides who lead the walking tour.",
    categories: ['Neighborhood Tours', 'Sight Seeing', 'Walking Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'San Francisco Bay Cruise',
    description: "Score unforgettable views of The City by the Bay on this popular narrated sightseeing boat tour.",
    categories: ['Boat Tours & Cruises', 'Sight Seeing'],
    membership: 'standard',
    date: 'Saturday June 14th, 2:00 PM',
  },
  {
    name: 'CA Academy of Sciences Planetarium Pass',
    description: "Sit back and tour the universe in the world’s largest all-digital planetarium. Fly through star shows and watch live NASA feeds.",
    categories: ['Planetarium Tickets & Tours', 'Museum Tickets & Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 12:00 PM',
  },
  {
    name: 'Breakwater Cove SUP Kayak Rental',
    description: "Embark on your own marine safari and paddle past a myriad of the wildlife. Spot harbor seals, otters, sea lions and more on a stand-up paddleboard rental in Breakwater Cove's peaceful waters.",
    categories: ['Water Sports', 'Boat Rentals & Charters'],
    membership: 'standard',
    date: 'Saturday June 14th, 12:30 PM',
  },
  {
    name: 'Exploratorium',
    description: "Explore endlessly with this museum’s hands-on and interactive science and art displays; a fun outing for all ages.",
    categories: ['Museum Tickets & Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Aquarium of the Bay',
    description: "Watch the sea creatures that live in the bay in this small aquarium on Fisherman’s Wharf. See sharks and more through underwater glass tunnels.",
    categories: ['Museum Tickets & Tours', 'Aquarium Tickets & Passes'],
    membership: 'standard',
    date: 'Saturday June 14th, 10:30 AM',
  },
  {
    name: 'Improv Show',
    description: "Performers draw on random audience suggestions to barrel through an array of improvised comedy sketches and shows.",
    categories: ['Shows & Entertainment'],
    membership: 'standard',
    date: 'Saturday June 14th, 8:00 PM',
  },
  {
    name: 'Victorian Home Walking Tour',
    description: "Learn about San Francisco’s stately Victorian houses on a guided walk around Pacific Heights and Cow Hollow.",
    categories: ['Neighborhood Tours', 'Sight Seeing', 'Walking Tours'],
    membership: 'standard',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Mission Sweets',
    description: "Take your sweet tooth for a stroll and explore the Mission District’s world famous collection of mouthwatering treats and delicacies.",
    categories: ['Food Tours', 'Walking Tours', 'Historical Sites & Mouments'],
    membership: 'gold',
    date: 'Saturday June 14th, 1:00 PM',
  },
  {
    name: 'Gourmet Chocolate Tour',
    description: "Explore San Francisco on foot while filling up on history and sweet treats from the city’s most decadent chocolate boutiques.",
    categories: ['Food Tours', 'Walking Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 1:00 PM',
  },
  {
    name: 'Portfolio Wine Tasting',
    description: "Sample 4-5 of Viader Vineyard's current wines as you learn details of each and about the winery’s history.",
    categories: ['Wine Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 4:00 PM',
  },
  {
    name: 'Local Inventions Tour',
    description: "Learn about the inventions that have been imagined in and around San Francisco, and dive into the science that’s gone into creating them.",
    categories: ['Neighborhood Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 2:30 PM',
  },
  {
    name: 'Chinatown Tour',
    description: "Learn about this fascinating neighborhood as you walk around markets, temples, streets, and passageways with an experienced guide.",
    categories: ['Neighborhood Tours', 'Walking Tours', 'Cultural Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 2:00 PM',
  },
  {
    name: 'Little Italy Walking Tour',
    description: "Taste your way through San Francisco’s Little Italy neighborhoor on a guided walking tour. Try pizza, olive oil, pastries, and more.",
    categories: ['Neighborhood Tours', 'Walking Tours', 'Sight Seeing', 'Food Tours', 'Cultural Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 12:30 PM',
  },
  {
    name: 'Bridge and Beach Tour',
    description: "Walk along the Golden Gate Bridge and beyond on this guided tour that explores the rugged and scenic coastline in San Francisco.",
    categories: ['Neighborhood Tours', 'Walking Tours', 'Sight Seeing'],
    membership: 'gold',
    date: 'Saturday June 14th, 12:30 PM',
  },
  {
    name: 'Fisherman Wharf & North Beach Walking Tour',
    description: "Discover the colorful history behind the tourist surface of Fisherman’s Wharf, Coit Tower and Lombard Street on this exclusive walking tour.",
    categories: ['Neighborhood Tours', 'Walking Tours', 'Sight Seeing'],
    membership: 'gold',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Haunted Walking Ghost Tour',
    description: "Hunt for ghosts on this walking tour through Chinatown, where you’ll see a magician conjure up a spirit and learn local myths and legends.",
    categories: ['Ghost Tours', 'Walking Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 6:00 PM',
  },
  {
    name: 'Golden Gate Promenade Running Tour',
    description: "From Alcatraz to the Golden Gate, the Marin Headlands to the Palace of Fine Arts, there’s plenty to see on this guided urban run.",
    categories: ['Running Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Lands End & Legion of Honor Running Tour',
    description: "Jog your way from the crashing surf of Ocean Beach through wooded Land’s End, catching stunning views of the Bay and its iconic sights.",
    categories: ['Running Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Peaks and Ponds Running Tour',
    description: "Get a bird's eye view of Golden Gate Park from Strawberry Hill to running among redwoods within the Grove.",
    categories: ['Running Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 10:30 AM',
  },
  {
    name: 'Peaks and Ponds Running Tour',
    description: "Get a bird's eye view of Golden Gate Park from Strawberry Hill to running among redwoods within the Grove.",
    categories: ['Running Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 9:30 AM',
  },
  {
    name: 'Breakwater Cove Kayak Tour',
    description: "Paddle among the kelp forests of Monterey Harbor and along the historic buildings of Cannery Row on a kayak tour of Breakwater Cove.",
    categories: ['Water Sports'],
    membership: 'gold',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Ultimate Tandem Skydiving',
    description: "Thrill-seekers will love this skydive adventure – jump out of a plane at 18,000-ft! During this 90 second free-fall, you'll enjoy coasting through the air with a professional strapped along your back for your safety.",
    categories: ['Extreme Sports'],
    membership: 'gold',
    date: 'Saturday June 14th, 12:00 PM',
  },
  {
    name: 'Musical Performance',
    description: "Laugh the night away at this musical performance featuring clever jokes on current events and enormous hats.",
    categories: ['Shows & Entertainment'],
    membership: 'gold',
    date: 'Saturday June 14th, 9:00 PM',
  },
  {
    name: 'Stewart Trail Horseback Riding Tour',
    description: "Ride along the shady trails of Point Reyes on a well-tamed horse, for a relaxing and fun horseback tour. If you're new to horseback riding, this leisurely tour is ideal for you.",
    categories: ['Horseback Riding Tours'],
    membership: 'gold',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Beers and Bikes SF',
    description: "Get an inside taste of San Francisco's best brews, while seeing several diverse neighborhoods on this combination beer and bike tour. Visit SOMA, Height and the Mission, and try some cold local beers along the way!",
    categories: ['Breweries & Beer Tours', 'Sight Seeing'],
    membership: 'platinum',
    date: 'Saturday June 14th, 2:00 PM',
  },
  {
    name: 'Custom North Bay Brewery Tour',
    description: "Enjoy custom transportation for a wine or beer tour, never worrying about driving. Tell your driver where you want to go and enjoy the ride!",
    categories: ['Breweries & Beer Tours', 'Nightlife'],
    membership: 'platinum',
    date: 'Saturday June 14th, 1:00 PM',
  },
  {
    name: 'Private Gondola Ride',
    description: "Cruise around Oakland’s Lake Merritt in a gondola ride for two, with an experienced gondolier who will guide and serenade you.",
    categories: ['Boat Tours & Cruises'],
    membership: 'platinum',
    date: 'Saturday June 14th, 3:00 PM',
  },
  {
    name: 'Fir Top Horseback Riding',
    description: "See everything the Inverness Ridge has to offer without worrying about being in a big group. With a private tour, you get one-on-one attention that will allow for a more intimate horseback ride with a professional and help you discover the area's natural wildlife.",
    categories: ['Horseback Riding Tours'],
    membership: 'platinum',
    date: 'Saturday June 14th, 1:00 PM',
  },
  {
    name: 'Ed Levin Park Horseback Riding',
    description: "Trot past Sandy Wool Lake, a favorite spot for fishing, and see picturesque views of the Santa Clara Valley while atop a calm and well trained horse.",
    categories: ['Horseback Riding Tours'],
    membership: 'platinum',
    date: 'Saturday June 14th, 12:00 PM',
  },
  {
    name: 'Private Architectural Tour',
    description: "Walk around San Francisco with an expert architect to learn the stories behind the buildings that comprise SF's memorable skyline.",
    categories: ['Historical & Heritage Tours', 'Historical Sites & Monuments'],
    membership: 'platinum',
    date: 'Saturday June 14th, 11:00 AM',
  },
  {
    name: 'Private Mission Neighborhood Tour',
    description: "See how this neighborhood developed and visit Mission Dolores on a walking tour around the district with a local guide.",
    categories: ['Historical & Heritage Tours', 'Cultural Tours', 'Historical Sites & Monuments', 'Sight Seeing'],
    membership: 'platinum',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Limousine Wine Tour',
    description: "Forget having to drive yourself around wine country, with a private designated driver behind the wheel, you'll get to enjoy wine tasting visiting without any hassle. Get picked up and dropped off at all your favorite wineries, and hot spots in Napa Valley!",
    categories: ['Wine Tours'],
    membership: 'platinum',
    date: 'Saturday June 14th, 7:00 PM',
  },
  {
    name: 'Wine & Cheese Tasting',
    description: "Sample some of the vineyards best varietals, complemented with cheese pairings in this exclusive tasting experience.",
    categories: ['Wine Tours'],
    membership: 'platinum',
    date: 'Saturday June 14th, 6:00 PM',
  },
  {
    name: 'Science of Bread and Cheese Cooking Workshop',
    description: "This is not your average food tour; instead you’ll learn what goes into making that delicious bread and cheese. Then chow down on a picnic.",
    categories: ['Cooking Classes'],
    membership: 'platinum',
    date: 'Saturday June 14th, 1:00 PM',
  },
  {
    name: 'San Francisco CityPASS',
    description: "Get access to some of SF’s top sights, plus coupons and a week of unlimited Muni and cable car transportation in this value pass.",
    categories: ['Sight Seeing'],
    membership: 'platinum',
    date: 'Saturday June 14th, 10:00 AM',
  },
  {
    name: 'Wharf & Waterfront Segway Tour',
    description: "Roll on a Segway around San Francisco’s waterfront while a guide narrates the tour. You’ll get views of the bay and the Golden Gate Bridge.",
    categories: ['Sight Seeing'],
    membership: 'platinum',
    date: 'Saturday June 14th, 11:00 AM',
  },
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
  var randomNum          = Math.floor(Math.random() * ((possibleActivities.length - 1) + 1) + 0);
  var randomActivity     = possibleActivities[randomNum];
  var context = {
    userData    : userData,
    activityData: randomActivity,
  };

  global.account = JSON.stringify(context);
  global.userData = userData;
  // localStorage.setItem('account', JSON.stringify(context));

  var sendActivityEmail = function () {
    templates.render('activity_email.html', context, function(err, html, text) {
      if (err) {
        res.status('500');
        return console.log(err);
      }

      transporter.sendMail({
        from   : 'discover@peek.com',
        to     : userData.email,
        subject: 'Your peekDiscover activity is coming up!',
        html   : html
      });
    });
  };

  setTimeout(sendActivityEmail, 60000);

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
    raw       : req.body,
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
      if (err) {
        console.log(err);
      }
    });
  });

  sendActivityEmail(context);

  res.sendFile('confirmation.html', {root: __dirname });
});

app.get('/profile', function (req, res) {
  // res.send(localStorage.getItem('account'));
  res.send(global.account);
});

app.post('/login', function (req, res) {
  var userInfo = global.userData;

  if (!req.body.email || !req.body.password) {
    res.send('No user.');
  } else if (req.body.password === userInfo.raw.password && req.body.email === userInfo.email) {
    res.send('Success!');
  } else {
    res.send('No user.');
  }
});

app.listen(app.get('port'));
