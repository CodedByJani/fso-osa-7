import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '12345'
    }
  }

  const user = {
    username: 'testuser'
  }

  const mockUpdate = vi.fn()
  const mockRemove = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdate}
      removeBlog={mockRemove}
      user={user}
    />
  )

  expect(screen.queryByText((text) => text.includes('Test Blog Title'))).toBeDefined()
  expect(screen.queryByText((text) => text.includes('Test Author'))).toBeDefined()

  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
})

test('shows url, likes, and user when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser'
  }

  const mockUpdate = vi.fn()
  const mockRemove = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdate}
      removeBlog={mockRemove}
      user={user}
    />
  )

  const button = screen.getByText('view')
  await userEvent.click(button)

  expect(screen.getByText('http://example.com')).toBeDefined()
  expect(screen.getByText(/likes/i)).toBeDefined()
  expect(screen.getByText('Test User')).toBeDefined()
})

test('calls event handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser'
  }

  const mockUpdate = vi.fn()
  const mockRemove = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdate}
      removeBlog={mockRemove}
      user={user}
    />
  )

  const userSetup = userEvent.setup()

  const viewButton = screen.getByText('view')
  await userSetup.click(viewButton)

  const likeButton = screen.getByText('like')
  await userSetup.click(likeButton)
  await userSetup.click(likeButton)

  expect(mockUpdate).toHaveBeenCalledTimes(2)
})
