import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore()

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute