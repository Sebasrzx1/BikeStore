import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        if (carrito.length === 0) {
            return navigate("/carrito");
        }

        const total = carrito.reduce((acc, p) => acc + p.subtotal, 0);

        // 👇 Aquí llamamos al backend para generar la orden en PayU
        const generarOrden = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/payu/create-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: total,
                        description: "Compra en BikeStore",
                    }),
                });

                const data = await res.json();
                setFormData(data);
            } catch (err) {
                console.error("❌ Error generando orden de PayU:", err);
            }
        };

        generarOrden();
    }, []);

    if (!formData) {
        return (
            <div style={{ padding: "100px", textAlign: "center" }}>
                <h2>Generando orden de pago...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h1>Redirigiendo al pago seguro PayU...</h1>

            {/* 
        🔥 Formulario tiempo real que redirige al sandbox
        PayU requiere un POST directo desde el navegador.
      */}
            <form
                action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
                method="POST"
            >
                {Object.entries(formData).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                ))}

                <button
                    type="submit"
                    style={{
                        padding: "15px 25px",
                        background: "#00a650",
                        borderRadius: "8px",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Ir a PayU →
                </button>
            </form>
        </div>
    );
}
