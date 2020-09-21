import React from 'react';

type linkProps = {
    text: string;
    onClick: () => void;
}

function Link({text,onClick}:linkProps) {
    return (
        <button className='link' onClick={onClick}>
            {text}
        </button>
    );
}

export default Link;
