import axios from "axios"

const apiCall = async (url, method, payload) => {

    try {
        const response = await axios({
            method: method,
            url: url,
            data: payload
        })

        return response;

    } catch (err) {
        console.log(err);
        return err;
    }

}

export default apiCall;