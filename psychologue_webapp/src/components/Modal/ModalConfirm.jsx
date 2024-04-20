import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react';
import PropTypes from 'prop-types';


function ModalConfirm({ isOpen, onClose, onConfirm, confirmText, confirmMessage }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation requise</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{confirmMessage || 'Voulez-vous supprimer cet élément ?'}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onConfirm}>
            {confirmText || 'Supprimer'}
          </Button>
          <Button onClick={onClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ModalConfirm.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    confirmText: PropTypes.string,
    confirmMessage: PropTypes.string
};

export default ModalConfirm;
