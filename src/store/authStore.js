import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isLoading: false,

            login: async (credentials) => {
                set({ isLoading: true })
                try {
                    const response = await api.post('/auth/login', credentials)
                    const { token } = response.data

                    const payload = JSON.parse(atob(token.split('.')[1]))

                    set({
                        token,
                        user: payload.user,
                        isLoading: false
                    })

                    return { success: true }
                } catch (error) {
                    set({ isLoading: false })
                    return {
                        success: false,
                        error: error.response?.data?.msg || 'Login failed'
                    }
                }
            },
            register: async (userData) => {
                set({ isLoading: true })
                try {
                    const response = await api.post('/auth/register', userData)
                    const { token } = response.data

                    const payload = JSON.parse(atob(token.split('.')[1]))

                    set({
                        token,
                        user: payload.user,
                        isLoading: false
                    })

                    return { success: true }
                } catch (error) {
                    set({ isLoading: false })
                    return {
                        success: false,
                        error: error.response?.data?.msg || 'Registration failed'
                    }
                }
            },

            logout: () => {
                set({ token: null, user: null })
            }
        }),
        {
            name: 'auth-storage',
        }
    )
)

