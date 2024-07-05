const {describe, test, after, beforeEach} = require('node:test')
const blog = require('../models/blog')
const mongoose = require('mongoose')
const assert = require('assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initBlogPosts = [
    {
        title:'SuperMario',
        author:'roberotsan',
        url:'localhost',
        likes:10
    },
    {
        title:'SuperBatman',
        author:'roberotsan2',
        url:'localmost',
        likes:14
    }
]

describe('blog testing', () => {

    beforeEach(async () => {
        await blog.deleteMany({})
        await blog.insertMany(initBlogPosts)
    })

    test('http get should return the correct number of blog posts', async () => {
        const response = await api
        .get('/api/blog')
    
        assert.strictEqual(response.body.length, initBlogPosts.length)
    })

    test('key id should be present', async () => {
        const response = await api
        .get('/api/blog')

        response.body.forEach(blog => {
            assert.strictEqual(blog.hasOwnProperty('id'), true)
        })
    })

    test('adding new blog through post', async () => {
        let newBlog = {
            title:'SuperBatman3',
            author:'roberotsan3',
            url:'localanoost',
            likes:132
        }

        await api.post('/api/blog').send(newBlog)

        let res = await api.get('/api/blog')

        assert.strictEqual(res.body.length, initBlogPosts.length + 1)
        let insertedBlogPost = res.body[res.body.length - 1]
        console.log(insertedBlogPost)
        delete insertedBlogPost.id
        assert.deepEqual(newBlog, insertedBlogPost)
    })
    
    after(async () => {
        await mongoose.connection.close()
    })
})
