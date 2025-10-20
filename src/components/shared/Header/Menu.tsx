import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import NavLinks from "@/components/shared/Header/NavLinks";
import {useAuth} from "@/context/AuthContext";

type NavLink = {
    title: string
    href: string
}

type MenuHeaderProps = {
    linksNav: NavLink[];
    hasLogout?: boolean;
    title?: string;
}
function MenuHeader({ linksNav, hasLogout, title } : MenuHeaderProps  ) {
    const {user, logout} = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    return (
        <div className="relative">
            <button
                className="cursor-pointer focus:outline-none"
                onClick={() => {
                    setProfileOpen(!profileOpen);
                }}
            >
                <div className="flex">{title ? title : "Menu"} {profileOpen ? <X className="h-7 w-7 text-gray-700" /> : <Menu className="h-7 w-7 text-gray-700" />}</div>
            </button>
            <div className="absolute left-[-50%] flex space-x-8 font-medium text-gray-700">
                <AnimatePresence>
                    {profileOpen && (
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 bg-white px-6 py-4 font-medium text-gray-700 shadow-md"
                        >
                            <NavLinks linksNav={linksNav} />
                            {(user && hasLogout) && (
                                <button className={'cursor-pointer'} onClick={logout}>
                                    Logout
                                </button>
                            )}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default MenuHeader;
