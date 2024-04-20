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
    primary: 'rgba(75,192,192,0.5)', // Exemple de couleur primaire
    secondary: 'rgba(75,192,192,0.15)', // Exemple de couleur secondaire
    buttonBackground: 'rgba(75,192,192,1)', // Définition de la couleur spécifique des boutons
    textColor: "rgba(75,192,192,1)"
  },
  components: {
    Text: {
        baseStyle: {
            color: 'black'
        },
        variant: {
            hoverBlue: {
              _hover: {
                bg: 'rgba(75,192,192,0.5)'
              }
            }
        }

    },
    Li: { // Ajout d'un composant personnalisé `Li` à la configuration du thème
      // Styles pour l'état non actif
      baseStyle: {
        display: 'flex',
        gap: '10px',
        width: "80%",
        background: "transparent",
        borderRadius: "12px",
        padding: '5px',
        cursor: 'pointer',
        image: {
          color: "currentColor",
          background: "white",
          padding: "5px",
          borderRadius: "10px",
          boxShadow: "0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)"

        },
        text: {
          color: "#718096",
          fontSize: 'large',
          fontWeight: 500,
        }
      },
      // Styles pour l'état actif
      variants: {
        active: {
          bg: "white",
          padding: "15px",
          boxShadow: "0px 5px 3.5px 0px rgba(0, 0, 0, 0.02)",
          cursor: 'unset',
          image: {
            backgroundColor: "White",
            boxShadow: "none"

          },
          text: {
            color: "black",
          }
        }
      }
    },
    Table: {
      variants: {
        striped: { // Utilisation de 'striped' au lieu de 'main' pour correspondre à votre demande
          th: {
            bg: 'white',
          },
          tbody: {
            tr: {
              '&:nth-of-type(odd)': {
                backgroundColor: 'secondary', // Utilisez cette configuration pour les lignes zébrées
              },
            },
          },
        },
      },
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
            bg: 'buttonBackground', // Couleur au survol (exemple)
          },
        },
        secondary: {
            bg: 'secondary', // Utilisation de la couleur définie dans 'colors'
            color: 'black', // Couleur du texte sur le bouton
            _hover: {
              bg: 'primary', // Couleur au survol (exemple)
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
