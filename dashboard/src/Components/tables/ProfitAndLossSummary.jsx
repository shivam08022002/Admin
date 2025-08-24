import React from 'react';
import './ProfitAndLossTable.css';

const ProfitAndLossSummary = ({ allTimeTotal }) => {

    return (
        <div className="matches-table-root">
            <table className="summary-table-custom">
                <thead>
                    <tr>
                        <th className="summary-table-header-cell-grey" >All Time Total</th>
                        <th className="summary-table-header-cell-grey" >{allTimeTotal}</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
};

export default ProfitAndLossSummary;