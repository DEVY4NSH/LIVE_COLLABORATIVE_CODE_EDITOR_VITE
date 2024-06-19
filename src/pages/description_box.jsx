import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import TypingAnimation from './TypingAnimation';

const DescriptionBox = () => {
    const props = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { duration: 1000 },
    });

    const description = "(Please use it on Desktop, currently UI is not fully compactible with mobiles) Hey there! Ever wished you could team up with your buddies and crack coding challenges together, in real-time? Well, now you can! Our platform brings this vision to life with our real-time code editor. It is completely free to use.                   HAPPY LEARNING"

    return (
        <animated.div style={props} className="description-box">
            <h1>Realtime Code Editor</h1>
            <TypingAnimation text={description} />
        </animated.div>
    );
}

export default DescriptionBox;