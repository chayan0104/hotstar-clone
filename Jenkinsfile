pipeline {
    agent any

    tools {
        jdk 'jdk'
        nodejs 'nodejs'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 25, unit: 'MINUTES')
    }

    environment {
        GIT_REPO = 'https://github.com/chayan0104/hotstar-clone.git'
        GIT_BRANCH = 'main'
        PROJECT_NAME = 'hotstar-clone'
        DOCKER_REPO = 'mechayan97'
       //TAG = "${BUILD_NUMBER}"
        TAG="latest"
        IMAGE_NAME = "${DOCKER_REPO}/${PROJECT_NAME}:${TAG}"
        APP_PORT = '3000'
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Git Pull') {
            steps {
                git branch: "${GIT_BRANCH}",
                credentialsId: 'github-token',
                url: "${GIT_REPO}"
            }
        }
        stage('Node install and Build') {
            steps {
                sh '''
                npm ci
                npm run build
                '''
            }
        }
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectName=$PROJECT_NAME \
                    -Dsonar.projectKey=$PROJECT_NAME
                    '''
                }
            }
        }
        stage("Quality Gate") {
            steps {
                script {
                    timeout(time: 2, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: false
                    }
                }
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
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    timeout(time: 2, unit: 'MINUTES') {
                    sh '''
                    trivy fs . \
                    --severity HIGH,CRITICAL \
                    --format table \
                    --exit-code 0 \
                    --no-progress \
                    -o trivyfs.txt

                    echo "Report saved at: ${WORKSPACE}/trivyfs.txt"
                    '''
                     }
                }
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build --pull -t ${IMAGE_NAME} .'
            }
        }
        stage('Trivy Image Scan') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    timeout(time: 2, unit: 'MINUTES') {
                    sh '''
                    trivy image ${IMAGE_NAME} \
                    --severity HIGH,CRITICAL \
                    --format table \
                    --exit-code 0 \
                    --no-progress \
                    -o trivyimage.txt

                    echo "Report saved at: ${WORKSPACE}/trivyimage.txt"
                    '''
                    }
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker') {
                        sh '''
                        docker push ${IMAGE_NAME}
                        docker tag ${IMAGE_NAME} ${DOCKER_REPO}/${PROJECT_NAME}:${BUILD_NUMBER}
                        docker push ${DOCKER_REPO}/${PROJECT_NAME}:${BUILD_NUMBER}
                        '''
                    }
                }
            }
        }
        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f ${PROJECT_NAME} || true
                docker run -d --restart unless-stopped -p ${APP_PORT}:${APP_PORT} --name ${PROJECT_NAME} ${IMAGE_NAME}
                sleep 10
                if command -v curl >/dev/null 2>&1; then
                    curl --fail --silent http://127.0.0.1: > /dev/null
                else
                    wget -qO- http://127.0.0.1: > /dev/null
                fi

                echo "Container ${PROJECT_NAME} deployed and running on port $HOSTNAME:${APP_PORT}"
                '''
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'trivyfs.txt,trivyimage.txt', allowEmptyArchive: true
            emailext(
                subject: "PIPELINE: ${currentBuild.currentResult}",
                body: """
                Project: ${PROJECT_NAME}
                Build Number: ${BUILD_NUMBER}
                Status: ${currentBuild.currentResult}
                Build URL: ${BUILD_URL}
                """,
                to: 'chayansamanta8@gmail.com',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
            )
        }
    }
}


