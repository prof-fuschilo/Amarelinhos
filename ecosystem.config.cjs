/**
 * 🚴 AMARELINHOS - PM2 ECOSYSTEM CONFIGURATION
 * Gerenciador de processos de alta performance para produção
 * Documentação: https://pm2.keymetrics.io/docs/usage/application-declaration/
 */

module.exports = {
  apps: [
    {
      name: 'amarelinhos-app',
      script: 'dist/server.js',
      instances: 1, // Pode ser alterado para 'max' em servidores com múltiplos cores
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
