import { format } from 'date-fns';
import { utils as XLSXUtils, write as XLSXWrite } from 'xlsx';

export const useExportExcel = () => {
    const exportToExcel = ({
        data,
        fileName,
        sheetName = 'Sheet1',
        mapper
    }) => {
        try {
            // Chuyển đổi dữ liệu theo mapper function
            const exportData = data.map(mapper);

            // Tạo worksheet
            const ws = XLSXUtils.json_to_sheet(exportData);

            // Tạo workbook
            const wb = XLSXUtils.book_new();
            XLSXUtils.book_append_sheet(wb, ws, sheetName);

            // Tạo file Excel
            const excelBuffer = XLSXWrite(wb, { bookType: 'xlsx', type: 'array' });

            // Tạo và tải file
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
            link.click();
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Export error:', error);
            return false;
        }
    };

    return { exportToExcel };
};