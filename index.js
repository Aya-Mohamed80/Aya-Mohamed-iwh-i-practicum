const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,lastname,email,university,lname,age',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const contacts = response.data.results;
    res.render('homepage', { title: 'Homepage', contacts });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error.response?.data || error.message);
    res.send('❌ Error fetching contacts');
  }
});

// GET form route
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// POST form route
app.post('/update-cobj', async (req, res) => {
  const { firstname, lastname, email, university, lname, age } = req.body;

  try {
    await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      { properties: { firstname, lastname, email, university, lname, age } },
      { headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }
    );

    res.redirect('/');
  } catch (error) {
    console.error('❌ Error creating contact:', error.response?.data || error.message);
    res.send('❌ Error occurred while creating the contact');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
