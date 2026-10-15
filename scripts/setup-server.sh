#!/usr/bin/env bash
# ==============================================================================
# 🚴 AMARELINHOS CICLISMO - SCRIPT DE PROVISIONAMENTO DO SERVIDOR (UBUNTU/DEBIAN)
# ==============================================================================
# Este script automatiza 100% da preparação do servidor VPS para produção:
# - Atualização de segurança do sistema operacional
# - Instalação do Node.js 20 LTS oficial (NodeSource)
# - Instalação e configuração do Gerenciador de Processos PM2
# - Instalação e configuração do Servidor Web Nginx
# - Configuração do Firewall UFW (SSH, HTTP, HTTPS)
# - Instalação do Certbot para emissão de Certificado SSL/HTTPS (Let's Encrypt)
# - Criação da estrutura de diretórios e permissões em /var/www/amarelinhos
# ==============================================================================

set -e

# Cores para logs formatados
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===================================================================${NC}"
echo -e "${YELLOW}   🚴 AMARELINHOS - INSTALAÇÃO DO SERVIDOR WEB EM PRODUÇÃO       ${NC}"
echo -e "${YELLOW}===================================================================${NC}"

# 1. Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Por favor, execute este script como root ou usando sudo:${NC}"
  echo -e "   sudo bash $0"
  exit 1
fi

echo -e "${BLUE}▶ [1/7] Atualizando repositórios e pacotes do sistema...${NC}"
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git unzip zip ufw htop build-essential software-properties-common

echo -e "${GREEN}✓ Sistema operacional atualizado com sucesso!${NC}"

# 2. Instalar Node.js 20 LTS
echo -e "${BLUE}▶ [2/7] Instalando Node.js 20 LTS e ferramentas de compilação...${NC}"
if ! command -v node &> /dev/null || [[ $(node -v) != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo -e "${GREEN}✓ Node.js $(node -v) e NPM $(npm -v) prontos!${NC}"

# 3. Instalar PM2 globalmente
echo -e "${BLUE}▶ [3/7] Instalando PM2 Process Manager...${NC}"
npm install -g pm2

# Configurar PM2 para inicializar no boot do sistema
pm2 startup systemd -u root --hp /root || true

echo -e "${GREEN}✓ PM2 configurado para auto-restart!${NC}"

# 4. Instalar Nginx e Certbot
echo -e "${BLUE}▶ [4/7] Instalando Nginx e Certbot (Let's Encrypt)...${NC}"
apt-get install -y nginx certbot python3-certbot-nginx

# Habilitar Nginx no boot
systemctl enable nginx
systemctl start nginx

echo -e "${GREEN}✓ Nginx e Certbot instalados com sucesso!${NC}"

# 5. Configurar Firewall UFW
echo -e "${BLUE}▶ [5/7] Configurando regras de Firewall (UFW)...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo -e "${GREEN}✓ Firewall ativo protegendo as portas 22, 80 e 443!${NC}"

# 6. Criar estrutura de diretórios
echo -e "${BLUE}▶ [6/7] Criando diretório da aplicação em /var/www/amarelinhos...${NC}"
mkdir -p /var/www/amarelinhos
mkdir -p /var/log/amarelinhos
mkdir -p /var/backups/amarelinhos

chown -R www-data:www-data /var/www/amarelinhos || true
chmod -R 755 /var/www/amarelinhos

echo -e "${GREEN}✓ Estrutura de pastas pronta em /var/www/amarelinhos!${NC}"

# 7. Resumo e Próximos Passos
echo -e "${YELLOW}===================================================================${NC}"
echo -e "${GREEN}🎉 SERVIDOR WEB PROVISIONADO COM SUCESSO!                          ${NC}"
echo -e "${YELLOW}===================================================================${NC}"
echo -e "Próximos passos para subir a aplicação:"
echo -e " 1. Copie os arquivos do projeto para: ${BLUE}/var/www/amarelinhos${NC}"
echo -e " 2. Execute o script de deploy:        ${BLUE}cd /var/www/amarelinhos && bash scripts/deploy.sh${NC}"
echo -e " 3. Emita o certificado SSL HTTPS:     ${BLUE}sudo certbot --nginx -d seudominio.com.br${NC}"
echo -e "${YELLOW}===================================================================${NC}"
