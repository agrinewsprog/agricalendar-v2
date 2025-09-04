module.exports = {
  apps: [
    {
      name: "agricalendar-backend",
      cwd: "./backend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        DATABASE_URL:
          "postgresql://agricalendar_user:fPbO53sLu0fMqoz@localhost:5432/agricalendar",
        JWT_SECRET:
          "87965286dbff4281fb9bb2504b1a8b3bcd6a0a8a14f4118fced2f60ef323a8ed",
        JWT_EXPIRES_IN: "7d",
        BCRYPT_ROUNDS: 12,
        FRONTEND_URL: "https://agricalendar.net",
        ADMIN_URL: "https://agricalendar.net/admin",
        RATE_LIMIT_WINDOW_MS: 900000,
        RATE_LIMIT_MAX_REQUESTS: 100,
      },
      instances: 1,
      exec_mode: "fork",
      max_restarts: 3,
      restart_delay: 5000,
    },
    {
      name: "agricalendar-frontend-public",
      cwd: "./frontend-public",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        NEXT_PUBLIC_API_URL: "https://agricalendar.net/api/",
      },
      instances: 1,
      exec_mode: "fork",
      max_restarts: 3,
      restart_delay: 5000,
    },
    {
      name: "agricalendar-frontend-admin",
      cwd: "./frontend-admin",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_PUBLIC_API_URL: "https://agricalendar.net/api/",
      },
      instances: 1,
      exec_mode: "fork",
      max_restarts: 3,
      restart_delay: 5000,
    },
  ],
};
