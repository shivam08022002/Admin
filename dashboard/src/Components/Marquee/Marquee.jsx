import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { httpHelpers } from '../../services/httpHelpers';
import './Marquee.css';

const Marquee = ({ logout }) => {
    const [bannerMessage, setBannerMessage] = useState('');
    const api = httpHelpers();

    const fetchBannerMessage = () => {
        api.get('alpha/getGlobalProperty/agentBannerMessage')
            .then(res => {
                console.log("get banner message res", res);
                if (res && res.data) {
                    setBannerMessage(res.data);
                } else {
                    setBannerMessage(res || '');
                }
            })
            .catch(err => {
                console.log("error error", err);
                if (err) {
                    if (err.data) {
                        if (err.data.status && err.data.status === 401) {
                            logout();
                        }
                    } else if (err.response) {
                        if (err.response.status && err.response.status === 401) {
                            logout();
                        }
                    }
                }
            });
    };

    useEffect(() => {
        fetchBannerMessage();
        // Refresh banner message every 5 minutes
        const interval = setInterval(fetchBannerMessage, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (!bannerMessage) {
        return null;
    }

    return (
        <div className="marquee-container">
            <marquee 
                className="marquee-element"
                direction="left" 
                loop=""
                bgcolor="#169AAF"
            >
                <div className="marquee-content">
                    {bannerMessage}
                </div>
            </marquee>
        </div>
    );
};

Marquee.propTypes = {
    logout: PropTypes.func.isRequired
};

export default Marquee;
