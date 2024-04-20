import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useClients } from '../../context/ClientsContext';
import AppointmentsAPI from '../../services/AppointmentsAPI';
import moment from 'moment-timezone';

function ModalAddCreneau({ isOpen, onClose }) {
    const [creneauData, setCreneauData] = useState({
        dateCreneau: '',
        heureCreneau: '',
        idPatient: '',
        motif: ''
    });

    const [availableHours, setAvailableHours] = useState([]);

    const { clients } = useClients();
    const toast = useToast();

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setCreneauData(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        if (name === "dateCreneau" && value) {
            handleGetFreeAppointments(value);
        }
    };
    

    const isFormValid = () => {
        // Validation logic here, e.g., check if all fields are filled
        return Object.values(creneauData).every(value => value);
    };

    const handleGetFreeAppointments = async (date) => {
        try {
            const freeAppointments = await AppointmentsAPI.getAppointmentsFreeHours(date);
            if (freeAppointments && freeAppointments.length > 0) {
                setAvailableHours(freeAppointments);
            } else {
                setAvailableHours([]);
                toast({
                    title: "Aucun créneau disponible",
                    description: "Il n'y a pas de créneaux disponibles pour cette date.",
                    status: "info",
                    duration: 5000,
                    isClosable: true
                });
            }
        } catch (error) {
            console.error("Error fetching free appointments:", error);
            toast({
                title: "Erreur",
                description: "Impossible de récupérer les créneaux libres.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };
    

    const handleSubmit = async () => {
        if (!isFormValid()) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs requis.",
                status: "warning",
                duration: 5000,
                isClosable: true
            });
            return;
        }
    
        // Combine date and time into a single ISO string for the backend
        const dateMoment = moment.tz(creneauData.dateCreneau + 'T' + creneauData.heureCreneau, "YYYY-MM-DDTHH:mm", "Europe/Paris"); // Assurez-vous de spécifier le bon fuseau horaire
        const completeDate = dateMoment.toISOString();
    
        const dataToSend = {
            IdPatient: creneauData.idPatient,
            DateCreneau: completeDate, // Assurez-vous que le backend peut gérer ce format
            Prix: 0, // Assume no cost specified, adjust accordingly
            NombreDePersonnes: 1, // Default value, adjust if needed
            Motif: creneauData.motif
        };
    
        await AppointmentsAPI.addAppointment(dataToSend)
        .then(() => {
            toast({
            title: "Succès",
            description: "Créneau ajouté avec succès.",
            status: "success",
            duration: 5000,
            isClosable: true
            });
            onClose();
        })
        .catch(error => {
            toast({
            title: "Erreur",
            description: error.message || "Une erreur s'est produite lors de l'ajout du créneau.",
            status: "error",
            duration: 5000,
            isClosable: true
            });
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Ajouter un créneau</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <FormControl isRequired>
                <FormLabel>Date du créneau</FormLabel>
                <Input type="date" name="dateCreneau" value={creneauData.dateCreneau} onChange={handleChange} />
                </FormControl>

                <FormControl mt={4} isRequired>
                    <FormLabel>Heure du créneau</FormLabel>
                    <Select placeholder="Sélectionnez une heure" name="heureCreneau" value={creneauData.heureCreneau} onChange={handleChange}>
                        {availableHours.map((hour, index) => {
                            console.log(hour)
                            return(
                            <option key={index} value={hour}>{hour}</option>
                        )})}
                    </Select>
                </FormControl>

                <FormControl mt={4} isRequired>
                <FormLabel>Patient</FormLabel>
                    <Select placeholder="Sélectionnez un client" name="idPatient" onChange={handleChange}>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.Nom +' '+ client.Prenom + ' | ' + (client.isMajor ? 'Majeur' : 'Mineur')}</option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl mt={4} isRequired>
                    <FormLabel>Motif de la consultation</FormLabel>
                    <Input placeholder="Motif" name="motif" value={creneauData.motif} onChange={handleChange} />
                </FormControl>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Ajouter
                </Button>
                <Button onClick={onClose}>Annuler</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

ModalAddCreneau.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default ModalAddCreneau;
