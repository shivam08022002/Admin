import { DEPOSIT_COINS, WITHDRAW_COINS } from "../../common/constants.jsx";
import { convertToIndianWords, capitalizeEachWord } from "../../common/utils.js";

const ConfirmationPopup = ({ userId, action, amount, closeConfirmationPopup, handleSubmit }) => {

    let actionType = "WITHDRAW";
    let numberText = capitalizeEachWord(convertToIndianWords(amount));
    let toFrom = " from ";
    if (action === DEPOSIT_COINS) {
        actionType = "DEPOSIT";
        toFrom = " in ";
    }

    return (
        <div className="cric-agent-actions-notification-popup-container">
            <div className="agent-notification-popup-header">
                Confirm {actionType}
            </div>
            <div className="agent-notification-popup-body" style={{ fontSize: "14px" }}>
                <label>{actionType}</label>&nbsp;<label style={{ fontWeight: "700", fontSize: "16px" }}>{numberText}</label>&nbsp;<label>{toFrom}</label> {userId} ?
            </div>
            <div className="agent-notification-popup-separator"></div>
            <div className="agent-notification-popup-close-button">
                <button className="board-buttons board-buttons-nav-bar-dark-small" style={{ background: "#1fabb5" }} onClick={(e) => handleSubmit(e)}>OK</button>
                <button className="board-buttons board-buttons-nav-bar-dark-small" style={{ background: "#E34234" }} onClick={(e) => closeConfirmationPopup(e)}>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmationPopup;