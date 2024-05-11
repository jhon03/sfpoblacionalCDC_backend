const { crearInstanciaColaborador, guardarColaborador, obtenerColaboradores } = require('../helpers/colaborador.helpers');

const registrarColaborador = async (req, res) => {
    const datos = req.body;
    try {
        let colaborador = crearInstanciaColaborador(datos);
        await guardarColaborador(colaborador);
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
        const listColaboradores = await obtenerColaboradores();
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