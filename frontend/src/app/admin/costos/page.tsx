"use client";

import { useState } from "react";

export default function AdministrarCostosPage() {
    // Estados para guardar los datos que elija el administrador
    const [clase, setClase] = useState("A");
    const [vigencia, setVigencia] = useState(5);
    const [nuevoPrecio, setNuevoPrecio] = useState("");

    // Función que se ejecuta al presionar "Actualizar"
    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Hacemos la petición PUT a tu backend
            const response = await fetch(`http://localhost:8080/api/costos/actualizar?clase=${clase}&vigenciaAnios=${vigencia}&nuevoPrecio=${nuevoPrecio}`, {
                method: 'PUT'
            });

            if (response.ok) {
                alert(`¡Éxito! El costo de la Clase ${clase} por ${vigencia} años ahora es de $${nuevoPrecio}.`);
                setNuevoPrecio(""); // Limpiamos el campo
            } else {
                alert("Hubo un problema al actualizar el precio.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor.");
        }
    };

    return (
        <div style={{ padding: "3rem", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "1rem", color: "white" }}>Administración de Costos</h2>
            <p style={{ marginBottom: "2rem", color: "#a0aec0" }}>
                Atención: Solo el administrador del sistema puede modificar el precio base de las licencias. Los $8 de gasto administrativo son fijos.
            </p>

            <form onSubmit={handleActualizar} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#e2e8f0" }}>
                    Clase de Licencia:
                    <select 
                        value={clase} 
                        onChange={(e) => setClase(e.target.value)} 
                        style={{ 
                            padding: "0.5rem", 
                            color: "white", 
                            backgroundColor: "#1e293b", /* Solución: Fondo oscuro */
                            border: "1px solid #334155",
                            borderRadius: "5px",
                            outline: "none"
                        }}
                    >
                        <option value="A">Clase A</option>
                        <option value="B">Clase B</option>
                        <option value="C">Clase C</option>
                        <option value="D">Clase D</option>
                        <option value="E">Clase E</option>
                        <option value="F">Clase F</option>
                        <option value="G">Clase G</option>
                    </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#e2e8f0" }}>
                    Vigencia (Años):
                    <select 
                        value={vigencia} 
                        onChange={(e) => setVigencia(Number(e.target.value))} 
                        style={{ 
                            padding: "0.5rem", 
                            color: "white", 
                            backgroundColor: "#1e293b", /* Solución: Fondo oscuro */
                            border: "1px solid #334155",
                            borderRadius: "5px",
                            outline: "none"
                        }}
                    >
                        <option value={1}>1 año</option>
                        <option value={3}>3 años</option>
                        <option value={4}>4 años</option>
                        <option value={5}>5 años</option>
                    </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#e2e8f0" }}>
                    Nuevo Precio Base ($):
                    <input
                        type="number"
                        value={nuevoPrecio}
                        onChange={(e) => setNuevoPrecio(e.target.value)}
                        placeholder="Ej: 50"
                        style={{ 
                            padding: "0.5rem", 
                            color: "white", 
                            backgroundColor: "#1e293b", /* Solución: Fondo oscuro */
                            border: "1px solid #334155",
                            borderRadius: "5px",
                            outline: "none"
                        }}
                        required
                    />
                </label>

                <button 
                    type="submit" 
                    style={{ 
                        padding: "0.75rem", 
                        backgroundColor: "#2563eb", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginTop: "1rem"
                    }}
                >
                    Guardar Nuevo Costo
                </button>
            </form>
        </div>
    );
}