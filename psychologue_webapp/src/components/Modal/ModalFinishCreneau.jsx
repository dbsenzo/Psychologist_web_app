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
    RadioGroup,
    Stack,
    Radio,
    Textarea,
    Select,
    useToast
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import PropTypes from 'prop-types';
import AppointmentsAPI from '../../services/AppointmentsAPI';
  
  function ModalFinishCreneau({ isOpen, onClose, IdAppointment, fetchAppointments }) {

      const [form, setForm] = useState({
          retard: '1',
          stress: '0',
          paymentMode: '',
          observation: ''
      });
      const [errors, setErrors] = useState({});
      const toast = useToast();
  

  
      const handleChange = (e) => {
          const { name, value } = e.target;
          setForm(prev => ({ ...prev, [name]: value }));
      };

    const handleRadioChange = (nextValue, name) => {
        setForm(prev => ({ ...prev, [name]: nextValue }));
    };
  
      const validForm = () => {
          let newErrors = {};
          if (!form.retard) {
              newErrors.retard = 'Le champ "Retard" est requis.';
          }
          if (!form.stress) {
              newErrors.stress = 'Veuillez indiquer si du stress a été détecté.';
          }
          if (!form.paymentMode) {
              newErrors.paymentMode = 'Le mode de paiement est requis.';
          }
  
          setErrors(newErrors);
          if (Object.keys(newErrors).length > 0) {
              toast({
                  title: "Erreur de validation.",
                  description: "Veuillez corriger les erreurs avant de soumettre.",
                  status: "error",
                  duration: 5000,
                  isClosable: true
              });
              return false;
          }
          return true;
      };
  
      const handleSubmit = async () => {
        if (validForm()) {
            try {
                // Envoie les données à l'API et attend la réponse
                const response = await AppointmentsAPI.finishAppointment(IdAppointment, form);
                
                // Affiche un toast de succès si la réponse est positive
                toast({
                    title: 'Succès',
                    description: response.message, 
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

                if (typeof fetchAppointments === 'function') {
                    fetchAppointments(); // Rafraîchit la liste des rendez-vous
                }

                onClose(); // Ferme la modal après la soumission
            } catch (error) {
                // En cas d'erreur, affiche un toast d'erreur
                toast({
                    title: 'Erreur',
                    description: error.message || "Un problème est survenu lors de la fin du rendez-vous.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
            }
            }
        };
    
  
      return (
          <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>Fiche de fin de rendez-vous</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                      <FormControl isRequired isInvalid={errors.retard}>
                          <FormLabel>Retard</FormLabel>
                          <RadioGroup name="retard" value={form.retard} onChange={(value) =>handleRadioChange(value, 'retard')}>
                              <Stack spacing={5} direction='row'>
                                  <Radio colorScheme='green' value='1'>
                                      Oui
                                  </Radio>
                                  <Radio colorScheme='red' value='0'>
                                      Non
                                  </Radio>
                              </Stack>
                          </RadioGroup>
                          {errors.retard && <p style={{ color: 'red' }}>{errors.retard}</p>}
                      </FormControl>
  
                      <FormControl mt={4} isRequired isInvalid={errors.stress}>
                          <FormLabel>Stress détecté</FormLabel>
                          <RadioGroup name="stress" value={form.stress} onChange={(value) => handleRadioChange(value, 'stress')}>
                              <Stack spacing={5} direction='row'>
                                  <Radio colorScheme='green' value='1'>
                                      Oui
                                  </Radio>
                                  <Radio colorScheme='red' value='0'>
                                      Non
                                  </Radio>
                              </Stack>
                          </RadioGroup>
                      </FormControl>
  
                      <FormControl mt={4} isRequired isInvalid={errors.paymentMode}>
                          <FormLabel>Mode de paiement</FormLabel>
                          <Select name="paymentMode" placeholder='Réglement' value={form.paymentMode} onChange={handleChange} borderColor={errors.paymentMode ? 'red.500' : 'gray.200'}>
                              <option value='cb'>Carte Bancaire</option>
                              <option value='virement'>Virement Bancaire</option>
                            <option value='cheque'>Chèque</option>
                            <option value='liquide'>Liquide</option>
                            <option value='autre'>Autre</option>
                        </Select>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Observation</FormLabel>
                        <Textarea
                            name="observation"
                            placeholder='Écrire des observations ici'
                            size='sm'
                            resize={'none'}
                            value={form.observation}
                            onChange={handleChange}
                        />
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

  
  ModalFinishCreneau.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    IdAppointment: PropTypes.string,
    fetchAppointments: PropTypes.func
  };
  
  export default ModalFinishCreneau;
  