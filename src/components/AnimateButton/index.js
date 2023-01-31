import { useState } from 'react';
import './style.scss';

const AnimateButton = (props) => {
    const [iconNum, setIconNum] = useState(0);
    const [timer, setTimer] = useState(null);
    const iconGroup = [
        <img src="../../assets/images/Star-1.png" alt="" />,
        <img src="../../assets/images/heart.png" alt="" />,
        <img src="../../assets/images/spade.png" alt="" />,
        <img src="../../assets/images/diamond.png" alt="" />,
        <img src="../../assets/images/club.png" alt="" />,
    ];
    const handleMouseEnter = () => {
        setTimer(setInterval(() => {
            setIconNum((prev) => {
                if (prev >= 4) { clearInterval(timer); setIconNum(0); }
                return prev + 1;
            });
        }, 300));
    };
    const handleMouseLeave = () => {
        clearInterval(timer);
        setTimer(null);
        setIconNum(0);
    }
    return (
        <div className="btn_animate" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="btn-icon-group">
                {iconGroup[iconNum]}
            </div>
            {props.children}
        </div>
    );
};

export default AnimateButton;