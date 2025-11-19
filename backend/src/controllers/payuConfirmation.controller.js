const db = require("../config/conexion_db");

class PayuConfirmationController {
    async confirmation(req, res) {
        try {
            console.log("📩 Callback recibido de PayU:", req.body);

            const {
                reference_sale,
                value,
                currency,
                state_pol,
                sign
            } = req.body;

            // Registrar callback en consola (puede log para auditoría)
            console.log({
                reference_sale,
                value,
                currency,
                state_pol,
                sign
            });

            return res.status(200).send("OK");
        } catch (error) {
            console.error("❌ Error procesando callback:", error);
            return res.status(500).send("ERROR");
        }
    }
}

module.exports = new PayuConfirmationController();
