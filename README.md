# 🚴 Amarelinhos Ciclismo — Sistema de Gestão de Encomendas & Uniformes

[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Production_Ready-009639.svg)](https://nginx.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ed.svg)](https://www.docker.com/)

Sistema web completo para gestão do grupo de ciclismo **Amarelinhos**, incluindo catálogo interativo de peças, fluxo de encomendas personalizadas com apelido e tipo sanguíneo, gestão de pagamentos, exportação para Excel (XLSX), controle administrativo e infraestrutura automatizada para servidor web em produção.

---

## 📌 Funcionalidades Principais

- **Catálogo de Uniformes**: Macaquinhos, camisas manga curta/longa, bretelles, bermudas, corta-ventos e coletes em tecido de alta performance.
- **Fluxo de Encomendas e Pagamentos**:
  - **Pendente**: Pedidos aguardando confirmação ou pagamento.
  - **Pago**: Status limpo e direto para itens prontos para o lote de confecção.
  - **Enviado**: Visualização compacta com rastreamento e data de despacho.
  - **Entregue**: Histórico organizado e simplificado para consulta rápida.
- **Exportação para Excel (.xlsx)**:
  - Exportação direta de pedidos **Pendentes** e **Pagos** para planilhas Excel formatadas (moeda BRL, status e dados de contato).
- **Painel Administrativo Completo**:
  - Gestão de pedidos, alteração de status em lote ou individual, controle de estoque e valores.
  - Aba de **Produção & Deploy** com scripts interativos, comandos prontos e rotinas de backup.
- **Backups e Sincronização**:
  - Exportação para gravação no **Google Drive**.
  - Repositório sincronizado no **GitHub**: [github.com/prof-fuschilo/Amarelinhos](https://github.com/prof-fuschilo/Amarelinhos).

---

## 🚀 Passo a Passo para Colocar em Produção no Servidor Web

Você pode implantar a aplicação em qualquer servidor VPS (DigitalOcean, AWS, Google Cloud, Hetzner, Hostinger, Linode, etc.) rodando Ubuntu 22.04 ou 24.04 LTS.

---

### Método 1: Deploy com Nginx + PM2 + Node 20 (Recomendado)

#### 1. Conectar ao Servidor via SSH e Clonar o Repositório
```bash
# Conectar à sua VPS
ssh root@SEU_IP_DO_SERVIDOR

# Criar o diretório de produção e clonar o projeto
mkdir -p /var/www
cd /var/www
git clone https://github.com/prof-fuschilo/Amarelinhos.git amarelinhos
cd /var/www/amarelinhos
```

#### 2. Executar o Script de Preparação Automática
O script `setup-server.sh` instala automaticamente o Node.js 20 LTS, Nginx, PM2, Certbot (SSL), Git e configura o firewall:
```bash
sudo bash scripts/setup-server.sh
```

#### 3. Executar o Deploy da Aplicação
O script `deploy.sh` instala dependências limpas, compila o frontend React, o servidor Express e inicia o processo via PM2 com reinício automático:
```bash
sudo bash scripts/deploy.sh
```

#### 4. Configurar o Domínio no Nginx e Ativar SSL HTTPS Gratuito
1. Aponte o registro DNS **Tipo A** do seu domínio (ex: `amarelinhos.com.br`) para o IP da VPS.
2. Ative a configuração do Nginx fornecida no repositório:
```bash
sudo cp /var/www/amarelinhos/nginx.conf /etc/nginx/sites-available/amarelinhos
sudo ln -s /etc/nginx/sites-available/amarelinhos /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```
3. Emita o certificado SSL gratuito com renovação automática:
```bash
sudo certbot --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br
```

---

### Método 2: Deploy Conteinerizado com Docker & Docker Compose

Caso prefira isolamento completo através de contêineres:

```bash
# 1. Clonar o projeto
git clone https://github.com/prof-fuschilo/Amarelinhos.git
cd Amarelinhos

# 2. Subir a aplicação em background com build multi-stage otimizado
docker compose up -d --build

# 3. Conferir se está online e saudável (healthcheck ativo)
docker compose ps
docker compose logs -f
```

A aplicação estará acessível na porta `3000` (ou na porta `80`/`443` configurando o proxy reverso Nginx).

---

## 💾 Rotina de Gravação e Backup no Google Drive

### Opção A: Download Direto pelo Painel Administrativo
1. Acesse o sistema e abra a aba **Admin** (ícone de cadeado / engrenagem).
2. Vá até a seção **🚀 Produção & Deploy**.
3. Clique em **"Gravar no Google Drive"** para baixar o backup estruturado JSON com todos os pedidos, clientes e configurações.
4. Salve o arquivo na sua pasta do Google Drive (`Meu Drive > Amarelinhos Backups`).

### Opção B: Backup Automatizado no Servidor via Script (`scripts/backup-drive.sh`)
Execute o script em linha de comando ou programe no `cron`:
```bash
# Execução manual
bash scripts/backup-drive.sh

# Agendamento diário automático às 03:00 da manhã
crontab -e
# Adicione ao final:
0 3 * * * /bin/bash /var/www/amarelinhos/scripts/backup-drive.sh >> /var/log/amarelinhos-backup.log 2>&1
```

---

## 🛠️ Comandos Úteis de Manutenção no Servidor

| Ação | Comando |
| :--- | :--- |
| **Ver status da aplicação** | `pm2 status` |
| **Ver logs em tempo real** | `pm2 logs amarelinhos-app` |
| **Reiniciar o servidor** | `pm2 restart amarelinhos-app` |
| **Atualizar código do GitHub** | `git pull origin main && sudo bash scripts/deploy.sh` |
| **Ver status do Nginx** | `sudo systemctl status nginx` |
| **Testar integridade da API** | `curl http://localhost:3000/api/health` |

---

## 📁 Estrutura do Repositório

```
Amarelinhos/
├── deploy/                     # Arquivos de CI/CD para GitHub Actions
│   └── github-actions-deploy.yml
├── scripts/                    # Scripts de infraestrutura e automação
│   ├── setup-server.sh         # Instalação completa do servidor VPS
│   ├── deploy.sh               # Deploy com zero downtime e backup
│   ├── backup-drive.sh         # Script de backup para o Google Drive
│   └── github-sync.sh          # Sincronização com o repositório GitHub
├── src/                        # Código-fonte da aplicação React 19
│   ├── components/             # Catálogo, Encomendas, Admin, etc.
│   ├── types.ts                # Definições de tipos TypeScript
│   └── main.tsx                # Entrada React
├── server.ts                   # Servidor Node.js Express para produção
├── ecosystem.config.cjs        # Configuração do gerenciador PM2
├── nginx.conf                  # Configuração do Nginx com cache e proxy
├── Dockerfile                  # Contêiner Alpine Linux multi-stage
├── docker-compose.yml          # Orquestração do contêiner Docker
├── GUIA_PRODUCAO.md            # Guia técnico aprofundado de produção
└── README.md                   # Documentação do projeto e instruções
```

---

## 📄 Licença e Propriedade

Desenvolvido para o **Grupo de Ciclismo Amarelinhos**. Todos os direitos reservados.
Repositório mantido em [github.com/prof-fuschilo/Amarelinhos](https://github.com/prof-fuschilo/Amarelinhos).
