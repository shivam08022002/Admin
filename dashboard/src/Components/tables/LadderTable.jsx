import './LadderTable.css';

const LadderTable = ({ runs, positions }) => {
    console.log("ladder", runs, positions);
    return (
        <div className="ladder-table-root">
            <div>
                <table className="ladder-table">
                    <thead>
                        <tr>
                            <th className="ladder-table-th-small">Run</th>
                            <th className="ladder-table-th-small">Position</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div>
                <table className="ladder-table">
                    <tbody>
                        {runs && runs.map((run, index) => (
                            <tr>
                                <td className="ladder-table-td-small">{run}</td>
                                {positions[index] && positions[index] < 0 && <td className="ladder-table-td-small-red">{positions[index].toFixed(1)}</td>}
                                {positions[index] && positions[index] >= 0 && <td className="ladder-table-td-small-green">{positions[index].toFixed(1)}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LadderTable;