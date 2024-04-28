import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Button,
    Box
} from '@chakra-ui/react';

import {DeleteIcon, EditIcon, AddIcon} from "@chakra-ui/icons";
import PropTypes from 'prop-types';

export function TableauDisplayUser({patients, deleteOnClick, editOnClick, openAddModal}){
    return (
        <>
            <Box as={'div'} display={'flex'} justifyContent={'space-between'}>
                    <Text fontSize={'24px'} fontWeight={700} marginBlock={'15px'}>Vos Patients</Text>
                    <Button variant='main' rightIcon={<AddIcon />} onClick={openAddModal}>Ajouter</Button>
            </Box>
            <TableContainer maxW="100%" maxHeight="60vh" overflowY="auto" overflowX={'auto'} marginBlock={"10px"}>
                <Table variant='striped' colorScheme='main' size={"md"}>
                    <Thead position="sticky" top={0} zIndex="docked">
                    <Tr>
                        <Th>Nom Prénom</Th>
                        <Th>Adresse</Th>
                        <Th width="10%">Profession</Th>
                        <Th width="10%">Sexe</Th>
                        <Th width="10%">Moyen de connaissance</Th>
                        <Th width="5%">Actions</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {patients.map((patient, index) => (
                            <Tr key={index}>
                                <Td isTruncated overflowWrap={'break-word'} width="10%">{patient.Nom} {patient.Prenom}</Td>
                                <Td whiteSpace={'nowrap'} textOverflow={'ellipsis'} overflowWrap={'break-word'} width="100px">{patient.Adresse}</Td>
                                <Td>{patient.Profession}</Td>
                                <Td>{patient.Sexe}</Td>
                                <Td>{patient.MoyenDeConnaissance}</Td>
                                <Td textAlign={"center"} >
                                    <Box display={'flex'} gap={'5px'}>
                                        <DeleteIcon cursor={"pointer"} onClick={() => deleteOnClick(patient)}/>
                                        <EditIcon cursor={"pointer"} onClick={() => editOnClick(patient)}/>
                                    </Box>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
}
TableauDisplayUser.propTypes = {
    patients: PropTypes.array.isRequired,
    editOnClick: PropTypes.func,
    deleteOnClick: PropTypes.func,
    openAddModal: PropTypes.func,
};
