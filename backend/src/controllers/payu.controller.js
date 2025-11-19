const db = require('../config/conexion_db');
const crypto = require('crypto');

exports.checkout = async (req, res) => {
    try {
        const { order_id } = req.body;
        if (!order_id) return res.status(400).json({ message: 'order_id es requerido' });

        // Traer pedido y email del usuario
        const [orderRows] = await db.query(
            `SELECT p.id_pedido, p.id_usuario, p.estado, p.fecha, u.email
    FROM pedidos p JOIN usuarios u ON p.id_usuario = u.id_usuario
    WHERE p.id_pedido = ?`,
            [order_id]
        );
        if (!orderRows || orderRows.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        const order = orderRows[0];

        // Traer detalle (asumo que total ya está en detalle_pedido.total)
        const [items] = await db.query(
            `SELECT dp.*, pr.nombre_producto
    FROM detalle_pedido dp
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    WHERE dp.id_pedido = ?`,
            [order_id]
        );

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Pedido sin items' });
        }

        // Calcular monto (sumatoria del campo total en detalle_pedido)
        const amount = items.reduce((acc, it) => acc + Number(it.total || 0), 0).toFixed(2);

        // Generar referenceCode único
        const referenceCode = `BS-${order_id}-${Date.now()}`;

        const merchantId = process.env.PAYU_MERCHANT_ID;
        const accountId = process.env.PAYU_ACCOUNT_ID;
        const apiKey = process.env.PAYU_API_KEY;
        const currency = process.env.PAYU_CURRENCY || 'COP';

        // Construir signature MD5: ApiKey~merchantId~referenceCode~amount~currency
        const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`;
        const signature = crypto.createHash('md5').update(signatureString).digest('hex');

        // Guardar en tabla payments (status PENDING)
        await db.query(
            `INSERT INTO payments (order_id, referenceCode, amount, currency, buyerEmail, status)
    VALUES (?,?,?,?,?,?)`,
            [order_id, referenceCode, amount, currency, order.email, 'PENDING']
        );

        // URLs
        const responseUrl = process.env.PAYU_RESPONSE_URL;
        const confirmationUrl = process.env.PAYU_CONFIRMATION_URL;
        const payuUrl = process.env.PAYU_URL;

        // Formulario HTML que envía al gateway (auto-submit)
        const formHtml = `
    <!doctype html>
    <html>
        <head><meta charset="utf-8"><title>Redirigiendo a PayU...</title></head>
        <body>
        <p>Redirigiendo al pasarela de pagos...</p>
        <form id="payu_form" method="post" action="${payuUrl}">
            <input name="merchantId" type="hidden" value="${merchantId}" />
            <input name="accountId" type="hidden" value="${accountId}" />
            <input name="description" type="hidden" value="Compra BikeStore - Pedido ${order_id}" />
            <input name="referenceCode" type="hidden" value="${referenceCode}" />
            <input name="amount" type="hidden" value="${amount}" />
            <input name="tax" type="hidden" value="0" />
            <input name="taxReturnBase" type="hidden" value="0" />
            <input name="currency" type="hidden" value="${currency}" />
            <input name="buyerEmail" type="hidden" value="${order.email}" />
            <input name="responseUrl" type="hidden" value="${responseUrl}" />
            <input name="confirmationUrl" type="hidden" value="${confirmationUrl}" />
            <input name="signature" type="hidden" value="${signature}" />
            <input name="test" type="hidden" value="1" />
        </form>
        <script>document.getElementById('payu_form').submit();</script>
        </body>
    </html>
    `;
        res.set('Content-Type', 'text/html');
        return res.send(formHtml);
    } catch (err) {
        console.error('Error en /api/payu/checkout', err);
        return res.status(500).json({ message: 'Error interno' });
    }
};
