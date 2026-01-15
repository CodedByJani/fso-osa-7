const assert = require('assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]

  const listWithMultipleBlogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      likes: 3,
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 7,
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 10)
  })

  test('when list is empty equals zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Blogi A',
      author: 'Kirjoittaja A',
      likes: 7,
    },
    {
      title: 'Blogi B',
      author: 'Kirjoittaja B',
      likes: 5,
    },
    {
      title: 'Blogi C',
      author: 'Kirjoittaja C',
      likes: 12,
    },
    {
      title: 'Blogi D',
      author: 'Kirjoittaja D',
      likes: 12,
    },
  ]

  test('returns one of the blogs with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result.likes, 12)
    assert.ok(blogs.some(blog => blog.title === result.title && blog.likes === 12))
  })

  test('returns null for empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: 'Robert C. Martin', title: 'Blogi 1' },
    { author: 'Robert C. Martin', title: 'Blogi 2' },
    { author: 'Robert C. Martin', title: 'Blogi 3' },
    { author: 'Martin Fowler', title: 'Blogi A' },
    { author: 'Martin Fowler', title: 'Blogi B' },
    { author: 'Edsger W. Dijkstra', title: 'Blogi X' },
  ]

  test('returns the author with most blogs and the count', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('returns null for empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})

describe('most likes', () => {
  const blogs = [
    { author: 'Edsger W. Dijkstra', likes: 5 },
    { author: 'Robert C. Martin', likes: 7 },
    { author: 'Edsger W. Dijkstra', likes: 12 },
    { author: 'Martin Fowler', likes: 10 },
  ]

  test('returns the author with most likes and the sum of likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('returns null for empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})
