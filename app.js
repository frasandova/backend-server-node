// Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res)=>{
    if(err) throw err;

    console.log('Base de datos: \x1b[36m%s\x1b[0m', 'online');
});

//Rutas
app.get('/',(req, res, next)=>{
    res.status(403).json({
        ok:true,
        mensaje:'Peticion realizada correctamente'
    });
});


// Escuchar Peticiones
app.listen(3000,()=>{
    // console.log('express Server puerto 3000 Online');
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});


