import {Input} from '@/components/ui/input';
import {motion} from 'framer-motion';
import React from 'react';
import Logo from "./Logo";
import MenuHeader from "./Menu";
import {Link} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";

function Header() {
    const {user, loading} = useAuth();
    //const [scrolled, setScrolled] = useState(false);
    if (loading) return null;
    type NavLinks = {
        title: string;
        href: string;
    };
    const linksNav: NavLinks[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'Businesses',
            href: '/business',
        },
    ];

    const linksNav2: NavLinks[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'admin',
            href: '/admin',
        },
    ];


    // useEffect(() => {
    //     const handleScroll = () => {
    //         setScrolled(window.scrollY > 0);
    //     };
    //
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    return (
        <motion.header
            initial={{boxShadow: '0px 0px 0px rgba(0,0,0,0)'}}
            //animate={{boxShadow: scrolled ? '0px 4px 6px rgba(0,0,0,0.1)' : '0px 0px 0px rgba(0,0,0,0)'}}
            transition={{duration: 0.3}}
            className="sticky top-0 left-0 z-40 w-full bg-white p-2"
        >
            <div className="grid grid-cols-(--grid-collumns-5-1auto) items-center gap-4 px-7">
                <Logo className={'-mt-2'}/>
                <MenuHeader linksNav={linksNav}/>
                <div className="w-auto px-3 py-3">
                    <Input className={'h-7'}/>
                </div>
                <div className="justify-self-end">
                    а
                </div>
                {user ? (
                    <MenuHeader linksNav={linksNav2} hasLogout={true} title={user.name}/>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </motion.header>
    );
}

export default Header;
