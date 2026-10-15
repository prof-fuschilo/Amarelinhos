#!/usr/bin/env bash
# ==============================================================================
# 🚴 AMARELINHOS CICLISMO - SCRIPT DE SINCRONIZAÇÃO E UPLOAD NO GITHUB
# ==============================================================================
# Este script prepara e envia todo o código-fonte e scripts para o GitHub:
# - Inicializa repositório Git local caso necessário
# - Configura o branch padrão 'main'
# - Adiciona todos os arquivos do sistema (respeitando .gitignore)
# - Cria commit estruturado
# - Vincula o repositório remoto informado pelo usuário
# - Envia os commits para o GitHub (git push)
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}===================================================================${NC}"
echo -e "${YELLOW}   🚴 SINCRONIZAÇÃO DO PROJETO COM O GITHUB                       ${NC}"
echo -e "${YELLOW}===================================================================${NC}"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# 1. Verificar se o Git está instalado
if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ Git não encontrado no sistema. Instale com: sudo apt install git${NC}"
  exit 1
fi

# 2. Inicializar repositório Git se necessário
if [ ! -d ".git" ]; then
  echo -e "${BLUE}▶ Inicializando repositório Git local...${NC}"
  git init -b main
  echo -e "${GREEN}✓ Repositório Git inicializado no branch 'main'!${NC}"
fi

# 3. Configurar usuário Git se não configurado
if [ -z "$(git config user.name)" ]; then
  echo -e "${BLUE}▶ Configurando identidade do Git...${NC}"
  git config user.name "Amarelinhos Ciclismo"
  git config user.email "fuschilo@gmail.com"
fi

# 4. Adicionar arquivos e criar commit
echo -e "${BLUE}▶ Adicionando arquivos do projeto...${NC}"
git add .

COMMIT_MSG="feat: Sistema Amarelinhos Ciclismo completo (Loja, Classificados, Pedidos PIX, Produção e Scripts)"
if git diff --cached --quiet; then
  echo -e "${YELLOW}ℹ Nenhuma alteração pendente para commit.${NC}"
else
  git commit -m "$COMMIT_MSG"
  echo -e "${GREEN}✓ Commit criado com sucesso: \"$COMMIT_MSG\"${NC}"
fi

# 5. Configurar Remote do GitHub
echo ""
echo -e "${YELLOW}Para enviar para o seu repositório no GitHub:${NC}"
echo -e "1. Crie um novo repositório vazio no GitHub (ex: https://github.com/fuschilo/amarelinhos-ciclismo)"
echo -e "2. Execute o comando abaixo no terminal do servidor ou localmente:"
echo ""
echo -e "${BLUE}   git remote add origin https://github.com/SEU_USUARIO/amarelinhos-ciclismo.git${NC}"
echo -e "${BLUE}   git branch -M main${NC}"
echo -e "${BLUE}   git push -u origin main${NC}"
echo ""

# Se foi passado um argumento com a URL do repositório remoto:
if [ -n "$1" ]; then
  REMOTE_URL="$1"
  echo -e "${BLUE}▶ Configurando remote origin: ${REMOTE_URL}...${NC}"
  if git remote | grep -q "origin"; then
    git remote set-url origin "$REMOTE_URL"
  else
    git remote add origin "$REMOTE_URL"
  fi
  echo -e "${BLUE}▶ Enviando branch main para o GitHub...${NC}"
  git push -u origin main
  echo -e "${GREEN}✓ Código enviado com sucesso para o GitHub!${NC}"
fi

echo -e "${YELLOW}===================================================================${NC}"
