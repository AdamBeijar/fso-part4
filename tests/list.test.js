const {test, describe} = require("node:test")
const assert = require("assert")
const list_helper = require("../utils/list_helper")

test("dummy", () => {
    const blogs = []

    const result = list_helper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('totalLikes', () => { 
    test('of empty list is zero', () => {
        const result = list_helper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = list_helper.totalLikes([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }])
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = list_helper.totalLikes([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }, {
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 10
        }
        ])
        assert.strictEqual(result, 15)
})})

describe('favoriteBlog', () => {
    test('of empty list is null', () => {
        const result = list_helper.favoriteBlog([])
        assert.strictEqual(result, undefined)
    })

    test('when list has only one blog equals the blog itself', () => {
        const result = list_helper.favoriteBlog([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }])
        assert.deepStrictEqual(result, {
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        })
    })

    test('of a bigger list is calculated right', () => {
        const result = list_helper.favoriteBlog([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }, {
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 10
        }
        ])
        assert.deepStrictEqual(result, {
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 10
        })
})})

describe('mostBlogs', () => {
    test('of empty list is null', () => {
        const result = list_helper.mostBlogs([])
        assert.strictEqual(result, undefined)
    })

    test('when list has only one blog equals the author of that', () => {
        const result = list_helper.mostBlogs([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }])
        assert.deepStrictEqual(result, 
            {
                author: "Author",
                blogs: 1
            }
        )
    })

    test('of a bigger list is calculated right', () => {
        const result = list_helper.mostBlogs([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }, {
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 10
        }, {
            title: "Title",
            author: "Author2",
            url: "URL",
            likes: 10
        }
        ])
        assert.deepStrictEqual(result, 
            {
                author: "Author",
                blogs: 2
            }
        )
})})

describe('mostLikes', () => {
    test('of empty list is null', () => {
        const result = list_helper.mostLikes([])
        assert.strictEqual(result, undefined)
    })

    test('when list has only one blog equals the author of that', () => {
        const result = list_helper.mostLikes([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }])
        assert.deepStrictEqual(result, 
            {
                author: "Author",
                likes: 5
            }
        )
    })

    test('of a bigger list is calculated right', () => {
        const result = list_helper.mostLikes([{
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 5
        }, {
            title: "Title",
            author: "Author",
            url: "URL",
            likes: 10
        }, {
            title: "Title",
            author: "Author2",
            url: "URL",
            likes: 10
        }
        ])
        assert.deepStrictEqual(result, 
            {
                author: "Author",
                likes: 15
            }
        )
})})
