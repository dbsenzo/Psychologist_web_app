import { useState, useEffect } from 'react';
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useClients } from '../../context/ClientsContext';
import AppointmentsAPI from '../../services/AppointmentsAPI';
import moment from 'moment-timezone';

function ModalEditCreneau({ isOpen, onClose, appointment }) {
    const [creneauData, setCreneauData] = useState({ ...appointment });
    const [availableHours, setAvailableHours] = useState([]);
    const { clients, getClient } = useClients();
    const toast = useToast();

    useEffect(() => {
        if (appointment) {
            handleGetFreeAppointments(appointment.start.split('T')[0]); // Initially fetch free appointments
            setCreneauData({
                isMajor: getClient(appointment.IdPatient).isMajor,
                NombreDePersonnes: appointment.NombreDePersonnes,
                idPatient: appointment.IdPatient,
                IdCalendrier: appointment.IdCalendrier,
                dateCreneau: appointment.start ? appointment.start.split('T')[0] : '',
                heureCreneau: appointment.start ? appointment.start.substring(11, 16) : ''
            });
        }
    }, [appointment]);

    useEffect(() => {
        console.log(creneauData)
    }, [creneauData]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setCreneauData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "dateCreneau") {
            handleGetFreeAppointments(value);
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
                    title: "No Free Slots",
                    description: "No free slots available for this date.",
                    status: "info",
                    duration: 5000,
                    isClosable: true
                });
            }
        } catch (error) {
            console.error("Error fetching free appointments:", error);
            toast({
                title: "Error",
                description: "Unable to fetch free slots.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };

    const validateForm = () => {
        // Additional validations can be implemented here
        return creneauData.dateCreneau && creneauData.heureCreneau && creneauData.idPatient;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const dataToSend = {
            ...creneauData,
            DateCreneau: moment.tz(`${creneauData.dateCreneau}T${creneauData.heureCreneau}`, "Europe/Paris").format('YYYY-MM-DDTHH:mm:ss')
        };
        console.log(dataToSend);

        try {
            await AppointmentsAPI.updateAppointment(appointment.IdCalendrier, dataToSend);
            toast({
                title: "Success",
                description: "Appointment updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true
            });
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "An error occurred while updating the appointment.",
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modifier un rendez-vous</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                        <Input type="date" name="dateCreneau" value={creneauData.dateCreneau} onChange={handleChange} />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Time</FormLabel>
                        <Select name="heureCreneau" value={creneauData.heureCreneau} onChange={handleChange}>
                            {availableHours.map((hour, index) => (
                                <option key={index} value={hour}>{hour}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Patient</FormLabel>
                        <Select name="idPatient" value={creneauData.idPatient} onChange={handleChange}>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.Nom} {client.Prenom}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Number of People</FormLabel>
                        <NumberInput min={1} max={3} value={creneauData.NombreDePersonnes} precision={0} onChange={(valueString) => setCreneauData(prev => ({ ...prev, NombreDePersonnes: parseInt(valueString, 10) }))}>
                            <NumberInputField name="NombreDePersonnes" />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Save Changes</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

ModalEditCreneau.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  appointment: PropTypes.object
};

export default ModalEditCreneau;
