import { useState, useEffect } from 'react'
import { useQuizStore } from '../store/quizStore.js'
import { Plus, Upload, Edit, Trash2, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Modal from '../components/Modal.jsx'

const Questions = () => {
    const { questions, fetchQuestions, createQuestion, uploadQuestions, deleteQuestion, isLoading } = useQuizStore()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchQuestions()
    }, [])

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleCreateQuestion = async (questionData) => {
        const result = await createQuestion(questionData)
        if (result.success) {
            setShowCreateModal(false)
            showMessage('success', 'Question created successfully!')
        } else {
            showMessage('error', result.error)
        }
    }

    const handleUploadQuestions = async (formData) => {
        const result = await uploadQuestions(formData)
        if (result.success) {
            setShowUploadModal(false)
            showMessage('success', result.message)
        } else {
            showMessage('error', result.error)
        }
    }

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            const result = await deleteQuestion(questionId)
            if (result.success) {
                showMessage('success', 'Question deleted successfully!')
            } else {
                showMessage('error', result.error)
            }
        }
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Questions</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowUploadModal(true)} className="btn btn-secondary">
                        <Upload size={20} />
                        Upload Questions
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                        <Plus size={20} />
                        Create Question
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <FileText size={20} style={{ marginRight: '8px' }} />
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Question Bank ({questions.length})</h2>
                </div>

                {questions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {questions.map((question) => (
                            <div key={question._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          marginRight: '8px'
                      }}>
                        {question.questionType}
                      </span>
                                        </div>
                                        <h4 style={{ fontWeight: '500', marginBottom: '12px', fontSize: '16px' }}>
                                            {question.questionText}
                                        </h4>

                                        {question.options && question.options.length > 0 && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Options:</p>
                                                <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#4b5563' }}>
                                                    {question.options.map((option, index) => (
                                                        <li key={index} style={{
                                                            marginBottom: '2px',
                                                            color: option === question.answer ? '#059669' : '#4b5563',
                                                            fontWeight: option === question.answer ? '500' : 'normal'
                                                        }}>
                                                            {option} {option === question.answer && '✓'}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                            <strong>Answer:</strong> {question.answer}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleDeleteQuestion(question._id)}
                                            className="btn btn-danger"
                                            style={{ fontSize: '14px', padding: '6px 12px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '8px' }}>No questions yet</h3>
                        <p>Create your first question to get started.</p>
                    </div>
                )}
            </div>

            <CreateQuestionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateQuestion}
            />

            <UploadQuestionModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSubmit={handleUploadQuestions}
            />
        </div>
    )
}

const CreateQuestionModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        questionText: '',
        questionType: 'multiple-choice',
        options: ['', '', '', ''],
        answer: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const questionData = {
            ...formData,
            options: formData.questionType === 'multiple-choice' ? formData.options.filter(opt => opt.trim()) : []
        }

        onSubmit(questionData)

        setFormData({
            questionText: '',
            questionType: 'multiple-choice',
            options: ['', '', '', ''],
            answer: ''
        })
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options]
        newOptions[index] = value
        setFormData({ ...formData, options: newOptions })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Question">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Question Text</label>
                    <textarea
                        className="form-textarea"
                        value={formData.questionText}
                        onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                        required
                        rows={3}
                        placeholder="Enter your question..."
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Question Type</label>
                    <select
                        className="form-select"
                        value={formData.questionType}
                        onChange={(e) => setFormData({
                            ...formData,
                            questionType: e.target.value,
                            options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : []
                        })}
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                    </select>
                </div>

                {formData.questionType === 'multiple-choice' && (
                    <div className="form-group">
                        <label className="form-label">Options</label>
                        {formData.options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                className="form-input"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                style={{ marginBottom: '8px' }}
                            />
                        ))}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Correct Answer</label>
                    {formData.questionType === 'true-false' ? (
                        <select
                            className="form-select"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            required
                        >
                            <option value="">Select answer</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    ) : formData.questionType === 'multiple-choice' ? (
                        <select
                            className="form-select"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            required
                        >
                            <option value="">Select correct option</option>
                            {formData.options.filter(opt => opt.trim()).map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            className="form-input"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            required
                            placeholder="Enter the correct answer"
                        />
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Create Question
                    </button>
                </div>
            </form>
        </Modal>
    )
}

const UploadQuestionModal = ({ isOpen, onClose, onSubmit }) => {
    const [file, setFile] = useState(null)
    const [fileType, setFileType] = useState('json')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.append('questionsFile', file)
        formData.append('fileType', fileType)

        onSubmit(formData)

        setFile(null)
        setFileType('json')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Questions">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">File Type</label>
                    <select
                        className="form-select"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                    >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Upload File</label>
                    <input
                        type="file"
                        className="form-input"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept={fileType === 'json' ? '.json' : '.csv'}
                        required
                    />
                </div>

                <div style={{ padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                        <strong>File Format:</strong>
                    </p>
                    {fileType === 'json' ? (
                        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`[
  {
    "questionText": "What is 2+2?",
    "questionType": "multiple-choice",
    "options": ["3", "4", "5", "6"],
    "answer": "4"
  }
]`}
            </pre>
                    ) : (
                        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`questionText,questionType,options,answer
"What is 2+2?","multiple-choice","3,4,5,6","4"
"True or False: Sky is blue","true-false","","true"`}
            </pre>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Upload Questions
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default Questions