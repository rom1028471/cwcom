const prod = {
  url: {
    API_BASE_URL: 'https://myapp.herokuapp.com',
  }
}

const dev = {
  url: {
    API_BASE_URL: 'http://localhost:8080'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : 'https://myapp.herokuapp.com/api'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PUBLICATIONS: '/publications',
  MY_SUBSCRIPTIONS: '/my-subscriptions'
}

export const ROLES = {
  USER: 'USER'
}