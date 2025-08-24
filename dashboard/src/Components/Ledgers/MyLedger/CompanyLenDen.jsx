import "../../customized/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../../services/httpHelpers";
import { useLocation, useParams } from 'react-router-dom';
import DateRangePicker from "../../tables/DateRangePicker";
import { agentLedger } from "../../tables/Columns";
import TableTitle from "../../customized/TableTitle";
import CompanyLenDenTable from "../../tables/CompanyLenDenTable";
import ExportButton from "../../customized/ExportButton";
import { exportToPDF } from "../../customized/pdfExports";

export default function CompanyLenDen({ logout, isSmallScreen }) {
    const [offset, setOffset] = useState(0);
    const [limit] = useState(100);

    const { uid } = useParams();
    const href = window.location.href;
    let ledgerType = null;
    let showAsLink = true;
    if (href.includes("matchledger")) {
        ledgerType = "MATCH";
    }

    let getCompanyLenDen = "beta/companyLenDen?" + "offset=" + offset + "&limit=" + limit;
    if (ledgerType === "MATCH") {
        getCompanyLenDen = getCompanyLenDen + "&ledgerType=" + ledgerType;
        showAsLink = false;
    }
    if (uid) {
        getCompanyLenDen = getCompanyLenDen + "&agentId=" + uid;
        showAsLink = false;
    }
    const api = httpHelpers();
    const [ledgers, setLedgers] = useState([]);
    const [sportType] = useState("cricket");
    const [locationChange, setLocationChange] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchCompanyLenDen = (startDate, endDate) => {
        if (!startDate || !endDate) {
            startDate = "";
            endDate = "";
        } else if (startDate && endDate) {
            setStartDate(startDate);
            setEndDate(endDate);
        }
        api
            .get(`${getCompanyLenDen}` + "&startDate=" + startDate + "&endDate=" + endDate)
            .then(res => {
                console.log("ledgers res", res);
                if (res && res.data && res.data.length > 0) {
                    setLedgers(res.data);
                } else {
                    if (offset > 0) {
                        setOffset(offset - 1);
                        return;
                    }
                    setLedgers([]);
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

    const location = useLocation();

    useEffect(() => {
        setLocationChange(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (startDate && endDate) {
            fetchCompanyLenDen(startDate, endDate);
        }
        // Set up a timer to fetch the balance every 5 seconds
        const intervalId = setInterval(() => {
            if (startDate && endDate) {
                fetchCompanyLenDen(startDate, endDate);
            }
        }, 5000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [startDate, endDate, offset]);

    // PDF export columns for agent ledger
    const pdfColumns = [
        { Header: 'DATE/TIME', accessor: 'date' },
        { Header: 'GameId', accessor: 'entryId' },
        { Header: 'Collection Name', accessor: 'entry' },
        { Header: 'DEBIT', accessor: 'debit' },
        { Header: 'CREDIT', accessor: 'credit' },
        { Header: 'Balance', accessor: 'balance' },
        { Header: 'Note', accessor: 'note' },
    ];

    const handleExportPDF = () => {
        console.log('handleExportPDF called');
        console.log('ledgers:', ledgers);
        console.log('ledgers length:', ledgers ? ledgers.length : 0);
        console.log('pdfColumns:', pdfColumns);
        
        if (ledgers && ledgers.length > 0) {
            try {
                exportToPDF("Agent Ledger", ledgers, pdfColumns);
                console.log('PDF export completed successfully');
            } catch (error) {
                console.error('Error exporting PDF:', error);
            }
        } else {
            console.log('No data to export or ledgers is empty');
        }
    };

    return (
        <div className="entity-ledger-root">
            <div className="date-range-presets-picker-container">
                <DateRangePicker fetchStatement={fetchCompanyLenDen} isSmallScreen={isSmallScreen} fetchLast7DaysOnLoad={true} locationChange={locationChange} />

            </div>
            <div className="entity-ledger-root">    
                <TableTitle
                    text="Agent Ledger"
                    color="#ffffff"
                    fontSize="14px"
                    textAlign="left"
                    width={isSmallScreen ? "98.2%" : "100%"}
                    height="46px"
                    marginLeft="0px"
                    paddingLeft="10px"
                    exportButton={<ExportButton onClick={handleExportPDF} disabled={!ledgers || ledgers.length === 0} />}
                />
                <CompanyLenDenTable columns={agentLedger} data={ledgers} tableHeader={"Agent Ledger"} sport={sportType} showAsLink={showAsLink} />
                <div className="company-len-den-pagination">
                    <button
                        onClick={() => setOffset(offset - 1)}
                        disabled={offset === 0}
                        className="company-len-den-pagination-button"
                        style={{
                            backgroundColor: offset === 0 ? '#f8f9fa' : '#3f4d67',
                            color: offset === 0 ? '#6c757d' : '#fff',
                            border: '1px solid #ced4da',
                            padding: isSmallScreen ? '6px 12px' : '8px 16px',
                            fontSize: isSmallScreen ? '12px' : '13px',
                            borderRadius: '6px',
                            cursor: offset === 0 ? 'not-allowed' : 'pointer',
                            opacity: offset === 0 ? 0.6 : 1,
                            transition: 'all 0.2s ease-in-out',
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            fontWeight: '500',
                            minWidth: isSmallScreen ? '60px' : '80px'
                        }}
                    >
                        {isSmallScreen ? '← Prev' : '← Previous'}
                    </button>

                    {/* Page Indicator */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isSmallScreen ? '4px' : '8px',
                        margin: isSmallScreen ? '0 8px' : '0 20px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {offset > 0 && (
                            <button
                                style={{ 
                                    backgroundColor: '#e9ecef', 
                                    padding: isSmallScreen ? '6px 8px' : '8px 12px', 
                                    borderRadius: '6px', 
                                    fontSize: isSmallScreen ? '11px' : '13px', 
                                    color: '#495057', 
                                    margin: 0,
                                    border: '1px solid #ced4da',
                                    cursor: 'pointer',
                                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease-in-out',
                                    minWidth: isSmallScreen ? '28px' : '40px'
                                }}
                                onClick={() => setOffset(offset - 1)}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#dee2e6';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#e9ecef';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                {offset}
                            </button>
                        )}

                        <span
                            style={{
                                backgroundColor: '#3f4d67',
                                color: '#fff',
                                padding: isSmallScreen ? '6px 8px' : '8px 12px',
                                borderRadius: '6px',
                                fontSize: isSmallScreen ? '11px' : '13px',
                                fontWeight: '600',
                                margin: 0,
                                border: '1px solid #0056b3',
                                boxShadow: '0 2px 4px rgba(0, 123, 255, 0.3)',
                                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                minWidth: isSmallScreen ? '28px' : '40px',
                                textAlign: 'center'
                            }}>
                            {offset + 1}
                        </span>

                        {ledgers.length >= limit && (
                            <button
                                style={{ 
                                    backgroundColor: '#e9ecef', 
                                    padding: isSmallScreen ? '6px 8px' : '8px 12px', 
                                    borderRadius: '6px', 
                                    fontSize: isSmallScreen ? '11px' : '13px', 
                                    color: '#495057', 
                                    margin: 0,
                                    border: '1px solid #ced4da',
                                    cursor: 'pointer',
                                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease-in-out',
                                    minWidth: isSmallScreen ? '28px' : '40px'
                                }}
                                onClick={() => setOffset(offset + 1)}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#dee2e6';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#e9ecef';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                {offset + 2}
                            </button>
                        )}
                        
                        {ledgers.length >= limit && (
                            <span 
                                style={{ 
                                    backgroundColor: '#f8f9fa', 
                                    padding: isSmallScreen ? '6px 6px' : '8px 8px', 
                                    borderRadius: '6px', 
                                    fontSize: isSmallScreen ? '11px' : '13px', 
                                    color: '#6c757d', 
                                    margin: 0,
                                    border: '1px solid #dee2e6',
                                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                    fontWeight: '600'
                                }}>
                                ...
                            </span>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setOffset(offset + 1)}
                        disabled={ledgers.length < limit}
                        className="company-len-den-pagination-button"
                        style={{
                            backgroundColor: ledgers.length < limit ? '#f8f9fa' : '#007bff',
                            color: ledgers.length < limit ? '#6c757d' : '#fff',
                            border: '1px solid #ced4da',
                            padding: isSmallScreen ? '6px 12px' : '8px 16px',
                            fontSize: isSmallScreen ? '12px' : '13px',
                            borderRadius: '6px',
                            cursor: ledgers.length < limit ? 'not-allowed' : 'pointer',
                            opacity: ledgers.length < limit ? 0.6 : 1,
                            transition: 'all 0.2s ease-in-out',
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            fontWeight: '500',
                            minWidth: isSmallScreen ? '60px' : '80px'
                        }}
                    >
                        {isSmallScreen ? 'Next →' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
};
