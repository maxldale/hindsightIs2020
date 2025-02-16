import React from 'react';
import './RestartIcon.css';

const RestartIcon = ({ visible }: { visible: boolean }) => {
    return (
        <div className={`restart-icon ${visible ? 'visible' : 'hidden'}`}>
            <svg
                width="60"
                height="60"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
    d="M40 10V20C30.06 20 22 28.06 22 38C22 47.94 30.06 56 40 56C49.94 56 58 47.94 58 38H52C52 44.63 46.63 50 40 50C33.37 50 28 44.63 28 38C28 31.37 33.37 26 40 26V36L54 22L40 10Z"
    fill="#333333"
    stroke="#333333"
    strokeWidth="2"
                />
            </svg>
        </div>
    );
}

export default RestartIcon;