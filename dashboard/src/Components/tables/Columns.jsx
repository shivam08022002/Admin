// src/tablePresets.js
export const columnsPreset1 = ['Name', 'Age', 'Email', 'Country', 'Occupation', 'Status'];
export const dataPreset1 = [
    { Name: 'John Doe', Age: 28, Email: 'john.doe@example.com', Country: 'USA', Occupation: 'Developer', Status: 'Active' },
    { Name: 'Jane Smith', Age: 34, Email: 'jane.smith@example.com', Country: 'Canada', Occupation: 'Designer', Status: 'Inactive' },
    // Add 50 more rows with similar structure...
    ...Array.from({ length: 50 }, (_, index) => ({
        Name: `Person ${index + 1}`,
        Age: Math.floor(Math.random() * 50) + 20,
        Email: `person${index + 1}@example.com`,
        Country: 'Country',
        Occupation: 'Occupation',
        Status: 'Status',
    })),
];

export const allMatches = ["ID", "PID", "Title", "Sport", "Date", "Profit / Loss"];
export const completedMatches = ["ID", "PID", "Title", "Sport", "Date", "Won By", "Profit / Loss"];
export const allSeries = ["ID", "CID", "Title", "Date"];
export const myDownline = ['User Name', 'Name', 'Initial Balance', 'My Share', 'Max Share', "Actions"]
export const collectionReport = ["Client", "Balance"];
export const agentLedger = ["DATE/TIME", "GameId", "Collection Name", "DEBIT", "CREDIT", "Balance", "Note"];
export const clientLedger = ["DATE/TIME", "Collection Name", "DEBIT", "CREDIT", "Balance", "Note"];
export const commisionLimits = ["DATE/TIME", "Collection Name", "DEBIT", "CREDIT", "Balance", "Note"];
export const summaryTable = ["My Balance", "Down Line Balance", "Rs. Exposure"];
export const statementTable = ["Date", "Description", "Aya", "Gya", "Com+", "Com-", "Limit"];
export const marketTable = ["S No", "Name", "Status", "Action"];
export const betHistoryTable = ["DATE/TIME", "Match Name", "BET", "Type", "Candidate", "RUN", "RATE", "Amount"];
export const userInfoTable = ["ID", "User Name", "User Id", "Name", "Initial Balance", "Balance", "Exposure", "Unsettled Balance", "Match Comm.", "Session Comm.", "Share", "My Tree Size", "Agent Under", "Status"];
export const collectionReportMatch = ["Client Name", "Current Balance"];
export const profitAndLoss = ["DATE/TIME", "Match Id", "Match Title", "Match Earnings", "Commission Earnings", "Total Earnings"];
export const clientMatchReport = ["User Name", "Match Plus Minus", "Session Plus Minus", "Total", "Match Commission", "Session Commission", "Total Commission", "Net", "Agent Share", "Final"];
export const sessionEarningReport = ["CLIENT NAME", "SESSION", "Commission", "Total", "SHR AMT", "Final"];
export const companyReport = ["Client Name", "Match Plus Minus", "Session Plus Minus", "Total", "Ses. Stake", "Match Commission", "Session Commission", "Total Commission", "System Plus/Minus", "Final", "% Share", "My Share", "Company Share"];

export const csvPdfHeaders = [
    { label: 'ID', key: 'col1' },
    { label: 'User Name', key: 'col2' },
    { label: 'Name', key: 'col3' },
    { label: 'Initial Balance', key: 'col4' },
    { label: 'My Share', key: 'col5' },
    { label: 'Max Share', key: 'col6' },
    { label: 'iCasino Enabled', key: 'col7' },
    { label: 'iCasino Share', key: 'col8' }
]