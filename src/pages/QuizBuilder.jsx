import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const QuizBuilder = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { questions, fetchQuestions, createQuiz, fetchQuizById, currentQuiz, isLoading } = useQuizStore()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questionIds: [],
        timeLimit: 0
    })
    const [message, setMessage] = useState({ type: '', text: '' })
    const isEditing = Boolean(id)

    useEffect(() => {
        fetchQuestions()
        if (isEditing) {
            fetchQuizById(id).then(quiz => {
                setFormData({
                    title: quiz.title,
                    description: quiz.description || '',
                    questionIds: quiz.questions.map(q => q._id),
                    timeLimit: quiz.timeLimit || 0
                })
            }).catch(() => {
                navigate('/quizzes')
            })
        }
    }, [id, isEditing])

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.questionIds.length === 0) {
            showMessage('error', 'Please select at least one question')
            return
        }

        const result = await createQuiz({
            ...formData,
            questions: formData.questionIds
        })

        if (result.success) {
            navigate('/quizzes')
        } else {
            showMessage('error', result.error)
        }
    }

    const toggleQuestion = (questionId) => {
        setFormData(prev => ({
            ...prev,
            questionIds: prev.questionIds.includes(questionId)
                ? prev.questionIds.filter(id => id !== questionId)
                : [...prev.questionIds, questionId]
        }))
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="btn btn-secondary"
                    style={{ marginRight: '16px' }}
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
                </h1>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2" style={{ marginBottom: '32px' }}>
                    <div className="card">
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Quiz Details</h2>

                        <div className="form-group">
                            <label className="form-label">Quiz Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Enter quiz title"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="Enter quiz description (optional)"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Time Limit (minutes)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.timeLimit}
                                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                                min="0"
                                placeholder="0 = No time limit"
                            />
                        </div>

                        <div style={{
                            padding: '16px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Quiz Summary</h3>
                            <div style={{ fontSize: '14px', color: '#4b5563' }}>
                                <p><strong>Questions Selected:</strong> {formData.questionIds.length}</p>
                                <p><strong>Time Limit:</strong> {formData.timeLimit ? `${formData.timeLimit} minutes` : 'No limit'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                            Select Questions ({formData.questionIds.length} selected)
                        </h2>

                        {questions.length > 0 ? (
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                {questions.map((question) => (
                                    <div
                                        key={question._id}
                                        onClick={() => toggleQuestion(question._id)}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            marginBottom: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.questionIds.includes(question._id) ? '#eff6ff' : 'white',
                                            borderColor: formData.questionIds.includes(question._id) ? '#3b82f6' : '#e5e7eb'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.questionIds.includes(question._id)}
                                                onChange={() => {}}
                                                style={{ marginRight: '12px', marginTop: '2px' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '500',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              marginRight: '8px'
                          }}>
                            {question.questionType}
                          </span>
                                                </div>
                                                <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                                                    {question.questionText}
                                                </p>
                                                {question.options && question.options.length > 0 && (
                                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        Options: {question.options.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                                No questions available. Create some questions first.
                            </p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/quizzes')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={20} />
                            {isEditing ? 'Update Quiz' : 'Create Quiz'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default QuizBuilder