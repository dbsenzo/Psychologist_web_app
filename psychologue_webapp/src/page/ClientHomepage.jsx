import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar } from '../components/Dashboard_Box/Calendar';
import { Box } from '@chakra-ui/react';
export function ClientHomepage() {
  const { user } = useContext(AuthContext);

  return (
    <Box p={5}>
      {/* Assurez-vous que user.clientId existe et est valide */}
      <Calendar clientId={user.id}/>
    </Box>
  );
}
