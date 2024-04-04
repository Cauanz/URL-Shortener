const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/ShortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
   const shortUrls = await ShortUrl.find();
   res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({ full: req.body.fullUrl })
   res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
   const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

   if(shortUrl === null){
      res.status(404).json({ message: 'Url não encontrada' })
   }

   shortUrl.clicks++
   shortUrl.save()

   res.redirect(shortUrl.full)
})



app.listen(8080);