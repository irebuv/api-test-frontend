import React from "react";
import {Link} from "react-router-dom";

type NavLink = {
    title: string
    href: string
}

type NavLinksProps = {
    onClick?: () => void;
    linksNav: NavLink[];
}

function NavLinks({onClick, linksNav}: NavLinksProps) {

    return (
        <div className=" gap-3 ">

                {linksNav.map(link => (
                    <Link
                        key={link.title}
                        to={link.href}
                        onClick={onClick}
                        className="block hover:text-blue-600 transition"
                    >
                        {link.title}
                    </Link>
                ))}
        </div>
    );
}

export default NavLinks;
