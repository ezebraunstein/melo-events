export default function Hamburger({ isOpen, onClick }) {
    return (
        <>
            <div className="hamburger" onClick={onClick}>
                <div className="burger burger1" />
                <div className="burger burger2" />
                <div className="burger burger3" />
            </div>

            <style jsx>{`
                .hamburger{
                    width: 4rem;
                    height: 4rem;
                    display: flex;
                    justify-content: space-around;
                    flex-flow: column nowrap;
                    z-index: 10;
                    right: 50px;
                }

                .burger{
                    width: 4rem;
                    height: 0.50rem;
                    border-radius: 10px;
                    background-color: #EAFF1A;
                    transform-origin: 1px;
                    transition: all 0.3s linear;
                }

                .burger1{
                    transform: ${isOpen ? 'rotate(45deg)' : 'rotate(0)'};
                }
                .burger2{
                    transform: ${isOpen ? 'translateX(100%)' : 'translateX(0)'};
                    opacity: ${isOpen ? 0 : 1};
                }
                .burger3{
                    transform: ${isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
                }

                
            `}</style>
        </>
    )
}