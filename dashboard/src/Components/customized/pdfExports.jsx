import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (title, data, columns, total) => {
    try {
        console.log('exportToPDF called with:', { title, dataLength: data?.length, columns, total });
        
        if (!data || data.length === 0) {
            console.error('No data provided for PDF export');
            alert('No data available to export');
            return;
        }

        if (!columns || columns.length === 0) {
            console.error('No columns provided for PDF export');
            alert('No columns defined for export');
            return;
        }

        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 22);
        
        // Add timestamp
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 14, 30);
        
        // Prepare table data
        const tableData = data.map((row) => {
            return columns.map(col => {
                if (col.accessor) {
                    const value = row[col.accessor];
                    // Handle different data types
                    if (typeof value === 'number') {
                        return value.toFixed(2);
                    }
                    return value !== undefined && value !== null ? String(value) : '';
                }
                return '';
            });
        });
        
        console.log('Table data prepared:', tableData);
        
        // Add total row if provided
        if (total) {
            console.log('Adding total row:', total);
            const totalRow = columns.map(col => {
                if (col.accessor === 'amount' || col.accessor === 'balance' || col.accessor === 'debit' || col.accessor === 'credit') {
                    const totalValue = total[col.accessor];
                    return totalValue !== undefined && totalValue !== null ? String(totalValue) : '';
                }
                return col.accessor === 'name' ? 'TOTAL' : '';
            });
            tableData.push(totalRow);
        }
        
        // Get column headers
        const headers = columns.map(col => col.Header || col.accessor);
        console.log('Headers:', headers);
        
        // Generate table
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 40,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [31, 171, 181], // #1fabb5
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { top: 40 },
        });
        
        // Save the PDF
        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        console.log('Saving PDF as:', fileName);
        doc.save(fileName);
        
        console.log('PDF export completed successfully');
    } catch (error) {
        console.error('Error in exportToPDF:', error);
        alert(`Error exporting PDF: ${error.message}`);
        throw error;
    }
}; 