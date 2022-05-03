import axios from "axios";

const useApi = (request) => {
    const BASE_URL = 'http://worldtimeapi.org/api/';

    const handleRequest = async () => {
        try {
            const response = await axios({
                method: request.method ? request.method : 'GET',
                url: `${BASE_URL}${request.url}`,
                data: request.data ? request.data : null
            });

            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        handleRequest
    };
}

export default useApi;