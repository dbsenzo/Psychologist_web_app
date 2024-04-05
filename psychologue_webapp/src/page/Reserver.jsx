import { useDisclosure, Box, Text } from "@chakra-ui/react";
import { ModalAjoutPatient } from "../components/reservation/ModalAjoutPatient";
import { TableauDisplayUser } from "../components/DataGrids/TableauDisplayUser";
import { useEffect, useState } from "react";
import ClientsAPI from "../services/ClientsAPI";
import { BreadcrumbCustom } from "../components/Dashboard_Box/Breadcrumb";
import { BoxOne } from "../components/Dashboard_Box/Box1";

export function Reserver() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [patientsObject, setPatientsObject] = useState([]);

    const fetchPatientsObject = async () => {
        setPatientsObject(await ClientsAPI.getClients());
    }
    
    useEffect(() => {
        fetchPatientsObject();
    }, [])
    
    return (
        <>
            <Box as="div" display={"flex"} flexDirection={"column"} width={"100%"} marginInline={'10px'} gap={"20px"}>
                <Box margin={"20px 0px 40px 0px"}>
                    <BreadcrumbCustom actualPage={"Patients"}/>
                    <Text fontWeight={600}>Patients</Text>
                </Box>
                <ModalAjoutPatient isOpen={isOpen} onClose={onClose}/>  
                <BoxOne width={"100%"} component={<TableauDisplayUser patients={patientsObject} editOnClick={onOpen} deleteOnClick={onOpen}/>}/>
            </Box>
        </>
    );
}
