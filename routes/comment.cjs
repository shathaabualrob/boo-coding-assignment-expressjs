'use strict';

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.cjs')

module.exports = function() {
    
    router.get('/:profileId', async function (req,res, next){
        try {
            const comment = await Comment.findById(req.params.profileId)
            if (comment == null)
                return res.status(404).json({message: 'Cannot find comment'})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    })

    router.get('/', async function (req,res, next){
        try{
            const comments = await Comment.find()
            if(req.query.mtbi){
                const filteredComments = comments.filter((comment)=>{comment.mtbi = req.params.mtbi})
                res.json(filteredComments)
            }else if(req.query.enneagram){
                const filteredComments = comments.filter((comment)=>{comment.enneagram = req.params.enneagram})
                res.json(filteredComments)
            }else if(req.query.zodiac){
                const filteredComments = comments.filter((comment)=>{comment.zodiac = req.params.zodiac})
                res.json(filteredComments)
            }else if(req.query.sort){
                if(req.query.sort == 'recent'){
                    const filteredComments = comments.sort((comment1, comment2) => comment1.createdAt - comment2.createdAt).reverse()
                    res.json(filteredComments)
                }else if(req.query.sort == 'best'){
                    const filteredComments = comments.sort((comment1,comment2)=> comment1.likes.length - comment2.likes.length).reverse()
                    res.json(filteredComments)
                }
            }
            else
                res.json(comments)
          }catch(error){
            res.status(500).json({message: error.message})
          }
    })

    router.post('', async function (req,res, next) {
        const profileId = req.params.profileId
        // must check if id is found in the db
        const comment = new Comment({
            title: req.body.title,
            description: req.body.description,
            mtbi: req.body.mtbi,
            enneagram: req.body.enneagram,
            zodiac: req.body.zodiac,
            profile: profileId
        })
        try {
            const newComment = await comment.save()
            res.status(201).json(newComment)
        } catch (error) {
            res.status(400).json({message: error.message})
        }
        
    })    

    router.put('/:commentId', async function (req,res, next){
        let comment
        try {
            comment = await Comment.findById(req.params.commentId)
            if (req.body.value == "like")
                comment.likes.push(req.headers.userid)
            else if(req.body.value == "unlike")
                comment.likes.remove(req.headers.userid)
            const updatedComment = await comment.save()
            return res.status(201).json(updatedComment)
        } catch (error) {
            res.status(400).json({message: error.message})
        }   
    })  
    // async function getComments(req,res,next){
    //     let comments
    //     try {
    //         comments = await Comment.find()
    //         if (comments == null)
    //             return res.status(404).json({message: 'Cannot find any comments'})
    //     } catch (error) {
    //         res.status(500).json({message: error.message})
    //     }
    //     res.comments = comments
    //     next()
    // }
    return router;
  }

  