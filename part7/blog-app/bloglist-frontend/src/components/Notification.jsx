import { useContext } from "react";
import NotificationContext from "../services/NotificationContext";

const Notification = () => {
    const [notification, dispatch] = useContext(NotificationContext);

    if (notification === null) {
        return null;
    } else {
        setTimeout(() => {
            dispatch({ type: "RESET" });
        }, 5000);
    }
    const style = {
        color: notification.color,
        background: "lightgrey",
        size: "20px",
        border: "solid",
        radius: "5px",
        padding: "10px",
        bottom: "10px",
    };
    return (
        <div style={style}>
            {notification.content}
        </div>
    );

};

export default Notification;
