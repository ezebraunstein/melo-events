import React from 'react';

const MarqueeTitle = ({ text }) => {

    const uppercaseText = text.toUpperCase();

    return (
        <div className="marquee-container">
            <div className="marquee">
                {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText} {uppercaseText}
            </div>
        </div>
    );
}

export default MarqueeTitle;



