import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import blogService from "../services/blogs";

const Blog = ({ blog }) => {

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const queryClient = useQueryClient();

    const updateBlogMutation = useMutation(blogService.update, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });

    const deleteBlogMutation = useMutation(blogService.deleteBlog, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
  
    const updateLikes = () => {
        updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
    };

    const deleteBlog = () => {
        deleteBlogMutation.mutate(blog.id);
    };

    const loggedUserJSON = window.localStorage.getItem("loggedUser");       
    const user = JSON.parse(loggedUserJSON);
 

    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible} className="compact">
                {blog.title} {blog.author}
                <button onClick={() => setVisible(true)}>view</button>
            </div>
            <div style={showWhenVisible} className="expanded">
                {blog.title} {blog.author}
                <button onClick={() => setVisible(false)}>hide</button>
                <br />
                {blog.url}
                <br />
                likes {blog.likes}{" "}
                <button onClick={updateLikes}>
                like
                </button>
                <br />
                {blog.user ? blog.user.name : "User Name Not Available"}
                <br />
                {user.username === blog.user.username ? (
                    <div>
                        <button onClick={() => deleteBlog(blog)}>remove</button>
                        <br />
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};


const Blogs = () => {

    const result = useQuery({
        queryKey: ["blogs"],
        queryFn: () => blogService.getAll(),
        retry: false
    });
  
    if ( result.isLoading ) {
        return <div>loading data...</div>;
    }
  
    if ( result.isError ) {
        return <div>anecdote service not available due to problems in server</div>;
    }
  
    const blogs = result.data;
  
    return (
        <div>
            {blogs.map((blog) => (
                <div key={blog.id}>
                    <Blog blog={blog} />
                </div>
            ))}
        </div>
    );

};

export default Blogs;
