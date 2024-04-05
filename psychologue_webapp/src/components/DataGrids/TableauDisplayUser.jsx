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
  } from '@chakra-ui/react'

import {DeleteIcon, EditIcon, AddIcon} from "@chakra-ui/icons"
import PropTypes from 'prop-types';

export function TableauDisplayUser({patients, deleteOnClick, editOnClick}){
    return (
        <TableContainer maxHeight={"500px"} overflowY={'auto'}>
            <Box as={'div'} display={'flex'} justifyContent={'space-between'}>
                <Text fontSize={'24px'} fontWeight={700} marginBlock={'15px'}>Vos Patients</Text>
                <Button variant='main' rightIcon={<AddIcon />}>Ajouter</Button>
            </Box>
            <Table variant='striped' colorScheme='main'>
                <Thead position="sticky" top={0} zIndex="docked">
                <Tr>
                    <Th>Nom Prénom</Th>
                    <Th>Adresse</Th>
                    <Th>Profession</Th>
                    <Th>Sexe</Th>
                    <Th>Moyen de connaissance</Th>
                    <Th>Actions</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {patients.map((patient, index) => {
                        return(
                            <Tr key={index}>
                                <Td>{patient.Nom} {patient.Prenom}</Td>
                                <Td>{patient.Adresse}</Td>
                                <Td>{patient.Profession}</Td>
                                <Td>{patient.Sexe}</Td>
                                <Td>{patient.MoyenDeConnaissance}</Td>
                                <Td textAlign={"center"}><DeleteIcon cursor={"pointer"} onClick={deleteOnClick}/> <EditIcon cursor={"pointer"} onClick={editOnClick}/></Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
TableauDisplayUser.propTypes = {
    patients: PropTypes.array.isRequired,
    editOnClick: PropTypes.func,
    deleteOnClick: PropTypes.func
};