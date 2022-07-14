export default {
  mongoURL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/curso-ddd',
  port: process.env.port ?? 3001,
  jwtSecret: process.env.JWTSECRET ?? 'jasdw!@3DAS13dsa=!!'
}
