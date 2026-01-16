import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls onSubmit with correct data when blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const createButton = screen.getByText('create')

  await userEvent.type(titleInput, 'Testing React Forms')
  await userEvent.type(authorInput, 'Tester McTestface')
  await userEvent.type(urlInput, 'http://test.com')
  await userEvent.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing React Forms',
    author: 'Tester McTestface',
    url: 'http://test.com'
  })
})
