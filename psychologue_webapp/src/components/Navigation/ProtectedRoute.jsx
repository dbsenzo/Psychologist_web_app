import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !user.isAdmin) {
        // Si la route est réservée aux admins et que l'utilisateur n'est pas admin
        return <Navigate to="/" replace />;
    }

    // Rendre les enfants si aucune des conditions ci-dessus n'est vraie
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node,
    adminOnly: PropTypes.bool
};

export default ProtectedRoute;
