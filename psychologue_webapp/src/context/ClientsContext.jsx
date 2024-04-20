import { createContext, useState, useContext, useEffect } from 'react';
import ClientsAPI from '../services/ClientsAPI';
// Création du contexte
const ClientsContext = createContext();

export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await ClientsAPI.getClients(); // Assurez-vous que cette méthode retourne une liste de clients
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        }
    };

    return (
        <ClientsContext.Provider value={{ clients, setClients, fetchClients }}>
            {children}
        </ClientsContext.Provider>
    );
};
