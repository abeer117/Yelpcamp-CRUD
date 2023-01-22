///// all the require's////////

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campgrounds')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

///////////////////////////////


/////middlewares////

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

/////middlewares///



////////mongoose connection//////////
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Mongoose connection open!')
    })
    .catch(err=>{
        console.log('Error Not working')
        console.log(err)
    })
////////mongoose connection//////////


////view/////
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
////view/////


///root directory///
app.get('/', (req,res)=>{
    res.render('home')
})
//////rooot////////


/////home of yelpcamp////
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})

})
//////////////*********//////



//CREATE yelpcamp///

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
})


app.post('/campgrounds', async(req,res)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()

    res.redirect(`/campgrounds/${campground._id}`)

})
//////////////*****//////////




////for show or Read yelpcamp/////

app.get('/campgrounds/:id', async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
})
/////////////////////



///update////

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const campground = await Campground.findById(req.params.id)

    res.render('campgrounds/edit',{campground})
})

app.put('/campgrounds/:id', async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

///////////



////delete////
app.delete('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)

    res.redirect('/campgrounds')
})
//////////



////listen port////

app.listen(3000, ()=>{
    console.log('Yelpcamp server on port 3000!')
})

///////////////////