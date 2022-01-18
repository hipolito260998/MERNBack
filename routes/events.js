
/*
    Rutas de eventos  /events
    host + /api/events/
*/

const {Router} = require('express');
const {check} = require('express-validator');
const { crearEvento, actualizarEvento, eliminarEvento, getEventos } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

//*Todas tienen que pasar por la validacion del JWT
router.use(validarJWT);


//* Obtener eventos getEventos

router.get(
    '/',
    [
        
    ], 
    getEventos);

//* Crear un nuevo evento post crearEvento

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fehca de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ], 
    crearEvento)

//* actualizar un evento put actualizarEvento

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fehca de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ], 
    actualizarEvento)

//* Eliminar un evento delete eliminarEvento

router.delete('/:id',eliminarEvento)


module.exports = router;
