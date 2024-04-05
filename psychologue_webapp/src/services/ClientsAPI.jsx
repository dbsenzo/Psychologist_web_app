class ClientsAPI {
    static getClients() {
        return fetch('http://localhost:3000/patients')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .catch(function() {
                console.log("An error occurred while fetching the clients.");
            });
    }
}

export default ClientsAPI;