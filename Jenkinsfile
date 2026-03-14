pipeline {
    agent any

    environment {
        VPS_HOST = 'VPS_HOST'
        VPS_USER = 'leo'
        VPS_PASS = '***REDACTED***'
        DOCKER_DIR = '/home/leo/docker'
        FRONTEND_DIR = '/home/leo/docker/kanban/frontend'
        BACKEND_DIR  = '/home/leo/docker/kanban/backend'
        APP_URL = 'https://jaquesprojetos.com.br/kanban'
        REACT_APP_API_URL = 'https://jaquesprojetos.com.br/kanban/api'
        PUBLIC_URL = '/kanban'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📦 Checkout do código...'
                checkout scm
                sh 'ls -la'
            }
        }

        stage('Verificar Ferramentas') {
            steps {
                echo '🔧 Verificando ferramentas necessárias...'
                sh '''
                    echo "=== sshpass ==="
                    if command -v sshpass &> /dev/null; then
                        echo "✅ sshpass: $(sshpass -V 2>&1)"
                    else
                        echo "❌ sshpass não encontrado! Instale: sudo apt-get install -y sshpass"
                        exit 1
                    fi

                    echo "=== rsync ==="
                    if command -v rsync &> /dev/null; then
                        echo "✅ rsync: $(rsync --version | head -1)"
                    else
                        echo "❌ rsync não encontrado! Instale: sudo apt-get install -y rsync"
                        exit 1
                    fi

                    echo "=== node ==="
                    if command -v node &> /dev/null; then
                        echo "✅ node: $(node -v)"
                    else
                        echo "❌ node não encontrado!"
                        exit 1
                    fi

                    echo "=== npm ==="
                    echo "✅ npm: $(npm -v)"
                '''
            }
        }

        stage('Testar Conexão VPS') {
            steps {
                echo '🔌 Testando conexão com VPS...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                        "echo 'Conexão SSH OK!' && hostname && docker ps --format '{{.Names}}' | sort"
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo '⚛️  Buildando React app...'
                sh '''
                    npm install --legacy-peer-deps
                    REACT_APP_API_URL="${REACT_APP_API_URL}" PUBLIC_URL="${PUBLIC_URL}" npm run build
                    echo "✅ Build concluído!"
                    ls -lah build/
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo '🎨 Enviando frontend para VPS...'
                sh '''
                    rsync -az --delete \
                        -e "sshpass -p ${VPS_PASS} ssh -o StrictHostKeyChecking=no" \
                        build/ \
                        ${VPS_USER}@${VPS_HOST}:${FRONTEND_DIR}/
                    echo "✅ Frontend sincronizado!"
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                echo '⚙️  Enviando backend para VPS...'
                sh '''
                    rsync -az --delete \
                        --exclude="node_modules" \
                        --exclude=".env" \
                        --exclude=".env.docker" \
                        -e "sshpass -p ${VPS_PASS} ssh -o StrictHostKeyChecking=no" \
                        server/ \
                        ${VPS_USER}@${VPS_HOST}:${BACKEND_DIR}/
                    echo "✅ Backend sincronizado!"
                '''
            }
        }

        stage('Instalar Dependências no VPS') {
            steps {
                echo '📚 Instalando dependências no VPS...'
                sh '''
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
                        cd ${BACKEND_DIR}
                        npm install
                        echo '✅ Dependências instaladas!'
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
                    sleep 15

                    echo "=== Logs do backend (últimas 10 linhas) ==="
                    sshpass -p "${VPS_PASS}" ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                        "docker logs kanban-backend --tail 10"

                    echo ""
                    echo "=== Testando frontend via HTTPS ==="
                    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
                        -u "leo:***REDACTED***" "${APP_URL}")
                    if [ "$HTTP_CODE" = "200" ]; then
                        echo "✅ Frontend OK (HTTP $HTTP_CODE)"
                    else
                        echo "❌ Frontend retornou HTTP $HTTP_CODE"
                        exit 1
                    fi

                    echo ""
                    echo "=== Testando API via HTTPS ==="
                    API_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
                        -u "leo:***REDACTED***" "${APP_URL}/api/all")
                    if [ "$API_CODE" = "200" ]; then
                        echo "✅ API OK (HTTP $API_CODE)"
                    else
                        echo "❌ API retornou HTTP $API_CODE"
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deploy concluído com sucesso!"
            echo "🌐 App: ${APP_URL}"
            echo "🔑 Login: leo / ***REDACTED***"
        }
        failure {
            echo '❌ Deploy falhou! Verifique os logs acima.'
        }
        always {
            echo '🏁 Pipeline finalizado.'
        }
    }
}
