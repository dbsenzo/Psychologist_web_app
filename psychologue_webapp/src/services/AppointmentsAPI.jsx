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
}

export default AppointmentsAPI;