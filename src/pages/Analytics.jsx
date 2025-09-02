import {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {ArrowLeft, BarChart3, TrendingDown, Users} from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Analytics = () => {
    const {quizId} = useParams()
    const [analyticsData, setAnalyticsData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAnalytics()
    }, [quizId])

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true)
            const response = await api.get(`/analytics/quiz/${quizId}/question-performance`)
            setAnalyticsData(response.data)
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch analytics data')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <LoadingSpinner/>

    if (error) {
        return (
            <div className="card">
                <div className="alert alert-error">
                    {error}
                </div>
                <Link to="/quizzes" className="btn btn-primary">
                    <ArrowLeft size={20}/>
                    Back to Quizzes
                </Link>
            </div>
        )
    }

    const overallStats = {
        totalQuestions: analyticsData.length,
        averageCorrectRate: analyticsData.length > 0
            ? (analyticsData.reduce((sum, q) => sum + q.correctPercentage, 0) / analyticsData.length).toFixed(1)
            : 0,
        totalAttempts: analyticsData.reduce((sum, q) => sum + q.totalAttempts, 0),
        difficultQuestions: analyticsData.filter(q => q.correctPercentage < 50).length
    }

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '24px'}}>
                <Link to="/quizzes" className="btn btn-secondary" style={{marginRight: '16px'}}>
                    <ArrowLeft size={20}/>
                    Back
                </Link>
                <h1 style={{fontSize: '28px', fontWeight: 'bold'}}>Quiz Analytics</h1>
            </div>
            <div className="grid grid-2" style={{marginBottom: '32px'}}>
                <div className="grid grid-2">
                    <div className="card" style={{textAlign: 'center'}}>
                        <BarChart3 size={32} style={{color: '#3b82f6', margin: '0 auto 12px'}}/>
                        <h3 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'}}>
                            {overallStats.averageCorrectRate}%
                        </h3>
                        <p style={{color: '#6b7280'}}>Average Correct Rate</p>
                    </div>

                    <div className="card" style={{textAlign: 'center'}}>
                        <Users size={32} style={{color: '#10b981', margin: '0 auto 12px'}}/>
                        <h3 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'}}>
                            {overallStats.totalAttempts}
                        </h3>
                        <p style={{color: '#6b7280'}}>Total Attempts</p>
                    </div>

                    <div className="card" style={{textAlign: 'center'}}>
                        <TrendingDown size={32} style={{color: '#ef4444', margin: '0 auto 12px'}}/>
                        <h3 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'}}>
                            {overallStats.difficultQuestions}
                        </h3>
                        <p style={{color: '#6b7280'}}>Difficult Questions (&lt;50%)</p>
                    </div>

                    <div className="card" style={{textAlign: 'center'}}>
                        <BarChart3 size={32} style={{color: '#f59e0b', margin: '0 auto 12px'}}/>
                        <h3 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'}}>
                            {overallStats.totalQuestions}
                        </h3>
                        <p style={{color: '#6b7280'}}>Total Questions</p>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Performance Summary</h2>

                    <div style={{marginBottom: '20px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                            <span>Excellent (&gt;80%)</span>
                            <span>{analyticsData.filter(q => q.correctPercentage > 80).length} questions</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                            <span>Good (60-80%)</span>
                            <span>{analyticsData.filter(q => q.correctPercentage >= 60 && q.correctPercentage <= 80).length} questions</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                            <span>Average (40-60%)</span>
                            <span>{analyticsData.filter(q => q.correctPercentage >= 40 && q.correctPercentage < 60).length} questions</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Needs Review (&lt;40%)</span>
                            <span>{analyticsData.filter(q => q.correctPercentage < 40).length} questions</span>
                        </div>
                    </div>

                    {overallStats.averageCorrectRate < 60 && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '6px',
                            border: '1px solid #fcd34d'
                        }}>
                            <p style={{fontSize: '14px', color: '#92400e', margin: 0}}>
                                ⚠️ This quiz has a low average correct rate. Consider reviewing the questions that
                                students are struggling with.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="card">
                <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '20px'}}>
                    Question Performance (Sorted by Difficulty)
                </h2>

                {analyticsData.length > 0 ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        {analyticsData.map((question, index) => (
                            <div
                                key={question.questionId}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: question.correctPercentage < 50 ? '#fef2f2' : 'white'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{flex: 1}}>
                                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                      <span style={{fontSize: '14px', color: '#6b7280', marginRight: '8px'}}>
                        Question {index + 1}
                      </span>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: question.correctPercentage >= 70 ? '#d1fae5' :
                                                    question.correctPercentage >= 50 ? '#fef3c7' : '#fee2e2',
                                                color: question.correctPercentage >= 70 ? '#065f46' :
                                                    question.correctPercentage >= 50 ? '#92400e' : '#991b1b'
                                            }}>
                        {question.correctPercentage >= 70 ? 'Easy' :
                            question.correctPercentage >= 50 ? 'Medium' : 'Hard'}
                      </span>
                                        </div>

                                        <h4 style={{fontSize: '16px', fontWeight: '500', marginBottom: '8px'}}>
                                            {question.questionText}
                                        </h4>
                                    </div>

                                    <div style={{textAlign: 'right', minWidth: '120px'}}>
                                        <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'}}>
                                            {question.correctPercentage}%
                                        </div>
                                        <div style={{fontSize: '12px', color: '#6b7280'}}>
                                            {question.correctAttempts}/{question.totalAttempts} correct
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${question.correctPercentage}%`,
                                            backgroundColor: question.correctPercentage >= 70 ? '#10b981' :
                                                question.correctPercentage >= 50 ? '#f59e0b' : '#ef4444',
                                            transition: 'width 0.3s ease'
                                        }}
                                    />
                                </div>

                                {question.correctPercentage < 50 && (
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '8px 12px',
                                        backgroundColor: '#fee2e2',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        color: '#991b1b'
                                    }}>
                                        💡 Consider reviewing this question - students are finding it challenging
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <BarChart3 size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '8px' }}>No data available</h3>
                        <p>Analytics will appear here once students start taking this quiz.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Analytics