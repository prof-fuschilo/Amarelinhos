# 🚴 Guia Completo de Produção, Deploy Web, GitHub e Google Drive
## Plataforma Oficial do Grupo de Ciclismo Amarelinhos

Este documento fornece as instruções passo a passo para colocar a aplicação em produção em qualquer servidor WEB Linux (VPS / Cloud), além de detalhar a sincronização com o **GitHub** e a rotina de gravação/backup no **Google Drive**.

---

## 📋 Sumário
1. [Visão Geral dos Arquivos e Scripts Gerados](#1-visão-geral-dos-arquivos-e-scripts-gerados)
2. [Sincronização e Envio para o GitHub](#2-sincronização-e-envio-para-o-github)
3. [Gravação e Backup no Google Drive](#3-gravação-e-backup-no-google-drive)
4. [Instalação e Deploy no Servidor Web (Ubuntu / Debian VPS)](#4-instalação-e-deploy-no-servidor-web)
5. [Deploy Conteinerizado com Docker](#5-deploy-conteinerizado-com-docker)
6. [Configuração do Nginx com SSL Gratuito (HTTPS)](#6-configuração-do-nginx-com-ssl-gratuito)
7. [Checklist e Comandos Rápidos](#7-checklist-e-comandos-rápidos)

---

## 1. Visão Geral dos Arquivos e Scripts Gerados

| Arquivo / Script | Função no Sistema |
| :--- | :--- |
| `scripts/setup-server.sh` | Script que prepara 100% de um servidor novo (Node 20, Nginx, PM2, UFW, Certbot). |
| `scripts/deploy.sh` | Script de deploy contínuo com zero-downtime, backup automático e health check. |
| `scripts/github-sync.sh` | Script para sincronizar, commitar e enviar (push) o código para o GitHub. |
| `scripts/backup-drive.sh` | Script que gera pacote compactado dos dados para envio ao Google Drive. |
| `ecosystem.config.cjs` | Configuração do PM2 para manter o servidor online 24/7 com reinício automático. |
| `nginx.conf` | Configuração de alta performance do Nginx (Gzip, Cache estático, SSL, Proxy Reverso). |
| `Dockerfile` | Contêiner multi-stage Alpine Linux ultraleve para execução isolada. |
| `docker-compose.yml` | Orquestração do contêiner Docker com inicialização em 1 comando. |
| `.github/workflows/deploy.yml` | Pipeline de Integração Contínua (CI) do GitHub Actions. |
| `server.ts` | Servidor Node.js Express com fallback SPA e endpoint `/api/health`. |

---

## 2. Sincronização e Envio para o GitHub

O repositório Git local já está inicializado no branch principal `main` e o commit inicial foi realizado.

### Como enviar para a sua conta no GitHub:

1. Acesse o seu GitHub ([github.com/new](https://github.com/new)) e crie um novo repositório com o nome desejado (por exemplo: `amarelinhos-ciclismo`). **Deixe desmarcada a opção de inicializar com README**, pois o projeto já está pronto.
2. No terminal do projeto, execute os comandos:

```bash
# Vincular ao seu repositório remoto (substitua pelo seu link do GitHub)
git remote add origin https://github.com/fuschilo/amarelinhos-ciclismo.git

# Garantir o branch main
git branch -M main

# Enviar todos os arquivos e histórico para o GitHub
git push -u origin main
```

> **Dica:** Você também pode rodar o script interativo:
> ```bash
> bash scripts/github-sync.sh https://github.com/fuschilo/amarelinhos-ciclismo.git
> ```

---

## 3. Gravação e Backup no Google Drive

O sistema oferece três métodos para gravação e backup no Google Drive:

### Método A: Download e Gravação via Painel Administrativo Web
1. Acesse a aba **Admin** no menu da aplicação.
2. Vá para a aba **🚀 Produção & Deploy**.
3. Clique em **"Baixar Dados (JSON)"** ou **"Exportar Pacote de Backup"**.
4. O arquivo gerado pode ser salvo ou arrastado diretamente para a sua pasta do Google Drive (`Meu Drive > Backups Amarelinhos`).

### Método B: Script Automatizado no Servidor (`scripts/backup-drive.sh`)
Para servidores Linux que rodam continuamente, o script `scripts/backup-drive.sh` empacota os dados e pode sincronizar automaticamente com o Google Drive via `rclone`:

```bash
# Executar backup agora
bash scripts/backup-drive.sh
```

Para automatizar o backup diário para o Google Drive às 03:00 da manhã via `crontab`:
```bash
crontab -e
# Adicione a linha:
0 3 * * * /bin/bash /var/www/amarelinhos/scripts/backup-drive.sh >> /var/log/amarelinhos/backup.log 2>&1
```

---

## 4. Instalação e Deploy no Servidor Web

### Pré-requisitos Recomendados da VPS:
- Provedores: DigitalOcean, AWS EC2, Hetzner, Linode, Google Cloud Compute Engine ou Hostinger VPS.
- Sistema: Ubuntu 22.04 LTS ou 24.04 LTS (1 vCPU, 1GB RAM mínimos).

### Passo 1: Preparação Automática do Servidor
Conecte-se via SSH no seu servidor e execute:
```bash
# Clone ou transfira os arquivos para o servidor:
git clone https://github.com/fuschilo/amarelinhos-ciclismo.git /var/www/amarelinhos
cd /var/www/amarelinhos

# Execute o script que instala tudo automaticamente:
sudo bash scripts/setup-server.sh
```

### Passo 2: Executar o Deploy da Aplicação
```bash
sudo bash scripts/deploy.sh
```
O script compilará o frontend, o servidor backend e iniciará o serviço no PM2.

### Passo 3: Comandos úteis do PM2
```bash
# Ver status da aplicação
pm2 status

# Ver logs em tempo real
pm2 logs amarelinhos-app

# Reiniciar aplicação
pm2 restart amarelinhos-app
```

---

## 5. Deploy Conteinerizado com Docker

Se preferir rodar via Docker e Docker Compose:

```bash
# 1. Instalar Docker se ainda não tiver:
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# 2. Iniciar a aplicação em background:
docker compose up -d --build

# 3. Verificar status do contêiner e health check:
docker compose ps
```

---

## 6. Configuração do Nginx com SSL Gratuito (HTTPS)

Para disponibilizar o sistema no seu domínio (ex: `amarelinhos.com.br`):

1. Aponte o registro DNS **Tipo A** do seu domínio para o endereço IP do seu servidor.
2. Copie a configuração do Nginx:
```bash
sudo cp /var/www/amarelinhos/nginx.conf /etc/nginx/sites-available/amarelinhos
sudo ln -s /etc/nginx/sites-available/amarelinhos /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```
3. Emita o certificado SSL HTTPS gratuito com renovação automática:
```bash
sudo certbot --nginx -d amarelinhos.com.br -d www.amarelinhos.com.br
```

---

## 7. Checklist e Comandos Rápidos

- [x] Front-end React 19 + Tailwind CSS compilado em `dist/`
- [x] Servidor Node.js Express compilado em `dist/server.js`
- [x] Repositório Git local criado no branch `main` com commit estruturado
- [x] Script de provisionamento do servidor (`scripts/setup-server.sh`)
- [x] Script de deploy com zero downtime (`scripts/deploy.sh`)
- [x] Script de sincronização com GitHub (`scripts/github-sync.sh`)
- [x] Script de backup e integração com Google Drive (`scripts/backup-drive.sh`)
- [x] Configuração Nginx pronta com SSL e Gzip (`nginx.conf`)
- [x] Configuração PM2 para execução contínua (`ecosystem.config.cjs`)
- [x] Dockerfile multi-stage e Docker Compose (`Dockerfile`, `docker-compose.yml`)
- [x] Pipeline CI/CD com GitHub Actions (`.github/workflows/deploy.yml`)
