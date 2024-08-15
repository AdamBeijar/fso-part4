const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }
    return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }
    const authors = blogs.reduce((authors, blog) => {
        if (authors[blog.author]) {
            authors[blog.author]++
        } else {
            authors[blog.author] = 1
        }
        return authors
    }, {})
    const author = Object.keys(authors).reduce((max, author) => authors[author] > authors[max] ? author : max, Object.keys(authors)[0])
    return {
        author,
        blogs: authors[author]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }
    const authors = blogs.reduce((authors, blog) => {
        if (authors[blog.author]) {
            authors[blog.author] += blog.likes
        } else {
            authors[blog.author] = blog.likes
        }
        return authors
    }, {})
    const author = Object.keys(authors).reduce((max, author) => authors[author] > authors[max] ? author : max, Object.keys(authors)[0])
    return {
        author,
        likes: authors[author]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}