import meloLoguito from '../images/MeloLoguito.png';

export const Footer = () => {
  return (
    <footer className="footerClass">
      <div className="footerContainer">
        <span className="footerText">
          &copy; Melo - 2023
        </span>
        {/* <img className="logo" src={meloLoguito} alt='' width="60px" /> */}
      </div>
    </footer>
  );
};

export default Footer;
