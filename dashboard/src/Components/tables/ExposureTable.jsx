import React from 'react';
import './ExposureTable.css';

const ExposureTable = ({ exposure }) => {
    console.log("exposure", exposure);
    return (
        <div className="exposure-table-root">
            <div>
                <table className="exposure-table" cellpadding="0" cellspacing="0" border="0">
                    <thead>
                        <tr>
                            <th className="exposure-table-th-medium">Match Name</th>
                            <th className="exposure-table-th-big">Market / Fancy Name</th>
                            <th className="exposure-table-th-small">Exposure</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div>
                <table className="exposure-table" cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        {exposure && exposure.map((bet, index) => (
                            <tr>
                                <td className="exposure-table-td-medium">{bet.matchName}</td>
                                <td className="exposure-table-td-big">{bet.marketName}</td>
                                <td className="exposure-table-td-small">{bet.exposure}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExposureTable;