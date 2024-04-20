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
} from '@chakra-ui/react';
import { useNotification } from '../../services/NotificationService';

import PropTypes from 'prop-types';
import ClientsAPI from '../../services/ClientsAPI';


function ModalUpdatePatient({ isOpen, onClose, patient }) {
  const [formData, setFormData] = useState({
    Prenom: '',
    Nom: '',
    Adresse: '',
    Profession: '',
    Sexe: '',
    MoyenDeConnaissance: ''
  });

  const [originalData, setOriginalData] = useState({}); // Pour stocker les données initiales du patient
  
  const { notify } = useNotification();

  useEffect(() => {
    console.log(patient, 'TT')
    if (patient) {
      setFormData({
        Prenom: patient.Prenom || '',
        Nom: patient.Nom || '',
        Adresse: patient.Adresse || '',
        Profession: patient.Profession || '',
        Sexe: patient.Sexe || '',
        MoyenDeConnaissance: patient.MoyenDeConnaissance || ''
      });
      setOriginalData({
        Prenom: patient.Prenom || '',
        Nom: patient.Nom || '',
        Adresse: patient.Adresse || '',
        Profession: patient.Profession || '',
        Sexe: patient.Sexe || '',
        MoyenDeConnaissance: patient.MoyenDeConnaissance || ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const updateData = {
      ...formData,
      IdPatient: patient.id
    };

    // Vérifie si la profession a été modifiée avant de l'inclure dans l'envoi
    if (formData.Profession === originalData.Profession) {
      updateData.Profession = null;
    }

    ClientsAPI.updateClient(patient.id, updateData)
      .then(() => {
        notify({
            title: "Succès",
            description: "Patient modifié avec succès.",
            status: "success"
        });
      })
      .catch(error => {
          notify({
              title: "Error",
              description: error.message || "Une erreur s'est produite.",
              status: "error"
          });
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{patient ? 'Modifier un patient' : 'Add New Patient'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Prénom</FormLabel>
              <Input placeholder="Prénom" name="Prenom" value={formData.Prenom} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Nom</FormLabel>
              <Input placeholder="Nom" name="Nom" value={formData.Nom} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Adresse</FormLabel>
              <Input placeholder="Adresse" name="Adresse" value={formData.Adresse} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Profession</FormLabel>
              <Input placeholder="Profession" name="Profession" value={formData.Profession} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Sexe</FormLabel>
              <Select name="Sexe" value={formData.Sexe} onChange={handleChange}>
                <option value="">Sélectionner une option</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Comment avez-vous entendu parler de nous ?</FormLabel>
              <Select name="MoyenDeConnaissance" value={formData.MoyenDeConnaissance} onChange={handleChange}>
                <option value="">Sélectionner une option</option>
                <option value="Internet">Internet</option>
                <option value="Ami">Ami(e)</option>
                <option value="Publicite">Publicité</option>
                <option value="Autre">Autre</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {patient ? 'Update' : 'Save'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

ModalUpdatePatient.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    patient: PropTypes.object,
    onSave: PropTypes.func,

};

export default ModalUpdatePatient;
