import mysql from 'mysql2/promise'

export const db = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: '',           
  database: 'users', 
});


export const salonDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'salon', 
});


