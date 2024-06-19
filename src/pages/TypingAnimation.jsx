import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './TypingAnimation.css';

const TypingAnimation = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(displayText + text[index]);
                setIndex(index + 1);
            }, 100); // Adjust the delay to control typing speed
            return () => clearTimeout(timeout);
        }
    }, [index, text, displayText]);

    const props = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 200, },
    });

    return (
        <animated.div style={props} className="typing-animation">
            {displayText}
        </animated.div>
    );
}

export default TypingAnimation;
