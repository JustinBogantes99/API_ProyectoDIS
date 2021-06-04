import React from 'react'
import './Button.css';
import {Link} from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline', 'btn--outline2', 'btn--test'];
const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize,
    specificStyle,
    path}) => {
        const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    
        const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

        return (
            <Link to={path} className='btn-mobile'>
              <button type="submit"
                className={`${checkButtonStyle} ${checkButtonSize}`}
                onClick={onClick}
                type={type}
                style={specificStyle}
              >
                {children}
              </button>
            </Link>
        );
    }