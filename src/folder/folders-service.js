const FolderService = {
  gettAll(knex){
    return knex
      .select('*')
      .from('folders')
  },
  getFolderById(knex, folderId) {
    return knex
      .from('folders')
      .select('*')
      .where('id', folderId)
      .first()
  },
  addFolder(knex, newFolder) {
    return knex
      .insert({title: newFolder})
      .into('folders')
      .returning('*')
  },
  updateFolder(knex, folderId, newTitle){
    return knex('folders')
      .where({id: folderId})
      .update({title: newTitle})
  },

  deleteFolder(knex, folderId){
    return knex('folders')
      .where({id: folderId})
      .delete()
  },
  getNotesInFolder(knex, folderId){
    return knex
      .select('*')
      .from('notes')
      .where('folder', folderId)
  },
}

module.exports = FolderService