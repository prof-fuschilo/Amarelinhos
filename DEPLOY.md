# 🚴 Amarelinhos - Grupo de Ciclismo | Guia de Instalação e Produção

Este documento contém todas as instruções detalhadas, requisitos de ferramentas, serviços de servidor e scripts para colocar a plataforma web do grupo **AMARELINHOS** em produção com máxima performance, segurança e confiabilidade.

---

## 1. Requisitos de Infraestrutura e Ferramentas

### Requisitos Mínimos do Servidor (VPS / Nuvem)
- **Sistema Operacional:** Ubuntu 22.04 LTS ou 24.04 LTS (x86_64 ou ARM64)
- **Processador:** 1 vCPU (2 vCPUs recomendados para alta concorrência)
- **Memória RAM:** 1 GB mínimo (2 GB recomendados)
- **Armazenamento:** 15 GB SSD ou NVMe
- **Portas Liberadas no Firewall:** 80 (HTTP), 443 (HTTPS), 22 (SSH)
- **Provedores Homologados:** DigitalOcean (Droplet), Hetzner Cloud, AWS EC2, Google Cloud Run, Vercel ou Linode.

### Ferramentas de Software Necessárias
1. **Node.js:** Versão 20 LTS ou superior
2. **NPM:** Versão 10 ou superior
3. **Nginx:** Servidor web para proxy reverso e terminação SSL/TLS
4. **Certbot (Let's Encrypt):** Emissão de certificados SSL/HTTPS gratuitos com renovação automática
5. **PM2 ou Docker:** Gerenciador de processos em segundo plano com auto-restart em caso de reboot.

---

## 2. Roteiro Passo a Passo de Instalação no Servidor (Ubuntu)

### Passo 1: Conexão e Atualização do Servidor
Acesse seu servidor via SSH:
```bash
ssh root@seu_ip_do_servidor
```
Atualize os repositórios do sistema:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip ufw build-essential
```

### Passo 2: Instalação do Node.js 20 LTS e PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2 tsx
```
Verifique as versões:
```bash
node -v   # Deve retornar v20.x.x
npm -v    # Deve retornar v10.x.x
```

### Passo 3: Clonagem do Projeto e Instalação de Dependências
```bash
mkdir -p /var/www
cd /var/www
git clone https://seu-repositorio.git amarelinhos
cd amarelinhos

# Instalar dependências
npm install
```

### Passo 4: Build do Front-end para Produção
```bash
npm run build
```
O build estático otimizado será gerado na pasta `/var/www/amarelinhos/dist`.

### Passo 5: Inicialização do Servidor com PM2
```bash
pm2 start server.ts --name "amarelinhos-app" --interpreter tsx
pm2 startup
pm2 save
```
O servidor estará rodando na porta `3000`.

### Passo 6: Configuração do Nginx e SSL (HTTPS)
Instale o Nginx:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```
Copie a configuração para o Nginx:
```bash
sudo cp /var/www/amarelinhos/nginx.conf /etc/nginx/sites-available/amarelinhos
sudo ln -s /etc/nginx/sites-available/amarelinhos /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```
Emita o certificado SSL gratuito via Let's Encrypt:
```bash
sudo certbot --nginx -d amarelinhos.com.br -d www.amarelinhos.com.br
```

---

## 3. Método Alternativo com Docker (Conteinerizado)

Caso prefira rodar toda a aplicação em contêiner Docker:

```bash
# 1. Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# 2. Entrar na pasta do projeto e subir o contêiner
cd /var/www/amarelinhos
docker compose up -d --build

# 3. Verificar status do contêiner
docker ps
```

---

## 4. Integração da Solução PIX do Banco Central (BACEN EMV)

A plataforma implementa estritamente o padrão oficial **EMV QRCPS-MPM / BR Code** especificado pelo Banco Central do Brasil ([repositório oficial BACEN](https://github.com/bacen/pix-api)):

- **Payload Format Indicator (ID 00):** `01`
- **Merchant Account Information (ID 26):** GUI `br.gov.bcb.pix` com a chave PIX informada
- **Merchant Category Code (ID 52):** `0000`
- **Transaction Currency (ID 53):** `986` (BRL)
- **Transaction Amount (ID 54):** Valor exato com 2 casas decimais
- **Country Code (ID 58):** `BR`
- **Merchant Name (ID 59):** Nome do titular/grupo
- **Merchant City (ID 60):** Cidade do recebedor
- **Additional Data Template (ID 62):** Reference Label / txid identificador do pedido
- **Checksum CRC16 (ID 63):** Polinômio CCITT 0x1021 calculado dinamicamente.

Todas as configurações da chave PIX são editáveis pelo painel administrativo em **Admin → Configurações & PIX**.

---

## 5. Rotina de Backup e Restauração

- **Exportação de Dados:** No painel Admin, clique no botão **"Exportar Backup"** para fazer o download imediato de um arquivo `.json` contendo todas as encomendas, catálogo de produtos, classificados, clientes e configurações.
- **Restauração:** O arquivo JSON pode ser importado para restauração instantânea do banco.
