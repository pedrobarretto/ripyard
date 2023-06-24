import Image from 'next/image';

interface PhraseProps {
  text: string;
  img: any;
  isFromUser: boolean;
}

export function Phrase({ text, img, isFromUser }: PhraseProps) {
  const handleComponentOrder = () => {
    if (isFromUser) {
      return (
        <>
          <Image
            src={img}
            alt={'Imagem do autor da frase'}
            width={40}
            height={40}
          />
          <div
            className='phrase-text'
            style={{
              background: '#BEBEBE',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
            }}
          >
            <span>{text}</span>
          </div>
        </>
      );
    }

    return (
      <>
        <div
          style={{
            background: '#BEBEBE',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            flexGrow: 1,
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            hyphens: 'auto',
          }}
        >
          <span>{text}</span>
        </div>
        <Image
          src={img}
          alt={'Imagem do autor da frase'}
          width={40}
          height={40}
        />
      </>
    );
  };

  return (
    <div
      style={{
        padding: 15,
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
      {handleComponentOrder()}
    </div>
  );
}
