import React from 'react'

function FranchiseCard({ franchise, onClick }) {
  return (
    <div
      className="franchise-card"
      style={{
        border: '1px solid #ccc',
        marginBottom: '1rem',
        padding: '1rem',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <h3>{franchise.nombre}</h3>
      {franchise.imagen && (
        <img
          src={franchise.imagen}
          alt={franchise.nombre}
          style={{ width: '100px', height: 'auto' }}
        />
      )}
    </div>
  )
}

export default FranchiseCard
