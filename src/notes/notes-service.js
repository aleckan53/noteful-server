const NotesService = {
  getAll(knex){
    return knex
      .select('*')
      .from('notes')
  },
  getNoteById(knex, id){
    return knex
      .from('notes')
      .select('*')
      .where({id})
      .first()
  },
  addNote(knex, newNote){
    return knex
      .into('notes')
      .insert(newNote)
      .returning('*')
      .then(rows => rows[0])
  },
  deleteNote(knex, id){
    return knex('notes')
      .where({id})
      .delete()
  },
  updateNote(knex, id, updates){
    return knex('notes')
      .where({id})
      .update(updates)
  }
}

module.exports = NotesService