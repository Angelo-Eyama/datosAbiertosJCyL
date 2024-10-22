import { useState, useEffect } from 'react'
import React from 'react'
import { generarUrls, getDatos } from './funciones';

const baseUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-establecimientos-farmaceuticos-de-castilla-y-leon/records?select=nombre_comercial%2C%20telefono%2C%20provincia%2C%20localidad&limit=100';
const totalRegistros = 211;
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
                    <th>Nombre comercial</th>
                    <th>Provincia</th>
                    <th>Localidad</th>
                    <th>Teléfono</th>
                </tr>
            </thead>
            <tbody>
                {resultadoJSON.map((dato, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dato.nombre_comercial}</td>
                        <td>{dato.provincia}</td>
                        <td>{dato.localidad}</td>
                        <td>{dato.telefono}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function Farmaceuticos() {
    const [datos, setDatos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [datosFiltrados, setDatosFiltrados] = useState([]);

    useEffect(() => {
        const enlaces_farmaceuticos = generarUrls(baseUrl, totalRegistros, limite);
        getDatos(enlaces_farmaceuticos).then(data => {
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
                dato.provincia.toLowerCase().includes(busqueda.toLowerCase()) 
                || dato.localidad.toLowerCase().includes(busqueda.toLowerCase())
            );
            setDatosFiltrados(filtrados);
        }
    };

    return (
        <>
            <h2>Establecimientos farmacéuticos de Castilla y León</h2>
            <form onSubmit={handleBusquedaSubmit}>
                <input
                    type="text"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    placeholder="Buscar por provincia o localidad"
                />
                <button type="submit">Buscar</button>
            </form>
            <TablaResultado resultadoJSON={datosFiltrados} />
        </>
    );
}