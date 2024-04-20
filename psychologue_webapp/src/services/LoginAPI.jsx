class LoginAPI {
    static login(username, password) {
        return fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.log('Unable to load data, server may be down.', error.message);
            throw error;  // Rethrow to handle it in the calling component
        });
    }

    static signup(username, password) {
        return fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.log('Unable to register the user, server may be down.', error.message);
            throw error;  // Rethrow for error handling purposes
        });
    }
}

export default LoginAPI;
