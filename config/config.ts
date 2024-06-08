export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Postgresql',
    database: process.env.DB_NAME || 'weather',
    autoLoadEntities: true,
    synchronize: true,
  },
  jwt: {
    secret: process.env.SECRET_JWT,
  },
});
