import express from 'express';
import Note from '../models/Note.js';
import fetchuser from '../middleware/fetchuser.js'

const router= express.Router();

//Create a note: Login Required,POST method,  api/notes/addnote
router.post('/addnote',fetchuser,async (req,res)=>{
    try{
        let note = await Note.create({
            title : req.body.title,
            description : req.body.description,
            tag : req.body.tag,
            user : req.user.id
        })
        res.json(note);

    }
    catch(error){
        res.status(500).send("Internal server error.")
    }
})


//Fetch all note: login required, GET method, api/notes/getnotes
router.get('/getnotes',fetchuser,async (req,res)=>{
    try{
        let notes = await Note.find({user : req.user.id})
        res.json(notes)
    }
    catch(error){
        res.status(500).send("Internal server error.")
    }
})


//Update a note : Login required, PUT method, api/notes/editnote/:id
router.put('/editnote/:id',fetchuser,async (req,res)=>{
    try{
        let {title,tag,description}= req.body;
        let newNote = {};
        if(title) newNote.title = title;
        newNote.tag = tag;
        if(description) newNote.description = description;

        let note = await Note.findById(req.params.id);
        if(!note || note.user.toString() !== req.user.id ){
            return res.status(400).send("Not allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id,{$set : newNote}, {new : true})
        res.send(note);
    }
    catch(error){
        res.status(500).send("Internal server error.")
    }
})


//Delete a note: login required, DELETE method, api/notes/deletenote/:id
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try{
        let note = await Note.findById(req.params.id);
        if(!note){
           return res.status(400).send("Not found")
        }
        if(note.user.toString()!== req.user.id ){
           return res.status(400).send("Action Not Allowed.")
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.send({success : "Note deleted successfully", note})
    }
    catch(error){
        res.status(500).send("Internal server error.")
    }
})


export default router;