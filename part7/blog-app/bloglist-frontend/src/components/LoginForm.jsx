import { useState } from "react";
import blogService from "../services/blogs";
import { useContext } from "react";
import NotificationContext from "../services/NotificationContext";
import loginService from "../services/login";
import UserContext from "../services/UserContext";

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

const LoginForm = () => {

    const usernameInput = useField("text");
    const passwordInput = useField("text");

    const [notification, notificationDispatch] = useContext(NotificationContext);
    const [userInfo, userDispatch] = useContext(UserContext);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username: usernameInput.value,
                password: passwordInput.value,
            });

            window.localStorage.setItem("loggedUser", JSON.stringify(user));
            blogService.setToken(user.token);
            userDispatch({ type: "LOGIN", payload: user });
            notificationDispatch({ type: "SUCCESS", payload: `Logged in as ${user.name}` });
        } catch (exception) {
            notificationDispatch({ type: "ERROR", payload: "wrong username or password" });
        }
    };



    return (
        <div>
            <h3>Log in to application</h3>
            <form onSubmit={handleLogin}>
                <div>
        username
                    <input {...usernameInput} />
                </div>
                <div>
        password
                    <input {...passwordInput} />       
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    );
};

export default LoginForm;