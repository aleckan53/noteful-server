require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folder/folders-router')
const notesRouter = require('./notes/notes-router')
const NotesService = require('./notes/notes-service')
const FolderService = require('./folder/folders-service')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())


app.get('/', (req,res, next)=>{
  const knexInstance = req.app.get('db')

  FolderService.gettAll(knexInstance)
    .then(folders=> {
      NotesService.getAll(knexInstance)
        .then(notes=>{
          res.status(200).json({
            folders,
            notes
          })
        })
        .catch(next)
    })
})

app.use('/folders', foldersRouter)
app.use('/notes', notesRouter)

app.use(function errorHandler (error, req, res, next){
  let response 
  if (NODE_ENV === 'production'){
    response = {error: {message: 'server error'}}
  } else {
    console.error(error)
    response = {message: error.message, error}
  }

  res.status(500).json(response)
})

module.exports = app