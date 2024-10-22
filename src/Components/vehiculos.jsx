import { useState, useEffect } from 'react'
import React from 'react'
import { generarUrls, getDatos } from './funciones';

const baseUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/puntos-de-recarga-del-vehiculo-electrico/records?select=nombre%2C%20direccion%2C%20operador&limit=100'
const totalRegistros = 197;
const limite = 100;

/**
 * Funcion que recibe un array de objetos y los muestra en una tabla
 */
function TablaResultado({ resultadoJSON }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Operador</th>
                </tr>
            </thead>
            <tbody>
                {resultadoJSON.map((dato, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dato.nombre}</td>
                        <td>{dato.direccion}</td>
                        <td>{dato.operador}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function ListaVehiculos() {
    const [datos, setDatos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [datosFiltrados, setDatosFiltrados] = useState([]);

    useEffect(() => {
        const enlaces_automoviles = generarUrls(baseUrl, totalRegistros, limite);
        getDatos(enlaces_automoviles).then(data => {
            setDatos(data);
            setDatosFiltrados(data);
        });
    }, []);

    const handleBusquedaChange = (event) => {
        setBusqueda(event.target.value);
    };

    const handleBusquedaSubmit = (event) => {
        event.preventDefault();
        if (busqueda.trim() === '') {
            setDatosFiltrados(datos);
        } else {
            const filtrados = datos.filter(dato =>
                dato.direccion.toLowerCase().includes(busqueda.toLowerCase())
            );
            setDatosFiltrados(filtrados);
        }
    };

    return (
        <>
            <h2>Puntos de recarga de vehículos eléctricos</h2>
            <form onSubmit={handleBusquedaSubmit}>
                <input
                    type="text"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    placeholder="Buscar por ciudad o provincia"
                />
                <button type="submit">Buscar</button>
            </form>
            <TablaResultado resultadoJSON={datosFiltrados} />
        </>
    );
}