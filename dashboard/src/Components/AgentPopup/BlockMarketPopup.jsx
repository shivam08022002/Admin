import BlockMarket from "../BlockMarket/BlockMarket";
import { useState, useEffect } from "react";

export default function BlockMarketPopup({ role, logout, hideTitle, actionChild }) {
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive breakpoint
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mediaQuery.matches);

        const handleResize = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handleResize);
        
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    return (
        <div style={{ 
            minHeight: isMobile ? "300px" : "400px",
            maxHeight: isMobile ? "85vh" : "80vh",
            overflowY: "auto",
            width: "100%"
        }}>
            <BlockMarket 
                role={role} 
                logout={logout} 
                hideTitle={hideTitle} 
                child={actionChild} 
            />
        </div>
    );
};
