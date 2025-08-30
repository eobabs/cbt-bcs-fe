import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Questions from './pages/Questions'
import Quizzes from './pages/Quizzes'
import QuizBuilder from './pages/QuizBuilder'
import Assignments from './pages/Assignments'
import TakeQuiz from './pages/TakeQuiz'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    const { token } = useAuthStore()

    return (
        <div className="app">
            {token && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/questions" element={
                        <ProtectedRoute>
                            <Questions />
                        </ProtectedRoute>
                    } />
                    <Route path="/quizzes" element={
                        <ProtectedRoute>
                            <Quizzes />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/create" element={
                        <ProtectedRoute>
                            <QuizBuilder />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/edit/:id" element={
                        <ProtectedRoute>
                            <QuizBuilder />
                        </ProtectedRoute>
                    } />
                    <Route path="/assignments" element={
                        <ProtectedRoute>
                            <Assignments />
                        </ProtectedRoute>
                    } />
                    <Route path="/take-quiz/:id" element={
                        <ProtectedRoute>
                            <TakeQuiz />
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics/:quizId" element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    )
}

export default App
