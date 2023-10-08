const PORT = process.env.PORT || 3001; 
const USER = process.env.USER || 'demo'; 
const PASSWORD = process.env.PASSWORD ||'password'; 
const HOST = process.env.HOST || 'localhost'; 
const DATABASE = process.env.DATABASE || 'picshare'; 
const PORT_DB = process.env.PORT_DB || '3306'; 

module.exports = {PORT, USER, PASSWORD, HOST, DATABASE, PORT_DB};