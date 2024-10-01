const express = require('express');
const session = require('express-session');
const app   = express();
const mysql = require('mysql2');
const port = 3000;
//const session = require('express-session');
app.set('view engine', 'ejs');
app.set('views', './views');


//configurar express-session
app.use(session({
  secret: 'tuSecretoSuperSeguro',
  resave: false,
  saveUninitialized: true,
  cookie: {secure:false}//si usas HTTPS, cambia a true
}));


const connection = mysql.createConnection({
    host: '144.126.143.151',       // Cambia esto si es necesario
    user: 'johannso93dx_base2',            // Usuario de tu base de datos
    password: 'johannso93dx_base2',    // Contraseña de tu base de datos
    database: 'johannso93dx_base2' // Nombre de tu base de datos
  });
/*app.get('/', (req, res)=>{
    res.send('Hola mi server en express');
});*/

connection.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos: ', err);
      return;
    }
    console.log('Conectado a la base de datos MySQL');
  });


app.get('/', (req, res)=>{
    res.render('login/login', {title: 'Elmer Galarza'});
});

app.post('/iniciar-session', (req, res)=>{
  const {email, password} = req.body;

  const query = 'SELECT * from usuario u WHERE correo = ? AND pass = md5(?)';

  connection.query(query, [email, password], (err, result)=>{
    if (err){
      console.error('Erro ejecutando la consulta: ', err);
      return res.status(500).send('Error en la base de datos');
    }
    if (result.length>0){
      //si el usuario existe crear la sesión
      req.session.user = result[0]; //Almacenar los datos dle usuario en la sesiòn
      //Redirigir a la pàgina deseada
      res.redirect('/dashboard');

    }else{
      // Si las credenciales son incorrectas
      res.send('Credenciales incorrectas');
    }
  })
})

app.get('/estudiantes', (req, res)=>{
    res.json([
        {
            estudiante: 'Pepillo Jhonson',
            carnet: '100000000'

        },
        {
            estudiante: 'Niño Rata',
            carnet: '101011010111'

        },
        {
            estudiante: 'Ricardito',
            carnet: '900000'

        }
    ]);
});
app.get('/peliculas', (req,res)=>{
    res.json([
        {
            producto: 'Titanic',
            precio: '12'
        },
        {
            producto: 'El señor de los anillos',
            precio: '30'
        }
    ]);
});

app.listen(port, (req, res)=>{
    console.log('Mi puerto es: '+port);
});
