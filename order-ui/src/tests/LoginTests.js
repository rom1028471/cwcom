import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from '../components/Login'
import { userApi } from '../misc/OrderApi'

// Мокаем API и AuthContext
jest.mock('../misc/OrderApi', () => ({
  userApi: {
    login: jest.fn()
  }
}))

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    login: jest.fn()
  })
}))

describe('Login Component', () => {
  // Подготовка перед каждым тестом
  beforeEach(() => {
    userApi.login.mockClear()
  })

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    // Проверяем наличие основных элементов формы
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('allows entering username and password', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(usernameInput.value).toBe('testuser')
    expect(passwordInput.value).toBe('password123')
  })

  test('submits form with valid credentials', async () => {
    // Мокаем успешный ответ от API
    userApi.login.mockResolvedValue({
      token: 'fake_jwt_token',
      username: 'testuser'
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    // Проверяем вызов метода login
    await waitFor(() => {
      expect(userApi.login).toHaveBeenCalledWith({
        username: 'testuser', 
        password: 'password123'
      })
    })
  })

  test('shows error for invalid credentials', async () => {
    // Мокаем ошибку от API
    userApi.login.mockRejectedValue(new Error('Invalid credentials'))

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(loginButton)

    // Проверяем отображение ошибки
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  test('disables login button during submission', async () => {
    userApi.login.mockResolvedValue({
      token: 'fake_jwt_token',
      username: 'testuser'
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    // Проверяем, что кнопка становится disabled во время загрузки
    expect(loginButton).toBeDisabled()
  })
})
