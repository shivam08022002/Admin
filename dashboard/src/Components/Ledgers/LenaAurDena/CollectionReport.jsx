import { useState, useEffect } from "react";
import { httpHelpers } from "../../../services/httpHelpers";
import "rsuite/dist/rsuite.min.css";
import { collectionReport } from '../../tables/Columns';
import ExportButton from "../../customized/ExportButton";
import { exportToPDF } from "../../customized/pdfExports";
import CollectionReportTable from "../../tables/CollectionReportTable";
import "./CollectionReport.css";

export default function CollectionReport({ logout}) {

    const getCollectionReport = "beta/getCollectionReport";
    const api = httpHelpers();
    const [paying, setPaying] = useState(null);
    const [receiving, setReceiving] = useState(null);
    const [clear, setClear] = useState(null);
    const [payingTotal, setPayingTotal] = useState(null);
    const [receivingTotal, setReceivingTotal] = useState(null);
    const [clearTotal, setClearTotal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCollectionReport = () => {
        setIsLoading(true);
        api
            .get(`${getCollectionReport}`)
            .then(res => {
                console.log("collection report", res);
                if (res && res.data) {
                    setPaying(res.data.paying);
                    setReceiving(res.data.receiving);
                    setClear(res.data.clear);
                    setPayingTotal(res.data.payingTotal)
                    setReceivingTotal(res.data.receivingTotal)
                    setClearTotal(res.data.clearTotal)
                } else {
                    setPaying(null);
                    setReceiving(null);
                    setClear(null);
                    setPayingTotal(null);
                    setReceivingTotal(null);
                    setClearTotal(null);
                }
                setIsLoading(false);
            })

            .catch(err => {
                setIsLoading(false);
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
        fetchCollectionReport();
    }, []);

    // Format currency for display
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "0.00";
        return parseFloat(value).toFixed(2);
    };

    // Define columns for PDF export
    const pdfColumns = [
        { Header: 'Client', accessor: 'name' },
        { Header: 'Balance', accessor: 'balance' }
    ];

    const handleExportReceiving = () => {
        console.log('handleExportReceiving called');
        console.log('receiving:', receiving);
        console.log('receiving length:', receiving ? receiving.length : 0);
        
        if (receiving && receiving.length > 0) {
            try {
                exportToPDF("PAYMENT RECEIVING FROM (Lena Hai)", receiving, pdfColumns, receivingTotal);
                console.log('Receiving PDF export completed successfully');
            } catch (error) {
                console.error('Error exporting receiving PDF:', error);
            }
        } else {
            console.log('No receiving data to export');
        }
    };

    const handleExportPaying = () => {
        console.log('handleExportPaying called');
        console.log('paying:', paying);
        console.log('paying length:', paying ? paying.length : 0);
        
        if (paying && paying.length > 0) {
            try {
                exportToPDF("PAYMENT PAID TO (Dena Hai)", paying, pdfColumns, payingTotal);
                console.log('Paying PDF export completed successfully');
            } catch (error) {
                console.error('Error exporting paying PDF:', error);
            }
        } else {
            console.log('No paying data to export');
        }
    };

    const handleExportClear = () => {
        console.log('handleExportClear called');
        console.log('clear:', clear);
        console.log('clear length:', clear ? clear.length : 0);
        
        if (clear && clear.length > 0) {
            try {
                exportToPDF("PAYMENT CLEAR (Clear Hai)", clear, pdfColumns, clearTotal);
                console.log('Clear PDF export completed successfully');
            } catch (error) {
                console.error('Error exporting clear PDF:', error);
            }
        } else {
            console.log('No clear data to export');
        }
    };

    return (
        <div className="collection-report-container">
            
            {isLoading ? (
                <div className="collection-loading">Loading...</div>
            ) : (
                <div className="collection-accordion">
                    {/* Receiving Section */}
                    <div className="collection-section">
                        <div className="collection-header-section collection-header-receiving">
                            <div className="collection-title">PAYMENT RECEIVING FROM (Lena Hai)</div>
                            <div className="collection-amount">{formatCurrency(receivingTotal)}</div>
                            <div className="collection-export">
                                <ExportButton 
                                    onClick={handleExportReceiving}
                                    disabled={!receiving || receiving.length === 0}
                                />
                            </div>
                        </div>
                        
                        <div className="collection-content">
                            {receiving && <CollectionReportTable columns={collectionReport} data={receiving} total={receivingTotal} />}
                        </div>
                    </div>

                    {/* Paying Section */}
                    <div className="collection-section">
                        <div className="collection-header-section collection-header-paying">
                            <div className="collection-title">PAYMENT PAID TO (Dena Hai)</div>
                            <div className="collection-amount">{formatCurrency(payingTotal)}</div>
                            <div className="collection-export">
                                <ExportButton 
                                    onClick={handleExportPaying}
                                    disabled={!paying || paying.length === 0}
                                />
                            </div>
                        </div>
                        
                        <div className="collection-content">
                            {paying && <CollectionReportTable columns={collectionReport} data={paying} total={payingTotal} />}
                        </div>
                    </div>

                    {/* Clear Section */}
                    <div className="collection-section">
                        <div className="collection-header-section collection-header-clear">
                            <div className="collection-title">PAYMENT CLEAR (Clear Hai)</div>
                            <div className="collection-amount">{formatCurrency(clearTotal)}</div>
                            <div className="collection-export">
                                <ExportButton 
                                    onClick={handleExportClear}
                                    disabled={!clear || clear.length === 0}
                                />
                            </div>
                        </div>
                        
                        <div className="collection-content">
                            {clear && <CollectionReportTable columns={collectionReport} data={clear} total={clearTotal} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
