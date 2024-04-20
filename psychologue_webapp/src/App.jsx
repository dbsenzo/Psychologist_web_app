
import { ChakraProvider,Box } from '@chakra-ui/react'
import { Homepage } from './page/Homepage';
import theme from './theme';
import { RouterProvider, createBrowserRouter, Outlet, useNavigate} from 'react-router-dom';
import { Reserver } from './page/Reserver';
import { Sidebar } from './components/Navigation/Sidebar';
import { LoginPage } from './page/Login';
import AuthContextProvider, { AuthContext } from './context/AuthContext';
import { useContext, useEffect } from 'react';
import ProtectedRoute from './components/Navigation/ProtectedRoute';
import NotFoundPage from './components/Navigation/NotFound';
import { ClientHomepage } from './page/ClientHomepage';


const HeaderLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isAdmin && window.location.pathname === '/login') {
      navigate('/');
    } else if (!user.isAdmin && window.location.pathname === '/login') {
      navigate('/account/viewAppointment');
    }
  }, [user, navigate]);

  return (
    <>
      <Box display="flex" height="100vh">
        <Box position="fixed" height="100vh" overflowY="auto">
          <Sidebar />
        </Box>
        <Box flex="1" ml="290px" paddingInline="10px" overflowY="auto">
          <Outlet />
        </Box>
      </Box>
    </>
  )};


// Router definition
const routerAdmin = [
  {
    path: '/',
    element: <HeaderLayout/>,
    children: [
      {
        index: true,
        element: <ProtectedRoute adminOnly><Homepage/></ProtectedRoute> ,
      },
      {
        path: 'reservation',
        element: <ProtectedRoute adminOnly><Reserver/></ProtectedRoute>
      },
    ]
  }
];

const routerPatient = [
  {
    path: '/account/viewAppointment',
    element: <ProtectedRoute><ClientHomepage/></ProtectedRoute>
  }
]

const routerError = [
  {
    path: '*',
    element: <NotFoundPage />,
  }
]

const routerLogin = [
  {
    
    children: [
      {
        path: '/login',
        element: <LoginPage/>
      }
    ]
  }
]

const router = createBrowserRouter([...routerAdmin, ...routerPatient, ...routerLogin, ...routerError]);



const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ChakraProvider>
  )
}

export default App;