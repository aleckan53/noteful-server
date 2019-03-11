const app = require('../src/app')
const knex = require('knex')
const { notes, folders } = require('./data.fixtures').makeArrayOf

describe('Notes endpoints', ()=>{
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

  describe('GET /notes', ()=>{
    context('Given no data in db', ()=>{
      it('responds with 200 and return an empty array', ()=>{
        return supertest(app)
          .get('/notes')
          .expect(200,[])
      })
    })

    context('Given there are data in db', ()=>{
      beforeEach('insert data in db', ()=>
        db.into('folders').insert(folders())
          .then(()=> db.into('notes').insert(notes()))
      )
      it('responds with 200 and an array of notes', ()=>{
        return supertest(app) 
          .get('/notes')
          .expect(200, notes())
      })
    })
  })

  describe('GET /notes/:note_id', ()=>{
    context('Given no notes in db', ()=>{
      
      it('responds with 404', ()=>{
        return supertest(app)
          .get('/notes/9999')
          .expect(404)
      })
    })

    context('Given thre are notes in db', ()=>{
      beforeEach('insert data in db', ()=>
        db.into('folders').insert(folders())
          .then(()=> db.into('notes').insert(notes()))
        )
      it('responds with 200 and note object', ()=>{
        const expectedNote = notes()
        return supertest(app)
          .get('/notes/1')
          .expect(200, expectedNote[0])
      })

      it('responds with 404 if invalid id', ()=>{
        return supertest(app)
          .get('/notes/232323')
          .expect(404, {
            error: {message: `Note with id 232323 doesn't exist.`}
          })
      })
    })
  })

  describe('POST /notes', ()=>{
    beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
    )

    it('responds with 400 if no required fields', ()=>{
      return supertest(app)
        .post('/notes')
        .send({
          title: 'test'
        })
        .expect(400)
    })

    it('responds with 201 and inserts the note', ()=>{
      const testNote = {
        title: "testTitle",
        content: 'testContent',
        folder: 3
      }

      return supertest(app)
        .post('/notes')
        .send(testNote)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(testNote.title)
          expect(res.body.content).to.eql(testNote.content)
          expect(res.body.folder).to.eql(testNote.folder)
        })
    })
  })

  describe('DELETE /notes/:note_id', ()=>{
    context('Given no data in db', ()=>{
      it('responds with 404', ()=>{
        return supertest(app)
          .delete('/notes/123')
          .expect(404)
      })
    })

    context('Given there are notes in db', ()=>{
      beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
        .then(()=> db.into('notes').insert(notes()))
      )

      it('responds with 204 and removes the note', ()=>{
        return supertest(app)
          .delete('/notes/1')
          .expect(204)
          .then(()=> supertest(app)
            .get('/notes/1')
            .expect(404)
          )
      })
    })
  })

  describe('PATCH /notes/:note_id', ()=>{
    beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
        .then(()=> db.into('notes').insert(notes())
      )
    )

    it('responds with 200 and updates the note', ()=>{
      return supertest(app)
        .patch('/notes/1')
        .send({title: 'updatedTitle'})
        .expect(200)
        .then(()=>supertest(app)
          .get('/notes/1')
          .expect(res=>{
            expect(res.body.title).to.eql('updatedTitle')
          })
        )

    })
  })
})
