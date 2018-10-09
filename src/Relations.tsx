export const user = {
  hasMany: {
    workflow: {
      foreignKey: 'createdByUUID',
      localField: 'workflows'
    }
  }
}

export const workflow = {
  belongsTo: {
    // workflow belongsTo user
    user: {
      // database column, e.g. console.log(comment.post_id) // 5
      foreignKey: 'createdByUUID',
      // reference to related object in memory, e.g. comment.post
      localField: 'user'
    }
  }
}