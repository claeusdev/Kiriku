import React from 'react';

export default ({userName = 'Una'}) => {
  const firstLetter = userName.charAt(0).toUpperCase();
  return (
    <div style={{
      border: '1px solid #1abc9b',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      textAlign: 'center',
      backgroundColor: '#1abc9b'
    }}>
      <span style={{
        fontSize: '11px',
        color: '#ffffff'
      }}>{firstLetter}</span>
    </div>
  );
}