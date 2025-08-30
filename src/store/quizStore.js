import { create } from 'zustand';
import api from '../services/api'

export const useQuizStore = create((set, get) => ({
    questions: [],
    quizzes: [],
    assignments: [],
    currentQuiz: null,
    isLoading: false,

    fetchQuestions: async () => {
        set({ isLoading: true })
        try {
            const response = await api.get('/questions')
            set({ questions: response.data, isLoading: false })
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    createQuestion: async (questionData) => {
        try {
            const response = await api.post('/questions', questionData)
            set((state) => ({
                questions: [...state.questions, response.data]
            }))
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Failed to create question'
            }
        }
    },

    uploadQuestions: async (formData) => {
        try {
            const response = await api.post('/questions/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            get().fetchQuestions()
            return { success: true, message: response.data.msg }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Failed to upload questions'
            }
        }
    },

    deleteQuestion: async (questionId) => {
        try {
            await api.delete(`/questions/${questionId}`)
            set((state) => ({
                questions: state.questions.filter(q => q._id !== questionId)
            }))
            return { success: true }
        } catch (error) {
            return { success: false, error: 'Failed to delete question' }
        }
    },

    fetchQuizzes: async () => {
        set({ isLoading: true })
        try {
            const response = await api.get('/quizzes')
            set({ quizzes: response.data, isLoading: false })
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    createQuiz: async (quizData) => {
        try {
            const response = await api.post('/quizzes', quizData)
            set((state) => ({
                quizzes: [...state.quizzes, response.data]
            }))
            return { success: true, quiz: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Failed to create quiz'
            }
        }
    },

    fetchQuizById: async (quizId) => {
        set({ isLoading: true })
        try {
            const response = await api.get(`/quizzes/${quizId}`)
            set({ currentQuiz: response.data, isLoading: false })
            return response.data
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    deleteQuiz: async (quizId) => {
        try {
            await api.delete(`/quizzes/${quizId}`)
            set((state) => ({
                quizzes: state.quizzes.filter(q => q._id !== quizId)
            }))
            return { success: true }
        } catch (error) {
            return { success: false, error: 'Failed to delete quiz' }
        }
    },

    fetchAssignments: async () => {
        set({ isLoading: true })
        try {
            const response = await api.get('/assignments/student')
            set({ assignments: response.data, isLoading: false })
        } catch (error) {
            set({ isLoading: false })
            throw error
        }
    },

    assignQuiz: async (quizId, assignmentData) => {
        try {
            const response = await api.post(`/assignments/quiz/${quizId}/assign`, assignmentData)
            return { success: true, message: response.data.msg }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Failed to assign quiz'
            }
        }
    },
    startQuizSession: async (quizId) => {
        try {
            const response = await api.get(`/session/start/${quizId}`)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Failed to start quiz session'
            }
        }
    },

    submitQuiz: async (quizId, submissionData) => {
        try {
            const response = await api.post(`/submissions/quiz/${quizId}/submit`, submissionData)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Failed to submit quiz'
            }
        }
    }
}))





