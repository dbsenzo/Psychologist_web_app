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

    static addClient(client) {
        console.log(client)
        return fetch('http://localhost:3000/patients/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .catch(function() {
            console.log("An error occurred while adding the client.");
        });
    }

    static deleteClient(clientId) {
        return fetch(`http://localhost:3000/patients/delete/${clientId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.error("An error occurred while deleting the client:", error);
        });
    }

    static updateClient(clientId, clientData) {
        return fetch(`http://localhost:3000/patients/update/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.error("An error occurred while updating the client:", error);
        });
    }
    
}

export default ClientsAPI;