import { useState, useEffect } from 'react'
import React from 'react'
import { generarUrls, getDatos } from './funciones';

const baseUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/convocatorias-de-empleo-publico/records?select=titulo%2C%20tipo%2C%20organismo_gestor%2C%20enlace_al_contenido%2C%20fecha_de_inicio%2C%20fechafinalizacion&limit=100';
const totalRegistros = 1605;
const limite = 100;

function TablaResultado({ resultadoJSON }){
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Titulo</th>
                    <th>Tipo</th>
                    <th>Organismo gestor</th>
                    <th>Fecha de inicio</th>
                    <th>Fecha de finalización</th>
                    <th>Enlace al contenido</th>
                </tr>
            </thead>
            <tbody>
                {resultadoJSON.map((dato, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dato.titulo}</td>
                        <td>{dato.tipo}</td>
                        <td>{dato.organismo_gestor}</td>
                        <td>{dato.fecha_de_inicio}</td>
                        <td>{dato.fechafinalizacion}</td>
                        <td> <a href={dato.enlace_al_contenido}>Enlace</a></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function EmpleoPublico() {
    const [resultadoJSON, setResultadoJSON] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        const urls = generarUrls(baseUrl, totalRegistros, limite);
        getDatos(urls).then(data => setResultadoJSON(data));
    }, []);

    const handleBuscar = () => {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const filtrado = resultadoJSON.filter(dato => {
            const fecha = new Date(dato.fecha_de_inicio);
            return fecha >= inicio && fecha <= fin;
        });
        setResultadoJSON(filtrado);
    };

    return (
        <>
            <h2>Convocatorias de empleo público</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleBuscar(); }}>
                <label>
                    Fecha de inicio:  
                    <input type="date" 
                    value={fechaInicio} 
                    min={'2015-01-01'}
                    max={'2022-12-31'}
                    onChange={(e) => setFechaInicio(e.target.value)} />
                </label>
                <label>
                    Fecha de fin:  
                    <input type="date" 
                    value={fechaFin} 
                    min={'2015-01-01'}
                    max={'2022-12-31'}
                    onChange={(e) => setFechaFin(e.target.value)} />
                </label>
                <button type="submit">Buscar</button>
            </form>
            <TablaResultado resultadoJSON={resultadoJSON} />
        </>
    );
}