import React, {useState, useEffect} from 'react'
import { Nav, 
    NavbarContainer, 
    NavLogo, 
    NavIcon, 
    HamburgerIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavItemBtn,
    NavBtnLink
 } from './Navbar.elements'
import { FaTimes, FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib'
import { Button } from '../../globalStyles';


function Navbar() {

    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const [homeclick, setHomeClick] = useState(false);
    const [servicesclick, setServicesClick] = useState(false);
    const [productsclick, setProductsClick] = useState(false);
    const [infoclick, setinfoClick] = useState(false);


    const handleHomeClick = () => {
        setHomeClick(true);
        setProductsClick(false);
        setServicesClick(false);
        setinfoClick(false);

    }
    const handleServicesClick = () => {
        setHomeClick(false);
        setProductsClick(false);
        setServicesClick(true);
        setinfoClick(false);
    }
    const handleProductsClick = () => {
        setHomeClick(false);
        setProductsClick(true);
        setServicesClick(false);
        setinfoClick(false);
    }
    const handleinfoClick = () => {
        setinfoClick(true);
        setHomeClick(false);
        setProductsClick(true);
        setServicesClick(false);
    }

    const handleClick = () =>  setClick(!click);
    
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        // so if the screensize is <= 960px then set button state to false
        if(window.innerWidth <= 960) {
            setButton(false)
        } else {
            setButton(true)
        }
    }

    useEffect(() => {
        showButton();
    }, [])

    window.addEventListener('resize', showButton);

    return (
        <>
        <IconContext.Provider value={{ color: '#fff' }}>
            <Nav>
                <NavbarContainer>
                    <NavLogo to='/'> 
                        <NavIcon />
                            Masters
                    </NavLogo>
                    <HamburgerIcon onClick={handleClick}>
                        {click ? <FaTimes /> : <FaBars />}
                    </HamburgerIcon>
                    <NavMenu onClick={handleClick} click={click} >
                        <NavItem onClick={handleHomeClick} homeClick={homeclick}>
                            <NavLinks to='/' onClick={closeMobileMenu}>
                                Home
                            </NavLinks>
                        </NavItem>

                        <NavItem onClick={handleProductsClick} productsClick={productsclick}>
                            <NavLinks to='/Products' onClick={closeMobileMenu}>
                                About
                            </NavLinks>
                        </NavItem>

                        <NavItem onClick={handleServicesClick} servicesClick={servicesclick}>
                            <NavLinks to='/services' onClick={closeMobileMenu}>
                                Master Programs
                            </NavLinks>
                        </NavItem>
                    
                        <NavItem onClick={handleinfoClick} infoClick={infoclick}>
                            <NavLinks to='/info' onClick={closeMobileMenu}>
                                Cantact
                            </NavLinks>
                        </NavItem>
                        <NavItemBtn >
                            {button ? (
                                <NavBtnLink to='/login'>
                                    <Button primary>SIGN UP</Button>
                                </NavBtnLink>
                            ) : (
                                <NavBtnLink to='/login'>
                                    <Button onClick={closeMobileMenu} fontBig primary>SIGN UP</Button>
                                </NavBtnLink>
                            )}
                            
                        </NavItemBtn>
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </IconContext.Provider>    
        </>
    )
}

export default Navbar