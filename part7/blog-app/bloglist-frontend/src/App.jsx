import { useEffect } from "react";
import Blogs from "./components/Blog";
import BlogForm from "./components/BlogForm";
import "./App.css";
import { useContext } from "react";
import UserContext from "./services/UserContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";


const App = () => {

    const [userInfo, userDispatch] = useContext(UserContext);


    useEffect(() => {
        if (userInfo === null) {
            userDispatch({ type: "GET_USER_FROM_LOCALSTORAGE" }); 
        }  
    });

    return (
        <div>
            <h2>blogs</h2>

            {userInfo === null ? <LoginForm /> : 
                <div>
                    <Notification />
                    <BlogForm />
                    <Blogs />
                </div>
            }

            

            
        </div>
    );
};

export default App;
