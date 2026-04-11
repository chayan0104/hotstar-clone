pipeline {
    agent any

    tools {
        jdk 'jdk'
        nodejs 'nodejs'
    }

    environment {
        // Application configuration
        GIT_REPO = 'https://github.com/chayan0104/hotstar-clone.git'
        GIT_BRANCH = 'main'
        PROJECT_NAME = 'sample-app'
        IMAGE_NAME = 'mydockerhub/sample-app:latest'
        APP_PORT = '3000'

        // Tools
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: "${GIT_BRANCH}",
                credentialsId: 'github-token',
                url: "${GIT_REPO}"
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh """
                    $SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectName=${PROJECT_NAME} \
                    -Dsonar.projectKey=${PROJECT_NAME}
                    """
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install || true'
            }
        }

        stage('OWASP Dependency Scan') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit',
                odcInstallation: 'dependency-check'

                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                trivy fs . \
                --severity HIGH,CRITICAL \
                --exit-code 1 \
                --format table \
                -o trivyfs.txt
                '''
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker') {
                        sh """
                        docker build -t ${IMAGE_NAME} .
                        docker push ${IMAGE_NAME}
                        """
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh """
                trivy image ${IMAGE_NAME} \
                --severity HIGH,CRITICAL \
                --exit-code 1 \
                --format table \
                -o trivyimage.txt
                """
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                docker rm -f ${PROJECT_NAME} || true
                docker run -d -p ${APP_PORT}:${APP_PORT} --name ${PROJECT_NAME} ${IMAGE_NAME}
                """
            }
        }
    }

    post {
        always {
            emailext(
                subject: "PIPELINE: ${currentBuild.currentResult}",
                body: """
                Project: ${PROJECT_NAME}

                Build Number: ${env.BUILD_NUMBER}

                Status: ${currentBuild.currentResult}

                Build URL: ${env.BUILD_URL}
                """,
                to: 'chayansamanta8@gmail.com',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
            )
        }
    }
}
