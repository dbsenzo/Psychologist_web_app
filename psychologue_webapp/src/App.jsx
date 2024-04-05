
import { ChakraProvider,Box } from '@chakra-ui/react'
import { Homepage } from './page/Homepage';
import theme from './theme';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { Reserver } from './page/Reserver';
import { Sidebar } from './components/Navigation/Sidebar';


const HeaderLayout = () => (
  <>
    <Box display={'flex'}>
      <Sidebar/>
      <Outlet />
    </Box>
  </>
);

// Router definition
const router = createBrowserRouter([
  {
    element: <HeaderLayout/>,
    children: [
      {
        path: '/',
        element: <Homepage/> ,
      },
      {
        path: '/reservation',
        element: <Reserver/>
      }
    ]
  },
]);




const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  )
}

export default App;