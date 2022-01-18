const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");
const Evento = require("../models/Evento");

//* Obtener eventos

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");

  res.json({
    ok: true,
    eventos,
  });
};

//* Crear evento
const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;

    const eventoGuardado = await evento.save();

    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el ADMINISTRADOR",
    });
  }
};

//* Actualizar evento

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      res.status(404).json({
        ok: false,
        msg: "No existe el evento",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes permisos para actualizar este evento",
      });
    }

    const eventoActualizado = {
        ...req.body,
        user: uid
    }

    const eventoGuardado = await Evento.findByIdAndUpdate(eventoId, eventoActualizado, {new: true})

    res.json({
        ok: true,
        evento: eventoGuardado
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el ADMINISTRADOR",
    });
  }
};

//*Elminar evento

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
  
    try {
      const evento = await Evento.findById(eventoId);
  
      if (!evento) {
          return res.status(404).json({
          ok: false,
          msg: "No existe el evento",
        });
      }
  
      if (evento.user.toString() !== uid) {
        return res.status(401).json({
          ok: false,
          msg: "No tienes permisos para eliminar  este evento",
        });
      }
      

      await Evento.findByIdAndDelete(eventoId);

  
      res.json({
          ok: true
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Hable con el ADMINISTRADOR",
      });
    }




};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
