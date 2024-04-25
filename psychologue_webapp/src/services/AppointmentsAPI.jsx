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
                throw new Error(response.message);
            }
            const data = await response.json();
            return data; // You might want to return some data or a success message
        } catch (error) {
            console.error('Failed to add appointment.', error);
            throw error;  // It's better to throw the error to handle it in the component.
        }
    }

    static async getAppointmentsFreeHours(dateCreneau) {
        // Encodage de la date dans les paramètres de l'URL
        const params = new URLSearchParams({ dateCreneau }).toString();
        let url = `http://localhost:3000/creneaux/libres?${params}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Unable to load free appointments:', error.message);
            throw error;  // It's usually better to throw the error to allow handling it in the calling context.
        }
    }    

    static async getAppointmentsNotFinished() {
        let url = `http://localhost:3000/consultations/nonfinis`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Unable to load free appointments:', error.message);
            throw error;  // It's usually better to throw the error to allow handling it in the calling context.
        }
    } 

    static async deleteAppointment(idCalendrier) {
        const url = `http://localhost:3000/consultations/delete/${idCalendrier}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return await response.json();
        } catch (error) {
            console.error('Unable to delete the appointment:', error.message);
            throw error;
        }
    }


    static async updateAppointment(idCalendrier, appointmentData) {
        const url = `http://localhost:3000/consultations/update/${idCalendrier}`;
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            console.log("Update success:", data);
            return data;
        } catch (error) {
            console.error('Failed to update the appointment:', error.message);
            throw error;  // It's usually better to throw the error to allow handling it in the calling context.
        }
    }

    static async finishAppointment(idCalendrier, appointmentDetails) {
        const url = `http://localhost:3000/consultations/finish/${idCalendrier}`;
        
        try {
            const response = await fetch(url, {
                method: 'PUT', // Utilisation de PUT pour la mise à jour des données
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Retard: appointmentDetails.retard,
                    ModeDeReglement: appointmentDetails.paymentMode,
                    IndicateurAnxiete: appointmentDetails.stress,
                    Observations: appointmentDetails.observation
                })
            });
            
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            console.log("Consultation finish success:", data);
            return data;  // Renvoie les données de la réponse pour confirmation
        } catch (error) {
            console.error('Failed to finish the appointment:', error.message);
            throw error;  // Lève une exception pour permettre la gestion des erreurs dans le contexte appelant
        }
    }
    
    
    

}

export default AppointmentsAPI;