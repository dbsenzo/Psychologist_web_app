// services/NotificationService.js
import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

export function useNotification() {
    const toast = useToast();

    const notify = useCallback(({ title, description, status }) => {
        toast({
            title,
            description,
            status,
            duration: 5000,
            isClosable: true,
            position: "bottom-right"
        });
    }, [toast]);

    return { notify };
}
