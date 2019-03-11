const express = require('express')
const FolderService = require('../folder/folders-service')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
  .route('/')
  .get((req,res,next)=>{
    NotesService.getAll(req.app.get('db'))
      .then((notes)=>{
        res.status(200).json(notes)
      })
      .catch(next)
  })
  .post(jsonParser, (req,res,next)=>{
    const { title, content, folder} = req.body
    const newNote = { title, content, folder }
    
    for(const field of Object.values(newNote)){
      if (field == null) {
        return res.status(400).json({
          error: {message: `'title', 'content', 'folder' are required!`}
        }).end()
      } 
    }
    NotesService.addNote(
      req.app.get('db'),
      newNote
    )
      .then((note)=>{
        res.status(201).json(note)
      })
      .catch(next)
  })


notesRouter
  .use('/:note_id', (req,res,next)=>{
    NotesService.getNoteById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if(!note) {
          res.status(404).json({
            error: {message: `Note with id ${req.params.note_id} doesn't exist.`}
          })
        } else {
          req.note = note
          next()
          return null
        }
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')
  .get((req,res,next)=>
    res.status(200).json(req.note)
  )
  .delete((req,res,next)=>{
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(()=>{
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req,res,next)=>{
    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      req.body
    )
      .then(()=>{
        res.status(200).json({
          message: 'Succesfully updated!'
        })
      })
      .catch(next)
  })
  

module.exports = notesRouter