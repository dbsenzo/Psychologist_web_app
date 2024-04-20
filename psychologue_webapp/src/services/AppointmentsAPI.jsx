class AppointmentsAPI {
    static async getAppointments(clientId = null) {
        let url = 'http://localhost:3000/creneaux/all';
        console.log(clientId)
        if (clientId) {
            // Suppose que l'API backend peut gérer une route qui filtre par clientId
            url = `http://localhost:3000/creneaux/${clientId}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log('Unable to load data, server may be down.');
        }
    }

    static async addAppointment(appointmentData) {
        const url = 'http://localhost:3000/consultations/add';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            return data; // You might want to return some data or a success message
        } catch (error) {
            console.error('Failed to add appointment.', error.message);
            throw error;  // It's better to throw the error to handle it in the component.
        }
    }
}

export default AppointmentsAPI;