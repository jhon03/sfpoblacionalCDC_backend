
const crearPrograma = async (req, res) => {
    const {colaborador, body: datos} = req;
    try {
        
    } catch (error) {
        return res.status(400).json({
            msg: "Error al crear el programa",
            error: error.message
        })
    }
}