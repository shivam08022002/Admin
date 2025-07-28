const Footer = ({ role }) => {
    const siteName = "STUMPEXCH7";
    const agentType = role || "Admin";

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4 px-6">
            <div className="container mx-auto flex justify-between items-center text-sm">
                <div className="flex items-center space-x-1">
                    <b>{siteName}</b>
                    <span>|</span>
                    <span>Powered By <b>{siteName} Gaming</b></span>
                    <span>|</span>
                    <span>Copyright © 2024-2025</span>
                </div>
                <div className="flex items-center">
                    <span>{agentType} Panel</span>
                    <span className="ml-1"><b>v1.0.0</b></span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
