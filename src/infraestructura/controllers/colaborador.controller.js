const Colaborador = require('../../dominio/models/colaborador.models');
const { generarId } = require('../helpers/globales.helpers');

const registrarColaborador = async (req, res) => {
    const datos = req.body;
    try {
        let colaborador = new Colaborador(req.body);
        colaborador.idColaborador = generarId();
        await colaborador.save();
        return res.status(201).json({
            msg: 'EL colaborador a sido creado correctamente',
            colaborador,
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al registrar el colaborador',
            error: error.message
        })
    }
}

const listColaboradores = async (req, res) =>{
    try {
        const listColaboradores = await Colaborador.find({estado: "ACTIVO"});
        return res.json({
            msg: `Se encontraron ${listColaboradores.length} colaboradores`,
            colaboradores: listColaboradores
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al obtener la lista de colaboradores',
            error: error.message
        })
    }
};

module.exports = {
    listColaboradores,
    registrarColaborador,
}