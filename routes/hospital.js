var express = require('express');
var Hospital = require('../models/hospital');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');

var mdAutentificacion = require('../middlewares/autentificacion');

var app = express();

//============================================
//Obtener todos los hospitales
//============================================

app.get('/',(req, res, next)=>{
    // Hospital.find({}, 'nombre img usuario')
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(
        (err, hospitales)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error cargando hospital',
                errors:err
            });
        }

        Hospital.count({}, (err,conteo)=>{
            res.status(200).json({
                ok:true,
                hospitales:hospitales,
                total:conteo
            });
        })



    });    
});

//============================================
//Actualizar hospital
//============================================
app.put('/:id', mdAutentificacion.verificaToken, (req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital)=>{        

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar hospital',
                errors:err
            });
        }
        if(!hospital){
            return res.status(400).json({
                ok:false,
                mensaje:'El hospital con el id {id} no existe',
                errors:{ message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre= body.nombre;
        // hospital.img= body.img;
        hospital.usuario= req.usuario._id;
        
        hospital.save( (err, hospitalGuardado)=>{
            
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar hospital',
                    errors:err
                });
            }                        

            res.status(201).json({
                ok:true,
                hospital:hospitalGuardado
                // usuariotoken: req.usuario
            })

        });
    });
});


//============================================
//Crear un nuevo hospital
//============================================
app.post('', mdAutentificacion.verificaToken, (req, res)=>{
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,                      
        usuario: req.usuario._id    
    });

    hospital.save( ( err, hospitalGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear hospital',
                errors:err
            });
        }
     
        res.status(201).json({
            ok:true,
            hospital: hospitalGuardado
        });
    }) 
});

//============================================
//Borrar un hospital por el id
//============================================
app.delete('/:id', mdAutentificacion.verificaToken, (req,res)=>{    
    var id = req.params.id;

    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar hospital',
                errors:err
            });
        }

        if(!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe hospital con ese id',
                errors:{message:'No existe hospital con ese id'}
            });
        }
     
        res.status(200).json({
            ok:true,
            hospital: hospitalBorrado
        });
    });

});

module.exports= app;