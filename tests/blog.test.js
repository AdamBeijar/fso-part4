const { test, after } = require("node:test")
const assert = require("assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

const newUser = {
    username: "testuser",
    name: "testuser",
    password: "testuser"
}

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

test("test the unique identifier property of the blog posts is named id", async () => {
    await api.get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect((response) => {
            response.body.forEach(blog => {
                assert.notStrictEqual(blog.id, undefined)
            })
        })
})

test("a valid blog can be added", async () => {
    const users = await api.get("/api/users")

    if (users.body.find(user => user.username === newUser.username)) {
        await api.delete(`/api/users/${users.body.find(user => user.username === newUser.username).id}`)
    }

    const user = await api.post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const loginResponse = await api.post("/api/login")
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const newBlog = {
        title: "Test Title",
        author: "Test Author",
        url: "Test URL",
        likes: 5
    }

    const earlyBlogs = await api.get("/api/blogs")
    let earlyIds = earlyBlogs.body.map(blog => blog.id)

    await api.post("/api/blogs")
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)


    const laterBlogs = await api.get("/api/blogs")

    const addedBlogId = laterBlogs.body.find(blog => !earlyIds.includes(blog.id)).id

    assert.strictEqual(earlyIds.includes(addedBlogId), false)

    // delete the added blog
    await api.delete(`/api/blogs/${addedBlogId}`)
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .expect(204)
    
    // delete the added user
    await api.delete(`/api/users/${user.body.id}`)
        .expect(204)

})

test("a blog without likes property will default to 0", async () => {

    const users = await api.get("/api/users")

    if (users.body.find(user => user.username === newUser.username)) {
        await api.delete(`/api/users/${users.body.find(user => user.username === newUser.username).id}`)
    }

    const user = await api.post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const loginResponse = await api.post("/api/login")
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const newBlog = {
        title: "Test Title",
        author: "Test Author",
        url: "Test URL"
    }

    const response = await api.post("/api/blogs")
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    assert.strictEqual(response.body.likes, 0)

    // delete the added blog
    await api.delete(`/api/blogs/${response.body.id}`)
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .expect(204)

    // delete the added user
    await api.delete(`/api/users/${user.body.id}`)
        .expect(204)
})

test("a blog without title or url will return 400", async () => {

    const users = await api.get("/api/users")

    if (users.body.find(user => user.username === newUser.username)) {
        await api.delete(`/api/users/${users.body.find(user => user.username === newUser.username).id}`)
    }

    const user = await api.post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const loginResponse = await api.post("/api/login")
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const newBlog = {
        author: "author",
        likes: 5
    }

    const response = await api.post("/api/blogs")
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(400)

    // delete the added user
    await api.delete(`/api/users/${user.body.id}`)
        .expect(204)
})

test("deleting a blog", async () => {

    const users = await api.get("/api/users")

    if (users.body.find(user => user.username === newUser.username)) {
        await api.delete(`/api/users/${users.body.find(user => user.username === newUser.username).id}`)
    }

    const user = await api.post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const loginResponse = await api.post("/api/login")
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const newBlog = {
        title: "Test Title",
        author: "Test Author",
        url: "Test URL",
        likes: 5
    }

    const response = await api.post("/api/blogs")
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    await api.delete(`/api/blogs/${response.body.id}`)
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .expect(204)

    // delete the added user
    await api.delete(`/api/users/${user.body.id}`)
        .expect(204)
})

test("updating a blog", async () => {

    const users = await api.get("/api/users")

    if (users.body.find(user => user.username === newUser.username)) {
        await api.delete(`/api/users/${users.body.find(user => user.username === newUser.username).id}`)
    }

    const user = await api.post("/api/users")
        .send(newUser)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const loginResponse = await api.post("/api/login")
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const newBlog = {
        title: "Test Title",
        author: "Test Author",
        url: "Test URL",
        likes: 5
    }

    const response = await api.post("/api/blogs")
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const updatedBlog = {
        title: "Updated Title",
        author: "Updated Author",
        url: "Updated URL",
        likes: 10
    }

    await api.put(`/api/blogs/${response.body.id}`)
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect((response) => {
            assert.strictEqual(response.body.title, updatedBlog.title)
            assert.strictEqual(response.body.author, updatedBlog.author)
            assert.strictEqual(response.body.url, updatedBlog.url)
            assert.strictEqual(response.body.likes, updatedBlog.likes)
        })

    // delete the added blog
    await api.delete(`/api/blogs/${response.body.id}`)
        .set("Authorization", `bearer ${loginResponse.body.token}`)
        .expect(204)

    // delete the added user
    await api.delete(`/api/users/${user.body.id}`)
        .expect(204)
})

test("a blog cant be added without a token", async () => {
    const newBlog = {
        title: "Test Title",
        author: "Test Author",
        url: "Test URL",
        likes: 5
    }

    const earlyBlogs = await api.get("/api/blogs")

    await api.post("/api/blogs")
        .send(newBlog)
        .expect(401)

    const laterBlogs = await api.get("/api/blogs")

    assert.strictEqual(earlyBlogs.body.length, laterBlogs.body.length)

    if (laterBlogs.body.find(blog => blog.title === newBlog.title)) {
        await api.delete(`/api/blogs/${laterBlogs.body.find(blog => blog.title === newBlog.title).id}`)
    }
})



after(async () => {
    await mongoose.connection.close()
})