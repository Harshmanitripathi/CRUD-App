const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

router.get('/', async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

router.get('/new', (req,res) => {
    res.render('campgrounds/new')
})

router.post('/', async(req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
})

router.get('/:id', async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
})

router.get('/:id/edit', async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
})

router.put('/:id', async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
});

router.delete('/:id', async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the Campground!')
    res.redirect('/campgrounds');
})

module.exports = router;