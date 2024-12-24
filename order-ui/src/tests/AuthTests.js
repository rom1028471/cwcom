import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { userApi } from '../api/api'

// Мокаем API-вызовы
jest.mock('../api/api', () => ({
  userApi: {
    login: jest.fn(),
    signup: jest.fn()
  }
}))

describe('Authentication Tests', () => {
  // Тест на логин
  test('Successful Login', async () => {
    // Подготовка мока для успешного логина
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

    // Заполнение формы
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })

    // Клик по кнопке входа
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // Проверка вызова API
    await waitFor(() => {
      expect(userApi.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
    })
  })

  // Тест на неудачный логин
  test('Failed Login', async () => {
    // Подготовка мока для неудачного логина
    userApi.login.mockRejectedValue(new Error('Invalid credentials'))

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    // Заполнение формы
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    })

    // Клик по кнопке входа
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // Проверка отображения ошибки
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  // Тест на регистрацию
  test('Successful Signup', async () => {
    // Подготовка мока для успешной регистрации
    userApi.signup.mockResolvedValue({
      id: 1,
      username: 'newuser',
      email: 'newuser@example.com'
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </BrowserRouter>
    )

    // Заполнение формы регистрации
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newuser' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'newuser@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    })

    // Клик по кнопке регистрации
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    // Проверка вызова API
    await waitFor(() => {
      expect(userApi.signup).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      })
    })

    // Проверка перенаправления или сообщения об успехе
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
  })

  // Тест на неудачную регистрацию
  test('Failed Signup', async () => {
    // Подготовка мока для неудачной регистрации
    userApi.signup.mockRejectedValue(new Error('Username already exists'))

    render(
      <BrowserRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </BrowserRouter>
    )

    // Заполнение формы регистрации
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'existinguser' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existinguser@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    })

    // Клик по кнопке регистрации
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    // Проверка отображения ошибки
    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument()
    })
  })
})
