import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import blogService from "../services/blogs";
import { useContext } from "react";
import NotificationContext from "../services/NotificationContext";

const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        setValue(event.target.value);
    };


    return {
        type,
        value,
        onChange
    };
};

const BlogForm = () => {
    const titleInput = useField("text");
    const authorInput = useField("text");
    const urlInput = useField("text");


    const [notification, notificationDispatch] = useContext(NotificationContext);

    const queryClient = useQueryClient();

    const newBlogMutation = useMutation(blogService.create, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: () => {
            notificationDispatch({ type: "ERROR", payload: "create blog failed" });
        }
    });


    const onCreate = (event) => {
        event.preventDefault();
        newBlogMutation.mutate({
            title: titleInput.value,
            author: authorInput.value,
            url: urlInput.value,
        });
        notificationDispatch({ type: "SUCCESS", payload: `a new blog ${titleInput.value} by ${authorInput.value} added` });
    };

    return (
        <div>
            <h2>Create new</h2>

            <form onSubmit={onCreate}>
              title: 
                <input {...titleInput} />
                <br />
              author:
                <input {...authorInput} />
                <br />
              url:
                <input {...urlInput} />
                <br />
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default BlogForm;