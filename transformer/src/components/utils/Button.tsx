import React from "react";
import './Button.css';

const Button = (props: { text: string; href: string; newtab: boolean; className: string; }) => {

    const { text, href, newtab, className } = props;

    return (
        <a
            href={href}
            target={newtab ? "_blank" : undefined}
            className={className}
        >
            <button type="button">
                {text}
            </button>
        </a>
    );
};

export default Button;