import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Badge,
  Text
} from '@chakra-ui/react';
import ModalEditCreneau from '../components/Modal/ModalEditCreneau';
import { BreadcrumbCustom } from '../components/Dashboard_Box/Breadcrumb';
import { EditIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import ModalConfirm from '../components/Modal/ModalConfirm';
import AppointmentsAPI from '../services/AppointmentsAPI';
import { useNotification } from '../services/NotificationService';
import ModalFinishCreneau from '../components/Modal/ModalFinishCreneau';

function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const { isOpen: isFinishOpen, onOpen: onFinishOpen, onClose: onFinishClose } = useDisclosure();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [appointmentToFinish, setAppointmentToFinish] = useState(null);
    const { notify } = useNotification();

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const data = await AppointmentsAPI.getAppointmentsNotFinished();
    const processedData = data.map(appointment => ({
      ...appointment,
      isDone: defineStatusAppointments(appointment.start)
    }));
    console.log(processedData);
    setAppointments(processedData);
  }
  
  const defineStatusAppointments = (appointmentDate) => {
    const appointmentDateObject = new Date(appointmentDate);
    const currentDate = new Date();
    // Comparaison pour voir si la date du rendez-vous est passée
    return appointmentDateObject < currentDate;
  }

  const handleEdit = (appointment) => {
    console.log(appointment)
    setSelectedAppointment(appointment);
    onEditOpen();
  };

  const handleFinish = async (id) => {
    setAppointmentToFinish(id)
    onFinishOpen();
};


  const handleSaveChanges = async () => {
    onEditClose();
    fetchAppointments();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment({ ...selectedAppointment, [name]: value });
  };

  const handleDeleteConfirm = (id) => {
    setAppointmentToDelete(id);
    onConfirmOpen();
};

const confirmDelete = async () => {
    console.log(appointmentToDelete); // Logging the ID to be deleted, make sure it's defined

    try {
        // Attempting to delete the appointment and handle the response
        const response = await AppointmentsAPI.deleteAppointment(appointmentToDelete);
        // Check if deletion was successful and notify the user
        notify({
            title: "Success",
            description: response.message,
            status: "success",
            duration: 5000,
            isClosable: true
        });
        fetchAppointments(); // Refresh the list to reflect the deletion
    } catch (error) {
        // Error handling if the API call fails
        notify({
            title: "Error",
            description: error.message || "Une erreur s'est produite lors de la suppression du rendez-vous.",
            status: "error",
            duration: 5000,
            isClosable: true
        });
    } finally {
        onConfirmClose(); // Close the confirmation modal in any case
    }
};

useEffect(() => {
    console.log('Appointment to finish ID:', appointmentToFinish); // Cela affichera l'ID chaque fois qu'il change
}, [appointmentToFinish]);




  return (
    <>
        <Box margin={"20px 0px 40px 0px"}>
            <BreadcrumbCustom actualPage={"Rendez-vous"}/>
            <Text fontWeight={600}>Rendez-vous</Text>
        </Box>
        <Box p={5}>
        <Table variant="simple">
            <Thead>
            <Tr>
                <Th>Date</Th>
                <Th>Patient</Th>
                <Th>État</Th>
                <Th>Actions</Th>
            </Tr>
            </Thead>
            <Tbody>
            {appointments.map((appointment, index) => (
                <Tr key={index}>
                <Td>{appointment.start.split('T')[0]} {appointment.start.split('T')[1].slice(0, -1)}</Td>
                <Td>{appointment.title}</Td>
                <Td>{appointment.isDone ? <Badge colorScheme='green'>A finir</Badge> : <Badge colorScheme='red'>En Attente</Badge>}</Td>
                <Td>
                    <IconButton icon={<EditIcon />} onClick={() => handleEdit(appointment)} m={1} />
                    <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteConfirm(appointment.IdCalendrier)} m={1} />
                    {appointment.isDone ? <IconButton icon={<CheckIcon />} onClick={() => handleFinish(appointment.IdCalendrier)} m={1} /> : null }
                </Td>
                </Tr>
            ))}
            </Tbody>
        </Table>
        <ModalEditCreneau 
            isOpen={isEditOpen} 
            appointment={selectedAppointment}
            onClose={onEditClose} 
            handleChange={handleChange} 
            selectedAppointment={selectedAppointment} 
            handleSaveChanges={handleSaveChanges} 
        />
        <ModalConfirm
            isOpen={isConfirmOpen}
            onClose={onConfirmClose}
            onConfirm={confirmDelete}
            confirmText="Supprimer"
            confirmMessage="Êtes-vous sûr de vouloir supprimer ce rendez-vous ?"
        />
        <ModalFinishCreneau
            isOpen={isFinishOpen}
            onClose={onFinishClose}
            IdAppointment={appointmentToFinish}
            fetchAppointments={fetchAppointments}
        />

        </Box>
    </>
  );
}

export default ManageAppointments;
