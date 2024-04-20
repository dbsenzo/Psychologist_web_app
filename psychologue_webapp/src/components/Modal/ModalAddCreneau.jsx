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

function ModalAddCreneau({ isOpen, onClose }) {
    const [creneauData, setCreneauData] = useState({
        dateCreneau: '',
        heureCreneau: '',
        idPatient: '',
        motif: ''
    });

    const { clients } = useClients();
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name,value)
        setCreneauData(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const isFormValid = () => {
        // Validation logic here, e.g., check if all fields are filled
        return Object.values(creneauData).every(value => value);
    };

    const handleGetFreeAppointments = async () => {
        // Call the API to get free appointments
        const freeAppointments = await AppointmentsAPI.getAppointmentsFreeHours(creneauData.dateCreneau);
        console.log(freeAppointments);
        
    }

    const handleSubmit = async () => {
        console.log(creneauData);
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
        const completeDate = new Date(creneauData.dateCreneau + 'T' + creneauData.heureCreneau);
        const dataToSend = {
            IdPatient: creneauData.idPatient,
            DateCreneau: completeDate.toISOString(), // Assurez-vous que le backend peut gérer ce format
            Prix: 0, // Assume no cost specified, adjust accordingly
            NombreDePersonnes: 1, // Default value, adjust if needed
            Motif: creneauData.motif
        };

        await AppointmentsAPI.addAppointment(dataToSend)
        .then(() => {
            toast({
            title: "Succès",
            description: "Créneau ajouté avec succès.",
            status: "success"
            });
            onClose();
        })
        .catch(error => {
            toast({
            title: "Erreur",
            description: error.message || "Une erreur s'est produite lors de l'ajout du créneau.",
            status: "error"
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
                <Input type="time" name="heureCreneau" value={creneauData.heureCreneau} onChange={handleChange} />
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
