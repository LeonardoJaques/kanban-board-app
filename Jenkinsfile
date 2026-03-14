pipeline {
    agent any

    environment {
        VPS_HOST = 'VPS_HOST'
        VPS_USER = 'leo'
        VPS_PASS = '***REDACTED***'
        DOCKER_DIR   = '/home/leo/docker'
        BUILD_DIR    = '/home/leo/kanban-build'
        FRONTEND_DIR = '/home/leo/docker/kanban/frontend'
        BACKEND_DIR  = '/home/leo/docker/kanban/backend'
        APP_URL = 'https://jaquesprojetos.com.br/kanban'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📦 Checkout do código...'
                checkout scm
            }
        }

        stage('Verificar Ferramentas') {
            steps {
                echo '🔧 Verificando ferramentas necessárias...'
                sh '''
                    for tool in sshpass rsync; do
                        if command -v $tool &>/dev/null; then
                            echo "✅ $tool encontrado"
                        else
                            echo "❌ $tool não encontrado!"
                            exit 1
                        fi
                    done
                '''
            }
        }

        stage('Testar Conexão VPS') {
            steps {
                echo '🔌 Testando conexão com VPS...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                        "echo 'Conexão OK' && node -v && npm -v"
                '''
            }
        }

        stage('Enviar Código para VPS') {
            steps {
                echo '📤 Sincronizando código-fonte para VPS...'
                sh '''
                    # Envia o código-fonte (sem node_modules) para um dir temporário de build no VPS
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                        "mkdir -p ${BUILD_DIR}"

                    rsync -az --delete \
                        --exclude="node_modules" \
                        --exclude="build" \
                        --exclude=".git" \
                        -e "sshpass -p ${VPS_PASS} ssh -o StrictHostKeyChecking=no" \
                        ./ \
                        ${VPS_USER}@${VPS_HOST}:${BUILD_DIR}/

                    echo "✅ Código enviado!"
                '''
            }
        }

        stage('Build Frontend no VPS') {
            steps {
                echo '⚛️  Buildando React no VPS...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
                        cd ${BUILD_DIR}
                        npm install --legacy-peer-deps
                        REACT_APP_API_URL=https://jaquesprojetos.com.br/kanban/api \\
                        PUBLIC_URL=/kanban \\
                        npm run build
                        echo '✅ Build concluído!'
                        ls -lah build/
                    "
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo '🎨 Publicando frontend...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
                        rsync -az --delete ${BUILD_DIR}/build/ ${FRONTEND_DIR}/
                        echo '✅ Frontend publicado!'
                    "
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                echo '⚙️  Publicando backend...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
                        rsync -az --delete \
                            --exclude=node_modules \
                            --exclude=.env \
                            --exclude=.env.docker \
                            ${BUILD_DIR}/server/ ${BACKEND_DIR}/

                        cd ${BACKEND_DIR}
                        npm install
                        echo '✅ Backend publicado!'
                    "
                '''
            }
        }

        stage('Restart Containers') {
            steps {
                echo '🔄 Reiniciando containers Docker...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
                        cd ${DOCKER_DIR}
                        docker compose restart kanban-backend kanban-frontend
                        echo '✅ Containers reiniciados!'
                        docker ps --filter name=kanban --format 'table {{.Names}}\t{{.Status}}'
                    "
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Verificando saúde da aplicação...'
                sh '''
                    echo "Aguardando containers iniciarem..."
                    sleep 20

                    echo "=== Logs do backend ==="
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                        "docker logs kanban-backend --tail 5"

                    echo ""
                    echo "=== Frontend ==="
                    HTTP=$(curl -s -o /dev/null -w "%{http_code}" -u "leo:***REDACTED***" "${APP_URL}")
                    [ "$HTTP" = "200" ] && echo "✅ Frontend OK (HTTP $HTTP)" || { echo "❌ Frontend HTTP $HTTP"; exit 1; }

                    echo "=== API ==="
                    API=$(curl -s -o /dev/null -w "%{http_code}" -u "leo:***REDACTED***" "${APP_URL}/api/all")
                    [ "$API" = "200" ] && echo "✅ API OK (HTTP $API)" || { echo "❌ API HTTP $API"; exit 1; }
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deploy concluído com sucesso!"
            echo "🌐 ${APP_URL}"
        }
        failure {
            echo '❌ Deploy falhou! Verifique os logs acima.'
        }
        always {
            echo '🏁 Pipeline finalizado.'
        }
    }
}
