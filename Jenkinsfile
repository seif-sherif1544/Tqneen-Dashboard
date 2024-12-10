pipeline {
    agent any

    stages {
        stage('Docker Build') {
            steps {
                script {
                    echo "hello world"
                    def commitID = env.GIT_COMMIT
                    echo "your commit  id is ${commitID}"
                    sh "docker stop \$(docker ps -a -q) || true"
                    sh "docker rm \$(docker ps -a -q) || true"
                    sh "docker rmi -f \$(docker images -aq) || true"
                    sh "docker build -t ssherif/new-repo:${commitID} ."
                }
            }
        }
        
        stage('Push TO DOCKER HUB') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockercred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                        sh "docker push ssherif/new-repo:${env.GIT_COMMIT}"
                    }
                }
            }
        }
        
        stage('STOP AND START CONTAINER') {
            steps {
                script{
                    sh "docker stop my-website || true"
                    sh "docker rm my-website || true"
                    sh "docker run -d -p 5000:8080 --name my-website ssherif/new-repo:${env.GIT_COMMIT}"
                    sh "sleep 20s"
                    sh "curl localhost:5000"
                }
            }
        } 
    }
}
