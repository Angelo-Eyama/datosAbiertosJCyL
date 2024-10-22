import { useState, useEffect } from 'react'
import React from 'react'
import { generarUrls, getDatos } from './funciones';

const baseUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/tasa-mortalidad-covid-por-zonas-basicas-de-salud/records?select=fecha%2C%20zbs_geo%2C%20tasax100%2C%20provincia%2C%20municipio&limit=100';
const totalRegistros = 414219;
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
                    <th>Fecha</th>
                    <th>Centro de salud</th>
                    <th>Tasa de mortalidad (%)</th>
                    <th>Provincia</th>
                    <th>Municipio</th>
                </tr>
            </thead>
            <tbody>
                {resultadoJSON.map((dato, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dato.fecha}</td>
                        <td>{dato.zbs_geo}</td>
                        <td>{dato.tasax100} %</td>
                        <td>{dato.provincia}</td>
                        <td>{dato.municipio}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function tasaCOVID() {
    const [datos, setDatos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(Math.ceil(totalRegistros / limite));
    const [busqueda, setBusqueda] = useState('');
    const [datosFiltrados, setDatosFiltrados] = useState([]);

    useEffect(() => {
        const url = `${baseUrl}&offset=${(paginaActual - 1) * limite}`;
        getDatos([url]).then(data => {
            setDatos(data);
            setDatosFiltrados(data);
        });
    }, [paginaActual]);

    const handleBusquedaChange = (event) => {
        setBusqueda(event.target.value);
    };

    const handleBusquedaSubmit = (event) => {
        event.preventDefault();
        if (busqueda.trim() === '') {
            setDatosFiltrados(datos);
        } else {
            const filtrados = datos.filter(dato =>
                dato.zbs_geo.toLowerCase().includes(busqueda.toLowerCase()) 
                || dato.provincia.toLowerCase().includes(busqueda.toLowerCase())
                || dato.municipio.toLowerCase().includes(busqueda.toLowerCase())
            );
            setDatosFiltrados(filtrados);
        }
    };

    const handlePaginaAnterior = () => {
        setPaginaActual(prev => Math.max(prev - 1, 1));
    };

    const handlePaginaSiguiente = () => {
        setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
    };

    return (
        <>
            <h2>Tasa de Mortalidad COVID-19 por Zonas Básicas de Salud</h2>
            <form onSubmit={handleBusquedaSubmit}>
                <input
                    type="text"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    placeholder="Buscar por ciudad, provincia o centro de salud"
                />
                <button type="submit">Buscar</button>
            </form>
            <TablaResultado resultadoJSON={datosFiltrados} />
            <div className="paginacion">
                <button onClick={handlePaginaAnterior} disabled={paginaActual === 1}>Anterior</button>
                <span>     Página {paginaActual} de {totalPaginas}     </span>
                <button onClick={handlePaginaSiguiente} disabled={paginaActual === totalPaginas}>Siguiente</button>
            </div>
        </>
    );
}