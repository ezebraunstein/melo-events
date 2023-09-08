import melito_black from '../images/melito-black.png';
import melo_black from '../images/melo-black.png';
import melito from '../images/melito.png';
import melo from '../images/melo.png';

const Logo = () => {

    return (
        <div>
            <div>
                <img src={melito_black} alt='melito-black' width='500px' height='500px' />
            </div>
            <div>
                <img src={melo_black} alt='melo-black' width='1000px' height='500px' />
            </div>
            <div>
                <img src={melito} alt='melito' width='500px' height='500px' />
            </div>
            <div>
                <img src={melo} alt='melo' width='1000px' height='500px' />
            </div>
        </div>
    );
};

export default Logo;