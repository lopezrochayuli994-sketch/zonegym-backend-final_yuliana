import mongoose from "mongoose";

const membresiaSchema = new mongoose.Schema({

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    paquete: {
        type: String,
        required: true
    },

    fechaInicio: {
        type: Date,
        default: Date.now
    },

    fechaFin: {
        type: Date
    }

});

export default mongoose.model("Membresia", membresiaSchema);
