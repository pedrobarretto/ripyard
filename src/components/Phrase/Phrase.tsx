'use client';
import { Message } from '@/interfaces';

interface PhraseProps {
  img: any;
  isFromUser: boolean;
  message: Message;
}

export function Phrase({ message, img, isFromUser }: PhraseProps) {
  return (
    <div
      style={{
        padding: 12,
        height: 'fit-content',
        borderRadius: '10px',
        background: '#D9D9D9',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <img src={img} alt={'Imagem do autor da frase'} width={40} height={40} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <span>{message.author}</span>
        <div
          className='phrase-text'
          style={{
            background: '#BEBEBE',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 10,
            overflowWrap: 'break-word', // Break long words
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%', // Limit the width of the message container
          }}
        >
          <span>{message.message}</span>
        </div>
      </div>
    </div>
  );
}
