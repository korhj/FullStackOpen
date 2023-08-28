import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe ('Blog tests', () => {

  const blog = {
    title: 'render test',
    author: 'test author',
    url: 'test url',
    user: {
      name: 'test name',
      username: 'test username'
    }
  }

  const user = {
    name: 'test name',
    username: 'test username'
  }

  const mockHandler = jest.fn()

  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} updateBlogLikes={mockHandler} deleteBlog={() => {}} />).container
  })



  test('renders content', async () => {
    await screen.findAllByText(/render test/)
    await screen.findAllByText(/test author/)
    await screen.findAllByText(/test url/)
    await screen.findAllByText(/likes/)

  })

  test('at start only the title and author are displayed', () => {

    const expanded = container.querySelector('.expanded')

    expect(expanded).toHaveStyle('display: none')

    const compact = container.querySelector('.compact')

    expect(compact).not.toHaveStyle('display: none')

    expect(compact).toHaveTextContent('render test')
    expect(compact).toHaveTextContent('test author')
    expect(compact).not.toHaveTextContent('test url')
    expect(compact).not.toHaveTextContent('likes')
  })

  test('after clicking the button "view", url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText(/view/)
    await user.click(button)

    const div = container.querySelector('.expanded')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('test url')
    expect(div).toHaveTextContent('likes')
  })

  test('clicking like twice calls updateBlogLikes twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText(/view/)
    await user.click(button)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(1)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)

  })
})