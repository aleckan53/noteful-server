const app = require('../src/app')
const knex = require('knex')
const { notes, folders } = require('./data.fixtures').makeArrayOf

describe('Folders endpoints', () => {
  let db

  before('make knex instance', ()=>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })  
    app.set('db', db)
  })
  after('disconnect form db', ()=> db.destroy())
  before('clean the tables', ()=>db.raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE;'))
  afterEach('clean the tables', ()=>db.raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE;'))

  describe('GET /', ()=>{
    context('Given no data in db', ()=>{
      it('responds with 200 and an empty object', ()=>{
        return supertest(app)
          .get('/folders')
          .expect(200, [])
      })
    })

    context('Given folders and notes in db', ()=>{

      beforeEach('insert data in db', ()=>
        db.into('folders').insert(folders())
          .then(()=> db.into('notes').insert(notes()))
      )

      it('responds with 200 and list of folders and notes', ()=>{
        return supertest(app)
          .get('/folders')
          .expect(200, folders())
      })
    })
  })

  describe('GET /folders/:folder_id', ()=>{
    context('Given no folders', ()=>{
      it('responds with 404', ()=>{
        return supertest(app)
          .get('/folders/9999')
          .expect(404, {
            error: {message: `Folder with id 9999 doesn't exist.`}
          })
      })
    })

    context('Given there are folders', ()=>{

      beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
        .then(()=> db.into('notes').insert(notes()))
      ) 
      it('responds with 200 and list of notes', ()=>{
        return supertest(app)
          .get('/folders/1')
          .expect(200, notes().filter(n=>n.id === 1))
      })
    })
  })

  describe('POST /folders', ()=>{
    it('responds with 404 if no title supplied', ()=>{
      return supertest(app)
        .post('/folders')
        .send()
        .expect(400, {
          error: {message: 'title is required'}
        })
    })

    it('responds with 204 if title is present', ()=>{
      return supertest(app)
        .post('/folders')
        .send({title: 'testTitle'})
        .expect(204)
    })
  })
  
  describe('DELETE /folders/:folder_id',()=>{
    context('Given no folders in db', ()=>{
      it(`responds with 404 if id doesn't exist`, ()=>{
        return supertest(app)
          .delete('/folders/9999')
          .expect(404, {
            error: {message: `Folder with id 9999 doesn't exist.`}
          })
      })
    })
    context('Given there are folders in db', ()=>{
      beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
        .then(()=> db.into('notes').insert(notes()))
      ) 

      it(`responds with 204 and removes specified folder`, ()=>{
        return supertest(app)
          .delete('/folders/1')
          .expect(204)
          .then(()=>supertest(app)
            .get('/folders/1')
            .expect(404, {
              error: {message: `Folder with id 1 doesn't exist.`}
            })
          )
      })  
    })
  })

  describe('PATCH /folders/folder_id', ()=>{
    context('Given no folders in db', ()=>{
      it('responds with 404', ()=>{
        return supertest(app)
          .delete('/folders/9999')
          .expect(404, {
            error: {message: `Folder with id 9999 doesn't exist.`}
          })
      })
    })

    
    context('Given there are folders in db', ()=>{
      beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
        .then(()=> db.into('notes').insert(notes()))
      ) 

      it('responds with 204 and updates specified folder', ()=>{
        return supertest(app)
          .patch('/folders/1')
          .send({title: 'newTitle'})
          .expect(204)
      })

    })
  })
})