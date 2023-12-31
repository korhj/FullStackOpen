import axios from "axios";

const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = async () => {
    const request = await axios.get(baseUrl);
    return request.data;
};

const create = async (newObject) => {
    console.log("create", newObject);
    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = async (newObject) => {
    
    const config = {
        headers: { Authorization: token },
    };

    const request = await axios.put(
        `${baseUrl}/${newObject.id}`,
        newObject,
        config,
    );
    return request.data;
};

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token },
    };

    const request = await axios.delete(`${baseUrl}/${id}`, config);
    return request.data;
};

export default { getAll, create, update, deleteBlog, setToken };
