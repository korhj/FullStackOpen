import { createContext, useReducer } from "react";
import blogService from "./blogs";

const userReducer = (state, action) => {
    switch (action.type) {
    case "LOGIN": {
        window.localStorage.setItem("loggedUser", JSON.stringify(action.payload));
        blogService.setToken(action.payload.token);
        return action.payload;
    }
    case "GET_USER_FROM_LOCALSTORAGE": {
        const loggedUserJSON = window.localStorage.getItem("loggedUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            blogService.setToken(user.token);
            return user;
        }
        return null;
    }
    case "ERROR":
        return null;
    default:
        return state;
    }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
    const [userInfo, userDispatch] = useReducer(
        userReducer,
        null,
    );

    return (
        <UserContext.Provider value={[userInfo, userDispatch]}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;
