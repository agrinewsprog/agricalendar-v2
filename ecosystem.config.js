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
        DATABASE_URL: "postgresql://user:password@localhost:5432/agricalendar",
      },
      instances: 1,
      exec_mode: "fork",
    },
    {
      name: "agricalendar-frontend-public",
      cwd: "./frontend-public",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "https://agricalendar.net/api",
      },
      instances: 1,
      exec_mode: "fork",
    },
    {
      name: "agricalendar-frontend-admin",
      cwd: "./frontend-admin",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_PUBLIC_API_URL: "https://agricalendar.net/api",
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
