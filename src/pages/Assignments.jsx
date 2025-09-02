import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { useAuthStore } from '../store/authStore'
import { Clock, CheckCircle, AlertCircle, Play } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Assignments = () => {
    const { user } = useAuthStore()
    const { assignments, fetchAssignments, isLoading } = useQuizStore()

    useEffect(() => {
        if (user?.role === 'student') {
            fetchAssignments()
        }
    }, [user])

    if (isLoading) return <LoadingSpinner />

    const pendingAssignments = assignments.filter(a => a.status === 'assigned')
    const inProgressAssignments = assignments.filter(a => a.status === 'in-progress')
    const completedAssignments = assignments.filter(a => a.status === 'completed')
    const overdueAssignments = assignments.filter(a => a.status === 'overdue')

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
                My Assignments
            </h1>

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
                    <AlertCircle size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {overdueAssignments.length}
                    </h3>
                    <p style={{ color: '#6b7280' }}>Overdue</p>
                </div>
            </div>

            {pendingAssignments.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#f59e0b' }}>
                        Pending Assignments ({pendingAssignments.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {pendingAssignments.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} />
                        ))}
                    </div>
                </div>
            )}

            {inProgressAssignments.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#3b82f6' }}>
                        In Progress ({inProgressAssignments.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {inProgressAssignments.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} />
                        ))}
                    </div>
                </div>
            )}

            {completedAssignments.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#10b981' }}>
                        Completed ({completedAssignments.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {completedAssignments.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} />
                        ))}
                    </div>
                </div>
            )}

            {overdueAssignments.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#ef4444' }}>
                        Overdue ({overdueAssignments.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {overdueAssignments.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} />
                        ))}
                    </div>
                </div>
            )}

            {assignments.length === 0 && (
                <div className="card">
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '8px' }}>No assignments yet</h3>
                        <p>Your assignments will appear here when teachers assign quizzes to you.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const AssignmentCard = ({ assignment }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' }
            case 'overdue':
                return { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' }
            case 'in-progress':
                return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' }
            default:
                return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' }
        }
    }

    const statusStyle = getStatusColor(assignment.status)
    const dueDate = new Date(assignment.dueDate)
    const isOverdue = dueDate < new Date() && assignment.status !== 'completed'

    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        {assignment.quizId?.title || 'Quiz'}
                    </h4>

                    {assignment.quizId?.description && (
                        <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                            {assignment.quizId.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
            <span>
              <strong>Due:</strong> {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
            </span>
                        {assignment.quizId?.timeLimit && (
                            <span>
                <strong>Time Limit:</strong> {assignment.quizId.timeLimit} minutes
              </span>
                        )}
                    </div>

                    {isOverdue && assignment.status !== 'completed' && (
                        <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>
                            ⚠️ This assignment is overdue
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`
          }}>
            {assignment.status}
          </span>

                    {assignment.status === 'assigned' && (
                        <Link
                            to={`/take-quiz/${assignment.quizId._id}`}
                            className="btn btn-primary"
                            style={{ fontSize: '14px', padding: '8px 16px' }}
                        >
                            <Play size={16} />
                            Start Quiz
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Assignments