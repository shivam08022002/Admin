import React from "react";
import './UserInfo.css'; // Import the updated CSS

function UserInfo({ columns, userInfo }) {

    return (
        <table className="user-info-table">
            <tbody>
                {columns.map((column, index) => (
                    <tr key={column}>
                        <td className="field-column">{column}</td>
                        {index == 0 && <td className="value-column">{userInfo.id}</td>}
                        {index == 1 && <td className="value-column">{userInfo.displayName}</td>}
                        {index == 2 && <td className="value-column">{userInfo.userId}</td>}
                        {index == 3 && <td className="value-column">{userInfo.firstName} {userInfo.lastName}</td>}
                        {index == 4 && <td className="value-column">{userInfo.initialBalance}</td>}
                        {index == 5 && <td className="value-column">{userInfo.balance}</td>}
                        {index == 6 && <td className="value-column">{userInfo.exposure}</td>}
                        {index == 7 && <td className="value-column">{userInfo.unsettledBalance}</td>}
                        {index == 8 && <td className="value-column">{userInfo.matchCommission}</td>}
                        {index == 9 && <td className="value-column">{userInfo.sessionCommission}</td>}
                        {index == 10 && <td className="value-column">{userInfo.share}</td>}
                        {index == 11 && <td className="value-column">{userInfo.subTreeSize}</td>}
                        {index == 12 && <td className="value-column">{userInfo.parentId}</td>}
                        {index == 13 && <td className="value-column">{userInfo.accountStatus}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default UserInfo;
