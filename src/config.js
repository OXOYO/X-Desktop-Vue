/**
 * Created by OXOYO on 2017/7/13.
 */

// 服务配置
export const servConfig = {
  acceptHost: [
    'localhost',
    '127.0.0.1'
  ],
  development: 'http://localhost:3000/api/',
  production: ''
}

// cookie相关配置
export const cookieConfig = {
  keys: {
    account: 'x-account',
    token: 'x-key',
    userType: 'x-type',
    userCode: 'x-code',
    secret: 'x-platform'
  }
}
