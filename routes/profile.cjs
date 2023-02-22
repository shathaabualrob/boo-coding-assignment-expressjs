'use strict';

const express = require('express');
const router = express.Router();
const Profile = require('../models/profile.cjs')

const profiles = [
  {
    "id": 1,
    "name": "A Martinez",
    "description": "Adolph Larrue Martinez III.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png",
  }
];

module.exports = function() {

  router.get('/:id',getProfile, async function(req, res, next) {
    try{
      if (res.profile)
        res.render('profile_template', {
          profile: res.profile,
        });
      }catch(error){
        res.status(500).json({message: error.message})
      }
  }); 

  router.get('/', async function(req, res, next) {
    try{
      const allProfiles = await Profile.find()
      res.json(allProfiles)
    }catch(error){
      res.status(500).json({message: error.message})
    }
  }); 

  router.post('', async function (req,res, next) {
    const profile = new Profile({
      name: req.body.name,
      description: req.body.description
    })
    try {
      const newProfile = await profile.save()
      res.render('profile_template', {
        profile: newProfile,
      });
    } catch (error) {
      res.status(400).json({message: error.message})
    }
  })
  

  // this middleware will be used to retrieve user based on id for GET, PUT, and DELETE requests
  async function getProfile(req,res,next){
    let profile 
    try {
      profile = await Profile.findById(req.params.id)
      if(profile == null){
        return res.status(404).json({message: 'Cannot find profile'})
      }
    } catch (error) {
      res.status(500).json({message: error.message})
    }
    res.profile = profile
    next()
  }
  return router;
}

