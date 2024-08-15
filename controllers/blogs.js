const BlogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

BlogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})
  
BlogsRouter.post('/', async (request, response) => {
  if(!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  if (!request.body.likes) {
    request.body.likes = 0
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: 'user not found' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

  await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  response.status(201).json(blog)
})

BlogsRouter.delete('/:id', async (request, response) => {

  if(!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  await User.findByIdAndUpdate(blog.user, { $pull: { blogs: blog._id } })
  response.status(204).end()
})

BlogsRouter.put('/:id', async (request, response) => {
  let blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog = {
    title: request.body.title || blog.title,
    author: request.body.author || blog.author,
    url: request.body.url || blog.url,
    likes: request.body.likes || blog.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(blog)
})

module.exports = BlogsRouter;