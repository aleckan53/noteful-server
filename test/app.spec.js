const app = require('../src/app')
const knex = require('knex')
const { notes, folders } = require('./data.fixtures').makeArrayOf

describe('App home endpoint', ()=>{
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

  context('GET /', ()=>{
    beforeEach('insert data in db', ()=>
      db.into('folders').insert(folders())
        .then(()=> db.into('notes').insert(notes()))
    )
    it('responds with 200 and returns folders and notes', ()=>{
      const expected = {
        folders: folders(),
        notes: notes()
      }
      return supertest(app)
        .get('/')
        .expect(200, expected)
    })
  
  })

})