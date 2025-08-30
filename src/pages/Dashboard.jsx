import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import { useQuizStore } from '../store/quizStore.js'
import { BookOpen, Users, FileText, BarChart3, Clock, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const Dashboard = () => {
    const { user } = useAuthStore()
    const { quizzes, assignments, fetchQuizzes, fetchAssignments, isLoading } = useQuizStore()

    useEffect(() => {
        if (user?.role === 'teacher') {
            fetchQuizzes()
        } else {
            fetchAssignments()
        }
    }, [user])

    if (isLoading) return <LoadingSpinner />

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Welcome back, {user?.name}!
                </h1>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>
                    {user?.role === 'teacher' ? 'Manage your quizzes and track student performance' : 'Complete your assignments and track your progress'}
                </p>
            </div>

            {user?.role === 'teacher' ? <TeacherDashboard quizzes={quizzes} /> : <StudentDashboard assignments={assignments} />}
        </div>
    )
}

const TeacherDashboard = ({ quizzes }) => {
    const stats = {
        totalQuizzes: quizzes.length,
        totalQuestions: quizzes.reduce((acc, quiz) => acc + (quiz.questions?.length || 0), 0),
        recentQuizzes: quizzes.slice(0, 3)
    }

    return (
        <>
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <BookOpen size={32} style={{ color: '#3b82f6', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {stats.totalQuizzes}
                    </h3>
                    <p style={{ color: '#6b7280' }}>Total Quizzes</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <FileText size={32} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {stats.totalQuestions}
                    </h3>
                    <p style={{ color: '#6b7280' }}>Total Questions</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <Users size={32} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        Active
                    </h3>
                    <p style={{ color: '#6b7280' }}>Status</p>
                </div>
            </div>

            <div className="grid grid-2">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Quizzes</h2>
                        <Link to="/quizzes" className="btn btn-primary">
                            View All
                        </Link>
                    </div>

                    {stats.recentQuizzes.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stats.recentQuizzes.map((quiz) => (
                                <div key={quiz._id} style={{
                                    padding: '16px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h4 style={{ fontWeight: '500', marginBottom: '4px' }}>{quiz.title}</h4>
                                        <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                            {quiz.questions?.length || 0} questions • {quiz.timeLimit || 'No'} time limit
                                        </p>
                                    </div>
                                    <Link to={`/analytics/${quiz._id}`} className="btn btn-secondary" style={{ fontSize: '14px', padding: '6px 12px' }}>
                                        <BarChart3 size={16} />
                                        Analytics
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                            No quizzes created yet. <Link to="/quiz/create" style={{ color: '#3b82f6' }}>Create your first quiz</Link>
                        </p>
                    )}
                </div>

                <div className="card">
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Quick Actions</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/quiz/create" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                            <BookOpen size={20} />
                            Create New Quiz
                        </Link>

                        <Link to="/questions" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            <FileText size={20} />
                            Manage Questions
                        </Link>

                        <Link to="/quizzes" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            <Users size={20} />
                            View All Quizzes
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

const StudentDashboard = ({ assignments }) => {
    const pendingAssignments = assignments.filter(a => a.status === 'assigned')
    const completedAssignments = assignments.filter(a => a.status === 'completed')
    const overdueAssignments = assignments.filter(a => a.status === 'overdue')

    return (
        <>
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <Clock size={32} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {pendingAssignments.length}
                    </h3>
                    <p style={{ color: '#6b7280' }}>Pending</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <CheckCircle size={32} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {completedAssignments.length}
                    </h3>
                    <p style={{ color: '#6b7280' }}>Completed</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <FileText size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {overdueAssignments.length}
                    </h3>
                    <p style={{ color: '#6b7280' }}>Overdue</p>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Assignments</h2>
                    <Link to="/assignments" className="btn btn-primary">
                        View All
                    </Link>
                </div>

                {assignments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {assignments.slice(0, 5).map((assignment) => (
                            <div key={assignment._id} style={{
                                padding: '16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ fontWeight: '500', marginBottom: '4px' }}>
                                        {assignment.quizId?.title || 'Quiz'}
                                    </h4>
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: assignment.status === 'completed' ? '#d1fae5' :
                          assignment.status === 'overdue' ? '#fee2e2' : '#fef3c7',
                      color: assignment.status === 'completed' ? '#065f46' :
                          assignment.status === 'overdue' ? '#991b1b' : '#92400e'
                  }}>
                    {assignment.status}
                  </span>
                                    {assignment.status === 'assigned' && (
                                        <Link
                                            to={`/take-quiz/${assignment.quizId._id}`}
                                            className="btn btn-primary"
                                            style={{ fontSize: '14px', padding: '6px 12px' }}
                                        >
                                            Start Quiz
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                        No assignments yet.
                    </p>
                )}
            </div>
        </>
    )
}

export default Dashboard