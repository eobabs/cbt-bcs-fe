import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { Plus, Edit, Trash2, Users, BarChart3, BookOpen } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'

const Quizzes = () => {
    const { quizzes, fetchQuizzes, deleteQuiz, assignQuiz, isLoading } = useQuizStore()
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [selectedQuizId, setSelectedQuizId] = useState(null)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchQuizzes()
    }, [])

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            const result = await deleteQuiz(quizId)
            if (result.success) {
                showMessage('success', 'Quiz deleted successfully!')
            } else {
                showMessage('error', result.error)
            }
        }
    }

    const handleAssignQuiz = (quizId) => {
        setSelectedQuizId(quizId)
        setShowAssignModal(true)
    }

    const handleAssignSubmit = async (assignmentData) => {
        const result = await assignQuiz(selectedQuizId, assignmentData)
        if (result.success) {
            setShowAssignModal(false)
            showMessage('success', result.message)
        } else {
            showMessage('error', result.error)
        }
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Quizzes</h1>
                <Link to="/quiz/create" className="btn btn-primary">
                    <Plus size={20} />
                    Create Quiz
                </Link>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <BookOpen size={20} style={{ marginRight: '8px' }} />
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>My Quizzes ({quizzes.length})</h2>
                </div>

                {quizzes.length > 0 ? (
                    <div className="grid grid-2">
                        {quizzes.map((quiz) => (
                            <div key={quiz._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '20px'
                            }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                        {quiz.title}
                                    </h3>
                                    {quiz.description && (
                                        <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                                            {quiz.description}
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#4b5563' }}>
                    <span>
                      <strong>{quiz.questions?.length || 0}</strong> questions
                    </span>
                                        <span>
                      <strong>{quiz.timeLimit || 'No'}</strong> time limit
                    </span>
                                    </div>

                                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <Link
                                        to={`/quiz/edit/${quiz._id}`}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '14px', padding: '6px 12px' }}
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleAssignQuiz(quiz._id)}
                                        className="btn btn-primary"
                                        style={{ fontSize: '14px', padding: '6px 12px' }}
                                    >
                                        <Users size={16} />
                                        Assign
                                    </button>

                                    <Link
                                        to={`/analytics/${quiz._id}`}
                                        className="btn btn-success"
                                        style={{ fontSize: '14px', padding: '6px 12px' }}
                                    >
                                        <BarChart3 size={16} />
                                        Analytics
                                    </Link>

                                    <button
                                        onClick={() => handleDeleteQuiz(quiz._id)}
                                        className="btn btn-danger"
                                        style={{ fontSize: '14px', padding: '6px 12px' }}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '8px' }}>No quizzes yet</h3>
                        <p>Create your first quiz to get started.</p>
                        <Link to="/quiz/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            <Plus size={20} />
                            Create Quiz
                        </Link>
                    </div>
                )}
            </div>

            <AssignQuizModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onSubmit={handleAssignSubmit}
            />
        </div>
    )
}

const AssignQuizModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        studentIds: '',
        dueDate: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const studentIdsArray = formData.studentIds
            .split(',')
            .map(id => id.trim())
            .filter(id => id)

        onSubmit({
            studentIds: studentIdsArray,
            dueDate: formData.dueDate
        })

        setFormData({
            studentIds: '',
            dueDate: ''
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assign Quiz">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Student IDs</label>
                    <textarea
                        className="form-textarea"
                        value={formData.studentIds}
                        onChange={(e) => setFormData({ ...formData, studentIds: e.target.value })}
                        required
                        rows={3}
                        placeholder="Enter student IDs separated by commas (e.g., 507f1f77bcf86cd799439011, 507f1f77bcf86cd799439012)"
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        Enter one or more student IDs separated by commas
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                        type="datetime-local"
                        className="form-input"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Assign Quiz
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default Quizzes