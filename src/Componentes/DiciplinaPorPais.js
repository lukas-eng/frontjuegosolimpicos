import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/paisEspecifico.css';

function PaisEspecifico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [countries, setPais] = useState(null);
  const [medallas, setMedallas] = useState([]);

  useEffect(() => {
    // Cargar país
    axios.get(`http://localhost:3000/countries/${id}`)
      .then(res => setPais(res.data))
      .catch(err => {
        console.error('Error al cargar país:', err);
        setPais({ nombre: '.' }); // evita bucle infinito
      });

    // Cargar medallas
    axios.get('http://localhost:3000/medals')
      .then(res => setMedallas(res.data))
      .catch(err => console.error('Error al cargar medallas:', err));
  }, [id]);

  if (!countries) return <p>Cargando país...</p>;
  if (!countries.nombre) return <p>País no encontrado</p>;

  // Filtrar medallas del país
  const medallasDelPais = medallas.filter(m => m.countryId === parseInt(id));

  const contarTipo = (tipo) =>
    medallasDelPais
      .filter(m => m.tipo === tipo)
      .reduce((total, m) => total + (m.cantidad || 1), 0);

  const irAMedalleria = (tipo) => {
    navigate(`/medalleria/${tipo.toLowerCase()}/${id}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={() => navigate(-1)}>⬅ Volver</button>
      <h2>{countries.nombre}</h2>

      {countries.bandera && (
        <img src={countries.bandera} alt={countries.nombre} width="100" />
      )}

      <h3>Medallas ganadas:</h3>
      <ul>
        <li>🥇 Oro: {contarTipo('Gold')}</li>
        <li>🥈 Plata: {contarTipo('Silver')}</li>
        <li>🥉 Bronce: {contarTipo('Bronze')}</li>
        <li><strong>Total:</strong> {contarTipo('Gold') + contarTipo('Silver') + contarTipo('Bronze')}</li>
      </ul>
    </div>
  );
}

export default PaisEspecifico;
