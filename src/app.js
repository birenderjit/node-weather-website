const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//console.log(__dirname);
//console.log(path.join(__dirname, '..', '/public'));

const app = express();
const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, '..', '/public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars and the views path
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to use
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Marco Polo'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Marco Polo'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: "This is the help page!!",
    title: 'Help',
    name: "Marco Polo"
  });
});

// app.get('/help', (req, res) => {
//   res.send('<h1>Help</h1>');
// });

// app.get('/about', (req, res) => {
//   res.send('<h1>About</h1>');
// });

app.get('/weather', (req, res) => {

  if (!req.query.address) {
    return res.send({
      error: "Please provide a address to search"
    });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        address: req.query.address,
        location,
        forecast: forecastData
      });
    });
  });

  //console.log(req.query.address);

});

app.get('/products', (req, res) => {

  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    });
  }
  console.log(req.query.search);

  res.send({
    products: []
  });

});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Marco Polo',
    errorMessage: 'Help article not found.'
  })
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Marco Polo',
    errorMessage: 'Page Not found.'
  })
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});