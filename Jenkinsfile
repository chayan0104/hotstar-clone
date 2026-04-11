pipeline {
    agent any

    tools {
        jdk 'jdk'
        nodejs 'nodejs'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        IMAGE_NAME = "mechayan97/hotstar:latest"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                credentialsId: 'github-token',
                url: 'https://github.com/chayan0104/hotstar-clone.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh """
                    $SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectName=Hotstar \
                    -Dsonar.projectKey=Hotstar
                    """
                }
            }
        }

      //  stage('Quality Gate') {
      //      steps {
      //          waitForQualityGate abortPipeline: false, credentialsId: 'Sonar'
      //      }
      //  }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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
                sh 'trivy fs . > trivyfs.txt'
            }
        }

      stage('Docker Build & Push') {
    steps {
        script {
            withDockerRegistry(credentialsId: 'docker') {
                sh '''
                docker build -t hotstar .
                docker tag hotstar mechayan97/hotstar:latest
                docker push mechayan97/hotstar:latest
                '''
            }
        }
    }
}

        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image $IMAGE_NAME > trivyimage.txt'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f hotstar || true
                docker run -d -p 3000:3000 --name hotstar $IMAGE_NAME
                '''
            }
        }
    }

    post {
        always {
            emailext(
                subject: "HOTSTAR PIPELINE: ${currentBuild.currentResult}",
                body: """
                Project: ${env.JOB_NAME}

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
