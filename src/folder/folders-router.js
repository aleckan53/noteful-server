const express = require('express')
const FolderService = require('./folders-service')
const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter
  .route('/')
  .get((req,res)=>{
    FolderService.gettAll(req.app.get('db'))
      .then(folders=>
        res.status(200)
          .json(folders)
      )
  })
  .post(jsonParser, (req,res,next)=>{

    if(!req.body.title) {
      res.status(400).json({
        error: {message: 'title is required'}
      })
    } else {
      FolderService.addFolder(
        req.app.get('db'),
        req.body.title
      )
        .then(()=>{
          res.status(204).end()
        })
        .catch(next)  
    }
  })

foldersRouter
  .use('/:folder_id', (req,res,next)=>{
    FolderService.getFolderById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if(!folder) {
          res.status(404).json({
            error: {message: `Folder with id ${req.params.folder_id} doesn't exist.`}
          })
        } else {
          next()
          return null
        }
      })
      .catch(next)
  })

foldersRouter
  .route('/:folder_id')
  .get((req,res,next)=>{
    FolderService.getNotesInFolder(
      req.app.get('db'), 
      req.params.folder_id
    )
      .then(notes => {
        res.json(notes) 
      })
      .catch(next)
  })
  .delete((req,res,next)=>{
    FolderService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(()=>{
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req,res,next)=>{
    FolderService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      req.body.title
    )
      .then((fldr)=>{
        res.status(204).json(fldr)
      })
      .catch(next)
  })
  
module.exports = foldersRouter
