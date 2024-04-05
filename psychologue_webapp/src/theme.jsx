// Importation de la fonction extendTheme de Chakra UI
import { extendTheme } from '@chakra-ui/react'

// Définition du thème personnalisé
const theme = extendTheme({
    styles: {
        // eslint-disable-next-line no-unused-vars
        global: (props) => ({
          body: {
            bg: "#F8F9FA",
          }
        })
      },
  // 1. Vous pouvez toujours définir les couleurs primaires et secondaires si vous le souhaitez
  colors: {
    primary: '#ffc83e', // Exemple de couleur primaire
    secondary: '#F8D57E', // Exemple de couleur secondaire
    buttonBackground: '#F8D57E', // Définition de la couleur spécifique des boutons
  },
  components: {
    Text: {
        baseStyle: {
            color: 'black'
        }

    },
    Button: {
      baseStyle: {
        fontWeight: 'semibold', // Exemple de style de base pour les boutons
      },
      sizes: {
        // Vous pouvez définir ou étendre des tailles ici
      },
      variants: {
        // Création d'une variante personnalisée pour les boutons
        main: {
          bg: 'primary', // Utilisation de la couleur définie dans 'colors'
          color: 'black', // Couleur du texte sur le bouton
          _hover: {
            bg: 'primary', // Couleur au survol (exemple)
          },
        },
        secondary: {
            bg: 'secondary', // Utilisation de la couleur définie dans 'colors'
            color: 'black', // Couleur du texte sur le bouton
            _hover: {
              bg: 'secondary', // Couleur au survol (exemple)
            },
          },
      },
      // Définition des props par défaut pour les boutons
      defaultProps: {
        size: 'md',
        variant: 'custom', // Utilisation de la variante personnalisée comme défaut
      },
    },
  },
})

// Exportation du thème personnalisé
export default theme
