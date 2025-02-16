import React from 'react';
import './Crown.css';

const Crown = ({ visible }: { visible: boolean }) => {
    return (
        <div className={`crown-icon ${visible ? 'visible' : 'hidden'}`}>
            <svg
                width="60"
                height="60"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
    d="M 0 50 L 0 50 C 5 75 75 70 80 50 L 80 0 L 54 25 L 40 0 L 22 25 L 0 0 L 0 50 Z "
    fill="gold"
                />
            </svg>
        </div>
    );
}

export default Crown;