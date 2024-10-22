import { useState, useEffect } from 'react'
import React from 'react'
import ListaVehiculos from './Components/vehiculos.jsx'
import ListaFarmaceuticos from './Components/farmaceuticos.jsx'
import ListaCOVID from './Components/tasaMortalidad.jsx'
import ListaEmpleo from './Components/empleoPublico.jsx'
import './App.css'


function App() {
  const [selectedOption, setSelectedOption] = useState('');
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <h1>Datos de la Junta de Castilla y Leon</h1>
      <p>Seleccione los datos que quiere ver</p>
      { <select onChange={handleSelectChange} defaultValue="default">
        <option value="default" disabled>Seleccione una opción</option>
        <option value="vehiculos">Vehiculos</option>
        <option value="farmaceuticos">Farmaceuticos</option>
        <option value="tasaCOVID">Tasa de mortalidad por COVID</option>
        <option value="empleoPublico">Empleo Público</option>
      </select> }
      
      {selectedOption === 'vehiculos' && <ListaVehiculos />}
      {selectedOption === 'farmaceuticos' && <ListaFarmaceuticos />}
      {selectedOption === 'tasaCOVID' && <ListaCOVID />}
      {selectedOption === 'empleoPublico' && <ListaEmpleo />}
    </>
  );
}

export default App