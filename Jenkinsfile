pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8.4'
        jdk 'JDK 17'
        nodejs 'Node 16'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend Build') {
            steps {
                dir('order-api') {
                    sh 'mvn clean package'
                }
            }
        }
        
        stage('Frontend Build') {
            steps {
                dir('order-ui') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.build("order-api", "./order-api")
                    docker.build("order-ui", "./order-ui")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
} 