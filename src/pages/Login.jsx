import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const { login, isLoading, token } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const result = await login(formData)
        if (result.success) {
            navigate('/')
        } else {
            setError(result.error)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>
                    Login to BCHS-CBT
                </h2>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '16px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#6b7280' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login