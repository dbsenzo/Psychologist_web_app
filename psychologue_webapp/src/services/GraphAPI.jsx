class GraphAPI {
    static getAppointmentsPourcentage() {
        return fetch('http://localhost:3000/graph/resa')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => data)
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    static getPatientsPourcentage() {
        return fetch('http://localhost:3000/graph/patient')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => data)
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
}

export default GraphAPI;