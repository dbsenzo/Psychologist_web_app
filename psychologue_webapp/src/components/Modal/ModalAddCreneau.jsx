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
  useToast,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useClients } from '../../context/ClientsContext';
import AppointmentsAPI from '../../services/AppointmentsAPI';
import moment from 'moment-timezone';

function ModalAddCreneau({ isOpen, onClose, fetchCreneau }) {
    const [creneauData, setCreneauData] = useState({
        dateCreneau: '',
        heureCreneau: '',
        idPatient: '',
        responsableLegal: '',
        nombreDePersonnes: 1,
    });

    const [isMajor, setIsMajor] = useState(true);

    const [availableHours, setAvailableHours] = useState([]);

    const { clients } = useClients();
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreneauData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === "dateCreneau") {
            const dayOfWeek = new Date(value).getDay();
            if (dayOfWeek === 0) { // 0 est Dimanche
                toast({
                    title: "Date invalide",
                    description: "Les rendez-vous ne peuvent pas être pris un dimanche.",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                return; // Stop further execution or clear the date
            }
            handleGetFreeAppointments(value);
        }

        if (name === "idPatient") {
            const selectedClient = clients.find(client => client.id === value);
            setIsMajor(selectedClient.isMajor);
        }
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
    
    const resetModal = () => {
        setCreneauData({
            dateCreneau: '',
            heureCreneau: '',
            idPatient: '',
            responsableLegal: '',
            nombreDePersonnes: 1,
        });
        setIsMajor(true);
        setAvailableHours([]);
        onClose();
    };

    function validateForm() {
        // Vérifier si la date est un dimanche
        const selectedDate = new Date(creneauData.dateCreneau);
        if (selectedDate.getDay() === 0) { // Dimanche
            toast({
                title: "Erreur",
                description: "Les rendez-vous ne peuvent pas être pris un dimanche.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return false;
        }
    
        // Vérification complète des champs requis
        if (!(isMajor ? 
            creneauData.dateCreneau && creneauData.heureCreneau && creneauData.idPatient :
            creneauData.dateCreneau && creneauData.heureCreneau && creneauData.idPatient && creneauData.responsableLegal)) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs requis.",
                status: "warning",
                duration: 5000,
                isClosable: true
            });
            return false;
        }
    
        return true;
    }
    
    function prepareDataToSend() {
        const dateMoment = moment.tz(`${creneauData.dateCreneau}T${creneauData.heureCreneau}`, "YYYY-MM-DDTHH:mm", "Europe/Paris");
        return {
            IdPatient: creneauData.idPatient,
            DateCreneau: dateMoment.format('YYYY-MM-DDTHH:mm:ss'),
            Prix: 45,
            NombreDePersonnes: creneauData.nombreDePersonnes,
            ResponsableLegal: isMajor ? null : creneauData.responsableLegal
        };
    }
    
    function handleResponse() {
        toast({
            title: "Succès",
            description: "Créneau ajouté avec succès.",
            status: "success",
            duration: 5000,
            isClosable: true
        });
        fetchCreneau();
        resetModal();
    }
    
    function handleError(error) {
        toast({
            title: "Erreur",
            description: error.message || "Une erreur s'est produite lors de l'ajout du créneau.",
            status: "error",
            duration: 5000,
            isClosable: true
        });
    }
    
    const handleSubmit = async () => {
        if (!validateForm()) return;
    
        const dataToSend = prepareDataToSend();
    
        await AppointmentsAPI.addAppointment(dataToSend)
            .then(handleResponse)
            .catch(handleError);
    };
    

    return (
        <Modal isOpen={isOpen} onClose={resetModal}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Ajouter un créneau</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <FormControl isRequired>
                    <FormLabel>Date du créneau</FormLabel>
                    <Input type="date" name="dateCreneau" value={creneauData.dateCreneau} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
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

                {!isMajor && (
                    <FormControl mt={4} isRequired>
                        <FormLabel>Responsable Légal</FormLabel>
                        <Input placeholder="Nom du responsable légal" name="responsableLegal" value={creneauData.responsableLegal} onChange={handleChange} />
                    </FormControl>
                )}
            
                <FormControl isRequired mt={4} width={'fit-content'}>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Nombre de patient(s) présent :</FormLabel>
                        <NumberInput min={1} max={3} defaultValue={creneauData.nombreDePersonnes} precision={0} onChange={(valueString) => setCreneauData(prev => ({ ...prev, nombreDePersonnes: parseInt(valueString, 10) }))}>
                            <NumberInputField name="nombreDePersonnes" />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
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
  onClose: PropTypes.func,
  fetchCreneau: PropTypes.func
};

export default ModalAddCreneau;
