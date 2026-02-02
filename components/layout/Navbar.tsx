"use client";

import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";

import styles from "./Navbar.module.css";

interface NavbarProps {
    user: {
        id: string;
        email?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        picture?: string | null;
    } | null;
    role?: string | null;
}

/**
 * Responsive Navbar component.
 * Renders DesktopNavbar (hidden on mobile) and MobileNavbar (hidden on desktop).
 */
export function Navbar({ user, role }: NavbarProps) {
    return (
        <>
            {/* Desktop Navbar - hidden below 768px */}
            <div className={styles.desktopContainer}>
                <DesktopNavbar user={user} role={role} />
            </div>

            {/* Mobile Navbar - hidden at 768px and above */}
            <div className={styles.mobileContainer}>
                <MobileNavbar user={user} />
            </div>
        </>
    );
}
