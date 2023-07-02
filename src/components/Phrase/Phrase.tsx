'use client';
import { Message } from '@/interfaces';
import { formatBrazilDate } from '@/utils';
import Image from 'next/image';

interface PhraseProps {
  img: any;
  isFromUser: boolean;
  message: Message;
}

export function Phrase({ message, img, isFromUser }: PhraseProps) {
  const handleComponentOrder = () => {
    // if (isFromUser) {
    //   return (
    //     <>
    //       <Image
    //         src={img}
    //         alt={'Imagem do autor da frase'}
    //         width={40}
    //         height={40}
    //       />
    //       <div
    //         className='phrase-text'
    //         style={{
    //           background: '#BEBEBE',
    //           borderRadius: '10px',
    //           display: 'flex',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           flexDirection: 'column',
    //           padding: 10,
    //         }}
    //       >
    //         <div>
    //           <span>{message.author}</span>
    //         </div>
    //         <span>{message.message}</span>
    //       </div>
    //     </>
    //   );
    // }

    // return (
    //   <>
    //     <div
    //       style={{
    //         background: '#BEBEBE',
    //         borderRadius: '10px',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         flexDirection: 'column',
    //         padding: 10,
    //         flexGrow: 1,
    //         overflowWrap: 'break-word',
    //         wordWrap: 'break-word',
    //         hyphens: 'auto',
    //       }}
    //     >
    //       <div>
    //         <span>{message.author}</span>
    //       </div>
    //       <span>{message.message}</span>
    //     </div>
    //     <Image
    //       src={img}
    //       alt={'Imagem do autor da frase'}
    //       width={40}
    //       height={40}
    //     />
    //   </>
    // );
    return (
      <>
        <Image
          src={img}
          alt={'Imagem do autor da frase'}
          width={40}
          height={40}
        />
        <div>
          <span>{message.author}</span>
          {/* <span style={{ color: 'gray.text' }}>
            {formatBrazilDate(message.createdAt)}
          </span> */}
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
            }}
          >
            <span>{message.message}</span>
          </div>
        </div>
      </>
    );
  };

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
      {handleComponentOrder()}
    </div>
  );
}
