import "../customized/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../services/httpHelpers";
import { marketTable } from "../tables/Columns";
import MarketTable from "../tables/MarketTable";
import TableTitle from "../customized/TableTitle";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../actions/message";
import { MARKET_STATUS_BLOCKED, MARKET_STATUS_UNBLOCKED } from "../../common/constants";
import TokenService from "../../services/token-service";

export default function BlockMarket({ logout, child, hideTitle }) {
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive breakpoint
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mediaQuery.matches);

        const handleResize = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handleResize);
        
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    const user = TokenService.getUser();
    let userId = user.userId;

    if (child)
        userId = child.userId;
    const [successMessage, setSuccessMessage] = useState();
    const [successful, setSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();
    let getMarkets = "beta/getSupportedSports?userId=";
    const api = httpHelpers();
    const [markets, setMarkets] = useState([]);

    const fetchMarkets = () => {
        if (isLoading) return; // Prevent multiple simultaneous calls
        
        setIsLoading(true);
        api
            .get(`${getMarkets}` + userId)
            .then(res => {
                console.log("get markets res", res);
                if (res && res.data) {
                    setMarkets(res.data);
                } else {
                    setMarkets([]);
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        dispatch(clearMessage());
        fetchMarkets();
    }, []);

    // Remove the problematic useEffect that was causing multiple API calls
    // useEffect(() => {
    //     fetchMarkets();
    // }, [successful]);

    const handleMarket = (sportType, state) => {
        if (isLoading) return; // Prevent multiple simultaneous calls
        
        setSuccessful(false);
        dispatch(clearMessage());
        console.log("handle market state", sportType, state);
        let blockUnblock = MARKET_STATUS_BLOCKED;
        let blockUnblockUrl = "beta/blockSport?sportType=";
        if (state) {
            blockUnblock = MARKET_STATUS_UNBLOCKED;
            blockUnblockUrl = "beta/unblockSport?sportType=";
        }
        
        setIsLoading(true);
        api
            .get(`${blockUnblockUrl}` + sportType + "&userId=" + userId)
            .then(res => {
                console.log("block markets res", res);
                if (res && res.status === 200) {
                    setSuccessMessage(sportType + " " + blockUnblock + " Successfully!");
                    setSuccessful(true);
                    // Fetch markets again only after successful operation
                    setTimeout(() => {
                        fetchMarkets();
                    }, 500);
                } else {
                    setSuccessful(false);
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div style={{ width: "100%" }}>
            <div style={{ width: "100%" }}>
                {/* <TableHeader title={"Market List"} minWidth={"100px"} /> */}
                {(message || successful) && (
                    <div className="form-group" style={{ 
                        marginTop: isMobile ? "8px" : "10px", 
                        paddingLeft: isMobile ? "3px" : "5px", 
                        paddingRight: isMobile ? "3px" : "5px" 
                    }}>
                        <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                            {message ? message : (successMessage)}
                        </div>
                    </div>
                )}
                
                {isLoading && (
                    <div className="form-group" style={{ 
                        marginTop: isMobile ? "8px" : "10px", 
                        paddingLeft: isMobile ? "3px" : "5px", 
                        paddingRight: isMobile ? "3px" : "5px" 
                    }}>
                        <div className="alert alert-info" role="alert">
                            Processing... Please wait.
                        </div>
                    </div>
                )}
                
                {!hideTitle && <TableTitle
                    text="Sports List"
                    color="#ffffff"
                    fontSize={isMobile ? "20px" : "24px"}
                    textAlign="left"
                    width={isMobile ? "98%" : "99.2%"}
                    height={isMobile ? "50px" : "66px"}
                />}
               
                <MarketTable 
                    columns={marketTable} 
                    data={markets} 
                    onCheckBoxClick={handleMarket} 
                    hideTitle={hideTitle} 
                    userId={userId}
                />
            </div>
        </div>
    );
};
