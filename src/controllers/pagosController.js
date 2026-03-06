import Membresia from "../models/Membresia.js";

export const renovarMembresia = async (req, res) => {

    try {

        const { paquete } = req.body;

        const fechaInicio = new Date();

        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);

        const nuevaMembresia = new Membresia({
            paquete,
            fechaInicio,
            fechaFin
        });

        await nuevaMembresia.save();

        res.json({
            mensaje: "Membresía guardada correctamente",
            membresia: nuevaMembresia
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al renovar membresía"
        });

    }

};
