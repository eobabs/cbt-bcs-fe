import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
    const { user, logout } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">
                    BCHS
                </Link>

                <ul className="navbar-nav">
                    <li>
                        <Link to="/" className={isActive('/') ? 'active' : ''}>
                            Dashboard
                        </Link>
                    </li>

                    {user?.role === 'teacher' && (
                        <>
                            <li>
                                <Link to="/questions" className={isActive('/questions') ? 'active' : ''}>
                                    Questions
                                </Link>
                            </li>
                            <li>
                                <Link to="/quizzes" className={isActive('/quizzes') ? 'active' : ''}>
                                    Quizzes
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <Link to="/assignments" className={isActive('/assignments') ? 'active' : ''}>
                            Assignments
                        </Link>
                    </li>

                    <li>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={16} />
                            <span>{user?.name} ({user?.role})</span>
                        </div>
                    </li>

                    <li>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar