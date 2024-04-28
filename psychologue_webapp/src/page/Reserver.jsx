import { useDisclosure, Box, Text } from "@chakra-ui/react";
import { TableauDisplayUser } from "../components/DataGrids/TableauDisplayUser";
import ModalAddPatient from "../components/Modal/ModalAddPatient";
import ModalUpdatePatient from "../components/Modal/ModalUpdatePatient";
import ModalConfirm from "../components/Modal/ModalConfirm";
import { useEffect, useState } from "react";
import ClientsAPI from "../services/ClientsAPI";
import { BreadcrumbCustom } from "../components/Dashboard_Box/Breadcrumb";
import { BoxOne } from "../components/Dashboard_Box/Box1";
import { useNotification } from "../services/NotificationService";
import { useClients } from "../context/ClientsContext";

export function Reserver() {
    const { isOpen: isAddPatientOpen, onOpen: onAddPatientOpen, onClose: onAddPatientClose } = useDisclosure();
    const { isOpen: isUpdatePatientOpen, onOpen: onUpdatePatientOpen, onClose: onUpdatePatientClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const { setClients, clients, fetchClients } = useClients();
    const { notify } = useNotification();
    const [selectedPatient, setSelectedPatient] = useState(null); 

    useEffect(() => {
        fetchClients();
    }, [])

    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        console.log(patient);
        onUpdatePatientOpen();
    }

    const handleDeletePatient = (patient) => {
        console.log(patient)
        setSelectedPatient(patient);
        onConfirmOpen();
    }

    const deletePatient = async () => {
        try {
            console.log(selectedPatient);
            await ClientsAPI.deleteClient(selectedPatient.id)
            .then(() => {
                notify({
                    title: "Succès",
                    description: "Patient supprimé avec succès.",
                    status: "success"
                });
                setClients(prevPatients => prevPatients.filter(p => p.id !== selectedPatient.id));
              })
              .catch(error => {
                  notify({
                      title: "Error",
                      description: error.message || "Une erreur s'est produite.",
                      status: "error"
                  });
              });
            onConfirmClose();
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    }


    return (
        <>
            <Box as="div" display={"flex"} flexDirection={"column"} width={"100%"} gap={"20px"}>
                <Box margin={"20px 0px 40px 0px"}>
                    <BreadcrumbCustom actualPage={"Patients"}/>
                    <Text fontWeight={600}>Patients</Text>
                </Box>
                <Box display={'flex'} justifyContent={'center'}>
                    <BoxOne width={"90%"} height="fit-content" component={
                        <TableauDisplayUser
                            patients={clients}
                            editOnClick={handleEditPatient}
                            deleteOnClick={handleDeletePatient}
                            openAddModal={onAddPatientOpen}
                        />
                    }/>
                </Box>
            </Box>

            {/* Modals */}
            <ModalAddPatient isOpen={isAddPatientOpen} onClose={() => (onAddPatientClose(),fetchClients())}/>
            <ModalUpdatePatient isOpen={isUpdatePatientOpen} onClose={() => (onUpdatePatientClose(),fetchClients()) } patient={selectedPatient}/>
            <ModalConfirm
                isOpen={isConfirmOpen}
                onClose={onConfirmClose}
                onConfirm={deletePatient}
                confirmText="Supprimer"
                confirmMessage={`Êtes-vous sûr de vouloir supprimer ce patient : ${selectedPatient?.Nom} ${selectedPatient?.Prenom} ?`}
            />
        </>
    );
}
