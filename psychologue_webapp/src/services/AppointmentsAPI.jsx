class AppointmentsAPI {
    static getAppointments() {
        return fetch('http://localhost:3000/consultations')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(function() {
                this.setState({ errorMessage: 'Unable to load data, server may be down.' });
            });
    }
}

export default AppointmentsAPI;