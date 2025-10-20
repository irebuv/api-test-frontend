import { AnimatePresence, motion } from 'framer-motion';
import NavLinksShiki from '@/components/Shiki/Header/NavLinks';

type MobileMenuProps = {
    open: boolean
    onClose: () => void
}
function MobileMenuShiki({ open, onClose }: MobileMenuProps) {
    return (

        <AnimatePresence>
            {open && (
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white shadow-md px-6 py-4 space-y-4 font-medium text-gray-700"
                >
                    <NavLinksShiki onClick={onClose} />
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

export default MobileMenuShiki;
