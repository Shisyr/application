const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 2
const postSchema = new Schema({
  name_post: String,
  description: String,
  author_id: String,
  author_email: String,
  author_name: String
}, {
  // 3
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

// 4
const Post = mongoose.model('post', postSchema)
module.exports = Post
