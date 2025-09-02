import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useQuizStore} from '../store/quizStore'
import {Clock, ChevronLeft, ChevronRight, CheckCircle} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const TakeQuiz = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {startQuizSession, submitQuiz} = useQuizStore()

    const [quizData, setQuizData] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(0)
    const [quizStartTime] = useState(new Date())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        initializeQuiz()
    }, [id])

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && quizData?.timeLimit) {
            handleSubmitQuiz()
        }
    }, [timeLeft])

    const initializeQuiz = async () => {
        try {
            const result = await startQuizSession(id)
            if (result.success) {
                setQuizData(result.data)
                if (result.data.timeLimit) {
                    setTimeLeft(result.data.timeLimit * 60)
                }
            } else {
                alert(result.error)
                navigate('/assignments')
            }
        } catch (error) {
            alert('Failed to start quiz session')
            navigate('/assignments')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        })
    }

    const handleSubmitQuiz = async () => {
        if (isSubmitting) return

        const unansweredCount = quizData.questions.length - Object.keys(answers).length
        if (unansweredCount > 0) {
            const confirmSubmit = window.confirm(
                `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
            )
            if (!confirmSubmit) return
        }

        setIsSubmitting(true)

        try {
            const result = await submitQuiz(id, {
                answers,
                startedAt: quizStartTime
            })

            if (result.success) {
                alert(`Quiz submitted successfully! Your score: ${result.data.score}%`)
                navigate('/assignments')
            } else {
                alert(result.error)
                setIsSubmitting(false)
            }
        } catch (error) {
            alert('Failed to submit quiz')
            setIsSubmitting(false)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index)
    }

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const goToNext = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    if (isLoading) return <LoadingSpinner/>

    if (!quizData) {
        return (
            <div className="card">
                <p>Failed to load quiz. Please try again.</p>
            </div>
        )
    }

    const currentQuestion = quizData.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100

    return (
        <div>
            {quizData.timeLimit && (
                <div className="quiz-timer">
                    <Clock size={20}/>
                    Time Left: {formatTime(timeLeft)}
                </div>
            )}
            <div className="card" style={{marginBottom: '20px'}}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>{quizData.quizTitle}</h1>
                    <div style={{fontSize: '14px', color: '#6b7280'}}>
                        Question {currentQuestionIndex + 1} of {quizData.questions.length}
                    </div>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{width: `${progress}%`}}
                    />
                </div>
            </div>

            <div className="grid grid-3">
                <div className="card">
                    <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>Questions</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px'}}>
                        {quizData.questions.map((question, index) => (
                            <button
                                key={question._id}
                                onClick={() => goToQuestion(index)}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    backgroundColor: answers[question._id] ? '#10b981' :
                                        index === currentQuestionIndex ? '#3b82f6' : 'white',
                                    color: answers[question._id] || index === currentQuestionIndex ? 'white' : '#374151',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div style={{marginTop: '20px', fontSize: '14px'}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: '#10b981',
                                borderRadius: '2px',
                                marginRight: '8px'
                            }}></div>
                            <span>Answered ({Object.keys(answers).length})</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: '#3b82f6',
                                borderRadius: '2px',
                                marginRight: '8px'
                            }}></div>
                            <span>Current</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '2px',
                                marginRight: '8px'
                            }}></div>
                            <span>Unanswered</span>
                        </div>
                    </div>
                </div>
                <div style={{gridColumn: 'span 2'}}>
                    <div className="card">
                        <div style={{marginBottom: '24px'}}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#f3f4f6',
                    color: '#374151'
                }}>
                  {currentQuestion.questionType}
                </span>
                            </div>

                            <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', lineHeight: '1.5'}}>
                                {currentQuestion.questionText}
                            </h2>
                            <div style={{marginBottom: '32px'}}>
                                {currentQuestion.questionType === 'multiple-choice' && (
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                        {currentQuestion.options.map((option, index) => (
                                            <label
                                                key={index}
                                                className={`question-option ${answers[currentQuestion._id] === option ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestion._id}`}
                                                    value={option}
                                                    checked={answers[currentQuestion._id] === option}
                                                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.questionType === 'true-false' && (
                                    <div style={{display: 'flex', gap: '16px'}}>
                                        <label
                                            className={`question-option ${answers[currentQuestion._id] === 'true' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion._id}`}
                                                value="true"
                                                checked={answers[currentQuestion._id] === 'true'}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                            />
                                            <span>True</span>
                                        </label>
                                        <label
                                            className={`question-option ${answers[currentQuestion._id] === 'false' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion._id}`}
                                                value="false"
                                                checked={answers[currentQuestion._id] === 'false'}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                            />
                                            <span>False</span>
                                        </label>
                                    </div>
                                )}

                                {currentQuestion.questionType === 'short-answer' && (
                                    <textarea
                                        className="form-textarea"
                                        value={answers[currentQuestion._id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                        placeholder="Type your answer here..."
                                        rows={4}
                                    />
                                )}
                            </div>
                            <div style={{marginBottom: '32px'}}>
                                {currentQuestion.questionType === 'multiple-choice' && (
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                        {currentQuestion.options.map((option, index) => (
                                            <label
                                                key={index}
                                                className={`question-option ${answers[currentQuestion._id] === option ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestion._id}`}
                                                    value={option}
                                                    checked={answers[currentQuestion._id] === option}
                                                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.questionType === 'true-false' && (
                                    <div style={{display: 'flex', gap: '16px'}}>
                                        <label
                                            className={`question-option ${answers[currentQuestion._id] === 'true' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion._id}`}
                                                value="true"
                                                checked={answers[currentQuestion._id] === 'true'}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                            />
                                            <span>True</span>
                                        </label>
                                        <label
                                            className={`question-option ${answers[currentQuestion._id] === 'false' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion._id}`}
                                                value="false"
                                                checked={answers[currentQuestion._id] === 'false'}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                            />
                                            <span>False</span>
                                        </label>
                                    </div>
                                )}

                                {currentQuestion.questionType === 'short-answer' && (
                                    <textarea
                                        className="form-textarea"
                                        value={answers[currentQuestion._id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                        placeholder="Type your answer here..."
                                        rows={4}
                                    />
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="btn btn-secondary"
                                    style={{
                                        opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                        cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronLeft size={20} />
                                    Previous
                                </button>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {currentQuestionIndex === quizData.questions.length - 1 ? (
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={isSubmitting}
                                            className="btn btn-success"
                                            style={{ fontSize: '16px', padding: '12px 24px' }}
                                        >
                                            <CheckCircle size={20} />
                                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={goToNext}
                                            className="btn btn-primary"
                                        >
                                            Next
                                            <ChevronRight size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TakeQuiz