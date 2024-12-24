import React from 'react'
import { render, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

// Мок для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Компонент для тестирования хука useAuth
const TestComponent = () => {
  const authContext = useAuth()
  return <div data-testid="auth-context">{JSON.stringify(authContext)}</div>
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
  })

  test('initial state is unauthenticated', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const contextValue = JSON.parse(getByTestId('auth-context').textContent)
    expect(contextValue.isAuthenticated).toBe(false)
    expect(contextValue.user).toBeNull()
  })

  test('loading state is managed correctly', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const contextValue = JSON.parse(getByTestId('auth-context').textContent)
    expect(contextValue.loading).toBe(false)
  })

  test('admin role detection works', () => {
    // Simulate a user with ADMIN role
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token-with-admin-role'
    })

    const MockJwtDecode = jest.fn().mockReturnValue({
      username: 'admin_user',
      roles: ['ADMIN']
    })

    const originalJwtDecode = require('jwt-decode')
    jest.mock('jwt-decode', () => MockJwtDecode)

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const contextValue = JSON.parse(getByTestId('auth-context').textContent)
    expect(contextValue.isAdmin).toBe(true)
    expect(contextValue.user.username).toBe('admin_user')

    // Restore original jwt-decode
    jest.mock('jwt-decode', () => originalJwtDecode)
  })

  test('non-admin user role detection works', () => {
    // Simulate a user without ADMIN role
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token-with-user-role'
    })

    const MockJwtDecode = jest.fn().mockReturnValue({
      username: 'regular_user',
      roles: ['USER']
    })

    const originalJwtDecode = require('jwt-decode')
    jest.mock('jwt-decode', () => MockJwtDecode)

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const contextValue = JSON.parse(getByTestId('auth-context').textContent)
    expect(contextValue.isAdmin).toBe(false)
    expect(contextValue.user.username).toBe('regular_user')

    // Restore original jwt-decode
    jest.mock('jwt-decode', () => originalJwtDecode)
  })
})
