import PropTypes from 'prop-types';
import { Box,Button,Select,Text,Input } from '@chakra-ui/react';

export function InformationsPersonnel({step, setStep}){
    return (
        <>
            <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                <Text as={'h2'}>Informations Personnels Du Client</Text>

                <Box display={'flex'} gap={"10px"}>
                    <Input type='text' placeholder='Nom' />
                    <Input type='text' placeholder='Prénom' />
                </Box>
                
                <Box display={'flex'} gap={"10px"}>
                    <Select placeholder='Selectionner une appelation' background={'white'}>
                        <option value={'homme'}>Monsieur</option>
                        <option value={'femme'}>Madame</option>
                    </Select>
                    <Select placeholder='Comment vous nous avez connu ?' background={'white'}>
                        <option value={'friend'}>Ami(e)</option>
                        <option value={'web'}>Internet</option>
                        <option value={'luck'}>Bouche à oreilles</option>
                    </Select>
                </Box>
                <Input type='text' placeholder='Profession' />
                <Box textAlign={'center'}>
                    <Button variant={'main'} onClick={() => setStep(step+1)}>Suivant</Button> 
                </Box>       
            </Box>
        </>
    )
}

InformationsPersonnel.propTypes = {
    step: PropTypes.number,
    setStep: PropTypes.func
};