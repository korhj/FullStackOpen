import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import login from "../services/login";

/* eslint-disable no-undef */

describe("BlogForm tests", () => {
  const mockHandler = jest.fn();

  let container;

  beforeEach(() => {
    container = render(<BlogForm createBlog={mockHandler} />).container;
  });

  test("creating a now blog works", async () => {
    const user = userEvent.setup();

    const titleInput = container.querySelector("#titleInput");
    const authorInput = container.querySelector("#authorInput");
    const urlInput = container.querySelector("#urlInput");
    const sendButton = screen.getByText(/create/);

    await user.type(titleInput, "testing title");
    await user.type(authorInput, "testing author");
    await user.type(urlInput, "testing url");
    await user.click(sendButton);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0]).toEqual({
      title: "testing title",
      author: "testing author",
      url: "testing url",
    });
  });
});
