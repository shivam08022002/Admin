import LadderTable from "../../tables/LadderTable";

const LadderPopup = ({ ladder, closeLadderPopup }) => {

    const runs = Object.keys(ladder);
    const positions = Object.values(ladder);

    return (
        <div className="ladder-popup-container">
            <div className="ladder-popup-header">
                &nbsp;&nbsp;Session Book
                <button className="ladder-popup-x-button" onClick={(e) => closeLadderPopup(e)}>X</button>
            </div>
            <div className="ladder-popup-body">
                {ladder && <LadderTable runs={runs} positions={positions} />}
            </div>
        </div>
    );
};

export default LadderPopup;