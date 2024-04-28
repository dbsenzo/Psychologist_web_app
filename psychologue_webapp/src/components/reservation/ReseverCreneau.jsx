import { useEffect, useState } from "react";
import { Text,Select,Button,Box } from "@chakra-ui/react";
import PropTypes from 'prop-types';


export function ReserverCreneau({setStep, step}) {
    // Création d'un état pour stocker les créneaux disponibles
    const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);

    const creneaux = async () => {
        try {
            const reponse = await fetch(`${import.meta.env.VITE_API_URL}/creneaux/libres`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });
        
            if (!reponse.ok) {
                throw new Error('La récupération des créneaux a échoué');
            }

            const resultat = await reponse.json();
            console.log("Réussite :", resultat);
            setCreneauxDisponibles(resultat); // Mise à jour de l'état avec les créneaux récupérés
        } catch (erreur) {
            console.error("Erreur :", erreur);
        }
    }

    useEffect(() => {
        creneaux();
    }, []);
      
    return (
        <>
            {creneauxDisponibles.length > 0 ? (
                <Box display={'flex'} flexDirection={'column'} gap={"10px"}>
                    <Text as={'h2'}>Créneaux disponibles</Text>
                    <Select placeholder='Selectionner un créneau' background={'white'}>
                            {creneauxDisponibles.map((creneau, index) => (
                                <option key={index} value={creneau}>{creneau.Creneaux}</option> // Assurez-vous que `creneau` peut être rendu comme tel. Sinon, ajustez en fonction de la structure de vos données.
                            ))}
                    </Select>
                    <Box textAlign={'center'}>
                        <Button variant={'main'} onClick={() => setStep(step+1)}>Suivant</Button> 
                    </Box>
                        
                </Box>
            ) : (
                <Text color={'white'}>Chargement des créneaux disponibles...</Text>
            )}
        </>
    );
}

ReserverCreneau.propTypes = {
    step: PropTypes.number,
    setStep: PropTypes.func

  };