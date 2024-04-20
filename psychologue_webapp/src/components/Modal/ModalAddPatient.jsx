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
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import ClientsAPI from '../../services/ClientsAPI';
import { useNotification } from '../../services/NotificationService';

function ModalAddPatient({isOpen, onClose}) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    profession: '',
    sexe: '',
    moyenDeConnaissance: '',
    dateNaissance: ''
  });

  const { notify } = useNotification();

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: false
    }));
  };

  const isFormValid = () => {
    const errors = {};
    const today = new Date();
    const dob = new Date(formData.dateNaissance);
    let isValid = true;

    ['nom', 'prenom', 'adresse', 'profession', 'sexe', 'moyenDeConnaissance', 'dateNaissance'].forEach(field => {
      if (!formData[field]) {
        errors[field] = true;
        isValid = false;
      }
    });

    if (dob > today) {
      errors.dateNaissance = true;
      isValid = false;
      console.error("Date of birth cannot be in the future");
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      ClientsAPI.addClient(formData)
        .then(() => {
          notify({
              title: "Succès",
              description: "Patient ajouté avec succès.",
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
        onClose();
    } else {
      notify({
          title: "Attention",
          description: "La modal n'est pas conforme.",
          status: "warning"
      });
    }
  };
  

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un patient</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={formErrors.nom}>
              <FormLabel>Nom</FormLabel>
              <Input placeholder="Nom" name="nom" value={formData.firstName} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={formErrors.prenom}>
              <FormLabel>Prénom</FormLabel>
              <Input placeholder="Prénom" name="prenom" value={formData.lastName} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={formErrors.adresse}>
              <FormLabel>Adresse</FormLabel>
              <Input placeholder="Adresse" name="adresse" value={formData.address} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={formErrors.profession}>
              <FormLabel>Profession</FormLabel>
              <Input placeholder="Profession" name="profession" value={formData.profession} onChange={handleChange} />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={formErrors.dateNaissance}>
              <FormLabel>Date de naissance</FormLabel>
              <Input placeholder='Date de naissance' name='dateNaissance' value={formData.dateNaissance}  onChange={handleChange} size='md' type='date' />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={formErrors.sexe}>
              <FormLabel>Sexe</FormLabel>
              <Select name="sexe" value={formData.sex} onChange={handleChange}>
                <option value="">Sélectionner une option</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                {/* <option value="other">Other</option> */}
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={formErrors.moyenDeConnaissance}>
              <FormLabel>Comment avez-vous entendu parler de nous ?</FormLabel>
              <Select name="moyenDeConnaissance" value={formData.referral} onChange={handleChange}>
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
              Ajouter
            </Button>
            <Button onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

ModalAddPatient.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
};


export default ModalAddPatient;
