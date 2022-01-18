const { response } = require("express");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

//* CREADOR USUARIO

const crearUsuario = async (req, res = response) => {

  const { email, password } = req.body;

  try {

    let usuario = await Usuario.findOne({email});

    if(usuario){
      return res.status(400).json({
        ok:false,
        message:'El usuario ya existe'
      });
    }

    usuario = new Usuario(req.body);

  //* ENCRYPTAR PASSWORD

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
  //*

    await usuario.save();

    //* Generar JWT
      const token = await generarJWT(usuario.id, usuario.name);
    //*


    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Porfavor hable con el ADMINISTRADOR",
    });
  }
};


//*LOGIN

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    
    const usuario = await Usuario.findOne({email});

    if(!usuario){
      return res.status(400).json({
        ok:false,
        message:'El usuario no existe'
      });
    }

    //* Confirmar contraseñas 

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if(!validPassword){
      return res.status(400).json({
        ok:false,
        message:'Contraseña incorrecta'
      });
    }

    //* Generar JWT
      const token = await generarJWT(usuario.id, usuario.name);
    //*

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Porfavor hable con el ADMINISTRADOR",
    });
  }
};


//* REAVALIDADOR TOKEN

const revalidarToken = async (req, res = response) => {

  const {uid,name} = req;


  const token =  await generarJWT(uid, name)

  res.json({
    ok: true,
    token
  });
};



module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
