'use client';

import { Phrase } from '../Phrase/Phrase';

export function MessagesContainer() {
  return (
    <div
      style={{
        width: '970px',
        height: '846px',
        flexShrink: '0',
        borderRadius: '10px',
        background: '#D9D9D9',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        padding: 10,
      }}
    >
      <Phrase text='Minha frase' img={'/ripyard-logo.png'} isFromUser={true} />
    </div>
  );
}
