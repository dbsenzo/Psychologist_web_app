import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react'
import PropTypes from 'prop-types';

export function ModalAjoutPatient({isOpen, onClose}) {
    return (
      <>  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <p>TETETETETE</p>
            </ModalBody>
  
            <ModalFooter>
              <Button variant={"main"} mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='secondary'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

ModalAjoutPatient.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};