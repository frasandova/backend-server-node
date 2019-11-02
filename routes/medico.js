var express = require('express');
var Medico = require('../models/medico');

var mdAutentificacion = require('../middlewares/autentificacion');

var app = express();

//============================================
//Obtener todos los medicos
//============================================
app.get('/',(req, res, next)=>{
    // Medico.find({}, 'nombre img usuario hospital')

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(
        (err, medicos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error cargando medico',
                errors:err
            });
        }

        Medico.count({}, (err, conteo)=>{
            res.status(200).json({
                ok:true,
                medicos:medicos,
                total:conteo
            });
        })

 

    });    
});

//============================================
//Actualizar medicos
//============================================
app.put('/:id', mdAutentificacion.verificaToken, (req,res)=>{

    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico)=>{        

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar medico',
                errors:err
            });
        }
        if(!medico){
            return res.status(400).json({
                ok:false,
                mensaje:'El medico con el id {id} no existe',
                errors:{ message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre= body.nombre;
        medico.usuario= req.usuario._id;
        medico.hospital= body.hospital;
        
        medico.save( (err, medicoGuardado)=>{
            
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar hospital',
                    errors:err
                });
            }                        
            res.status(201).json({
                ok:true,
                medico:medicoGuardado
                // usuariotoken: req.usuario
            })

        });
    });
});


//============================================
//Crear un nuevo medico
//============================================
app.post('', mdAutentificacion.verificaToken, (req, res)=>{
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,              
        usuario: req.usuario._id,
        hospital: body.hospital
    
    });

    medico.save( ( err, medicoGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear medico',
                errors:err
            });
        }
     
        res.status(201).json({
            ok:true,
            medico: medicoGuardado
        });
    }) 
});

//============================================
//Borrar un medico por el id
//============================================
app.delete('/:id', mdAutentificacion.verificaToken, (req,res)=>{    
    
    var id = req.params.id;
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar medico',
                errors:err
            });
        }
        if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe medico con ese id',
                errors:{message:'No existe medico con ese id'}
            });
        }     
        res.status(200).json({
            ok:true,
            medico: medicoBorrado
        });
    });

});

module.exports= app;