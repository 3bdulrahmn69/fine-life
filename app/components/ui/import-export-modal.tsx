'use client';

import { useState } from 'react';
import {
  FiDownload,
  FiUpload,
  FiCalendar,
  FiFilter,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiEye,
} from 'react-icons/fi';
import { format, parseISO, isValid } from 'date-fns';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import Modal from './modal';
import MonthYearNavigator from './month-year-navigator';
import { TransactionType } from '../../types/transaction';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'xlsx'
  ) => Promise<void>;
  onImport?: (transactions: ImportTransaction[]) => Promise<void>;
}

interface ImportTransaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  currency: string;
  notes?: string;
  subcategory?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export default function ImportExportModal({
  isOpen,
  onClose,
  onExport,
  onImport,
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Import/Export states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportTransaction[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');

  // Month navigation functions
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
  };

  // Date normalization function
  const normalizeDateString = (dateStr: string | number): string => {
    if (!dateStr && dateStr !== 0) return '';

    // Handle Excel serial numbers (numeric dates)
    if (typeof dateStr === 'number') {
      // Excel serial date conversion
      // Excel counts days from January 1, 1900 (with leap year bug)
      // 45930 should convert to 9/30/2025
      if (dateStr >= 1 && dateStr <= 100000) {
        const excelEpoch = new Date(1900, 0, 1);
        // Account for Excel's leap year bug (1900 is not a leap year but Excel thinks it is)
        const daysOffset = dateStr > 59 ? dateStr - 2 : dateStr - 1;
        const jsDate = new Date(
          excelEpoch.getTime() + Math.floor(daysOffset) * 24 * 60 * 60 * 1000
        );
        return format(jsDate, 'yyyy-MM-dd');
      }
    }

    const trimmed = String(dateStr).trim();

    // Handle numeric string that might be Excel serial number
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      const numValue = parseFloat(trimmed);
      // Excel dates range from 1 (1900-01-01) to ~60000+ (2064+)
      // 45930 = 9/30/2025, so this seems right
      if (numValue >= 1 && numValue <= 100000) {
        const excelEpoch = new Date(1900, 0, 1);
        const daysOffset = numValue > 59 ? numValue - 2 : numValue - 1;
        const jsDate = new Date(
          excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000
        );
        return format(jsDate, 'yyyy-MM-dd');
      }
    }

    // Handle YYYY/MM/DD format - convert to YYYY-MM-DD
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(trimmed)) {
      return trimmed.replace(/\//g, '-');
    }

    // Handle MM/DD/YYYY format - convert to YYYY-MM-DD
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
      const parts = trimmed.split('/');
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }

    // Handle YYYY-M-D format - pad with zeros
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
      const parts = trimmed.split('-');
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Return as-is for other formats
    return trimmed;
  };

  // File parsing functions
  const parseXLSX = (file: File): Promise<ImportTransaction[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get the first worksheet
          const sheetName = workbook.SheetNames[0];
          if (!sheetName) {
            throw new Error('No worksheet found in Excel file');
          }

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: true, // Keep raw values so we can handle dates ourselves
          }) as any[][];

          if (jsonData.length < 2) {
            throw new Error(
              'Excel file must contain at least a header row and one data row'
            );
          }

          // Parse the data similar to CSV
          const headers = jsonData[0].map((h) =>
            String(h || '')
              .trim()
              .toLowerCase()
          );
          const transactions = parseDataRows(headers, jsonData.slice(1));

          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const parseDataRows = (
    headers: string[],
    rows: string[][]
  ): ImportTransaction[] => {
    const expectedHeaders = [
      'date',
      'description',
      'amount',
      'category',
      'type',
      'currency',
    ];
    const headerMap: { [key: string]: number } = {};

    // Check for required headers
    const missingHeaders = expectedHeaders.filter((header) => {
      const index = headers.findIndex((h) => h === header);
      if (index !== -1) {
        headerMap[header] = index;
        return false;
      }
      return true;
    });

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    // Optional headers
    const notesIndex = headers.findIndex((h) => h === 'notes');
    if (notesIndex !== -1) headerMap.notes = notesIndex;

    const subcategoryIndex = headers.findIndex((h) => h === 'subcategory');
    if (subcategoryIndex !== -1) headerMap.subcategory = subcategoryIndex;

    const transactions: ImportTransaction[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.every((cell) => !cell || String(cell).trim() === ''))
        continue;

      try {
        // Ensure we have enough values
        if (row.length < Math.max(...Object.values(headerMap)) + 1) {
          console.warn(`Row ${i + 2}: Not enough columns, skipping`);
          continue;
        }

        const amountStr = String(row[headerMap.amount] || '').trim();
        const typeStr = String(row[headerMap.type] || '')
          .trim()
          .toLowerCase();

        const rawDate = row[headerMap.date];
        const normalizedDate = normalizeDateString(rawDate);

        const transaction: ImportTransaction = {
          date: normalizedDate,
          description: String(row[headerMap.description] || '').trim(),
          amount: amountStr ? Math.abs(parseFloat(amountStr)) : 0,
          category: String(row[headerMap.category] || '').trim(),
          type:
            typeStr === 'income' || typeStr === 'expense'
              ? (typeStr as TransactionType)
              : TransactionType.EXPENSE,
          currency: String(row[headerMap.currency] || 'USD')
            .trim()
            .toUpperCase(),
          notes: String(row[headerMap.notes] || '').trim(),
          subcategory: String(row[headerMap.subcategory] || '').trim(),
        };

        transactions.push(transaction);
      } catch (error) {
        console.warn(`Error parsing row ${i + 2}:`, error);
        // Continue processing other rows
      }
    }

    if (transactions.length === 0) {
      throw new Error('No valid transactions found in file');
    }

    return transactions;
  };

  const parseCSV = (csvText: string): ImportTransaction[] => {
    const lines = csvText
      .trim()
      .split('\n')
      .filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error(
        'CSV file must contain at least a header row and one data row'
      );
    }

    const headers = lines[0]
      .split(',')
      .map((h) => h.replace(/"/g, '').trim().toLowerCase());

    const dataRows = lines.slice(1).map((line) => parseCSVLine(line));

    return parseDataRows(headers, dataRows);
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.map((val) => val.replace(/^"|"$/g, ''));
  };

  const validateTransaction = (
    transaction: ImportTransaction,
    rowIndex: number
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validate date
    if (!transaction.date) {
      errors.push({
        row: rowIndex,
        field: 'date',
        message: 'Date is required',
      });
    } else {
      try {
        const parsedDate = parseISO(transaction.date);
        if (!isValid(parsedDate)) {
          errors.push({
            row: rowIndex,
            field: 'date',
            message:
              'Invalid date format (use YYYY-MM-DD, YYYY/MM/DD, MM/DD/YYYY, or Excel dates)',
          });
        } else {
          // Check if date is not too far in the future (more than 1 year)
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          if (parsedDate > oneYearFromNow) {
            errors.push({
              row: rowIndex,
              field: 'date',
              message: 'Date cannot be more than 1 year in the future',
            });
          }
        }
      } catch (error) {
        errors.push({
          row: rowIndex,
          field: 'date',
          message:
            'Invalid date format (use YYYY-MM-DD, YYYY/MM/DD, MM/DD/YYYY, or Excel dates)',
        });
      }
    }

    // Validate description
    if (!transaction.description || transaction.description.trim() === '') {
      errors.push({
        row: rowIndex,
        field: 'description',
        message: 'Description is required',
      });
    } else if (transaction.description.length > 200) {
      errors.push({
        row: rowIndex,
        field: 'description',
        message: 'Description must be 200 characters or less',
      });
    }

    // Validate amount
    if (
      !transaction.amount ||
      isNaN(transaction.amount) ||
      transaction.amount === 0
    ) {
      errors.push({
        row: rowIndex,
        field: 'amount',
        message: 'Amount must be a valid non-zero number',
      });
    } else if (transaction.amount < 0) {
      errors.push({
        row: rowIndex,
        field: 'amount',
        message: 'Amount should be positive (type determines income/expense)',
      });
    } else if (transaction.amount > 1000000000) {
      errors.push({
        row: rowIndex,
        field: 'amount',
        message: 'Amount is too large (maximum: 1,000,000,000)',
      });
    }

    // Validate category
    if (!transaction.category || transaction.category.trim() === '') {
      errors.push({
        row: rowIndex,
        field: 'category',
        message: 'Category is required',
      });
    } else if (transaction.category.length > 50) {
      errors.push({
        row: rowIndex,
        field: 'category',
        message: 'Category must be 50 characters or less',
      });
    }

    // Validate type
    if (!Object.values(TransactionType).includes(transaction.type)) {
      errors.push({
        row: rowIndex,
        field: 'type',
        message: 'Type must be "income" or "expense"',
      });
    }

    // Validate currency
    if (!transaction.currency || transaction.currency.length !== 3) {
      errors.push({
        row: rowIndex,
        field: 'currency',
        message: 'Currency must be a 3-letter code (e.g., USD, EUR)',
      });
    } else if (!/^[A-Z]{3}$/.test(transaction.currency)) {
      errors.push({
        row: rowIndex,
        field: 'currency',
        message: 'Currency must be 3 uppercase letters',
      });
    }

    // Validate optional fields
    if (transaction.notes && transaction.notes.length > 500) {
      errors.push({
        row: rowIndex,
        field: 'notes',
        message: 'Notes must be 500 characters or less',
      });
    }

    if (transaction.subcategory && transaction.subcategory.length > 50) {
      errors.push({
        row: rowIndex,
        field: 'subcategory',
        message: 'Subcategory must be 50 characters or less',
      });
    }

    return errors;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isXLSX =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls');

    if (!isCSV && !isXLSX) {
      toast.error('Please select a CSV or Excel (.xlsx) file');
      return;
    }

    // Validate file size (max 10MB for Excel files, 5MB for CSV)
    const maxSize = isXLSX ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `File is too large. Please select a file smaller than ${
          maxSize / 1024 / 1024
        }MB.`
      );
      return;
    }

    setUploadedFile(file);

    try {
      let parsed: ImportTransaction[];

      if (isXLSX) {
        parsed = await parseXLSX(file);
      } else {
        // Handle CSV file
        const reader = new FileReader();
        parsed = await new Promise((resolve, reject) => {
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.onload = (e) => {
            try {
              const csvText = e.target?.result as string;
              if (!csvText || csvText.trim() === '') {
                reject(new Error('The selected file is empty'));
                return;
              }
              resolve(parseCSV(csvText));
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsText(file);
        });
      }

      setParsedData(parsed);

      // Validate all transactions
      const errors: ValidationError[] = [];
      parsed.forEach((transaction, index) => {
        const transactionErrors = validateTransaction(transaction, index + 1);
        errors.push(...transactionErrors);
      });

      setValidationErrors(errors);
      setShowPreview(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(
        `Error parsing file: ${errorMessage}\n\nPlease check the file format and try again.`
      );
      clearImport();
      console.error('File parsing error:', error);
    }

    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleImport = async () => {
    if (!onImport || parsedData.length === 0 || validationErrors.length > 0)
      return;

    try {
      setIsImporting(true);
      await onImport(parsedData);

      // Reset import state
      setUploadedFile(null);
      setParsedData([]);
      setValidationErrors([]);
      setShowPreview(false);

      toast.success(`Successfully imported ${parsedData.length} transactions!`);
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(
        `Import failed: ${errorMessage}\n\nPlease check your data and try again.`
      );
    } finally {
      setIsImporting(false);
    }
  };

  const clearImport = () => {
    setUploadedFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setShowPreview(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];

    // Validate file type
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isXLSX =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls');

    if (!isCSV && !isXLSX) {
      toast.error('Please drop a CSV or Excel (.xlsx) file');
      return;
    }

    // Validate file size (max 10MB for Excel files, 5MB for CSV)
    const maxSize = isXLSX ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `File is too large. Please select a file smaller than ${
          maxSize / 1024 / 1024
        }MB.`
      );
      return;
    }

    setUploadedFile(file);

    try {
      let parsed: ImportTransaction[];

      if (isXLSX) {
        parsed = await parseXLSX(file);
      } else {
        // Handle CSV file
        const reader = new FileReader();
        parsed = await new Promise((resolve, reject) => {
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.onload = (e) => {
            try {
              const csvText = e.target?.result as string;
              if (!csvText || csvText.trim() === '') {
                reject(new Error('The selected file is empty'));
                return;
              }
              resolve(parseCSV(csvText));
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsText(file);
        });
      }

      setParsedData(parsed);

      // Validate all transactions
      const errors: ValidationError[] = [];
      parsed.forEach((transaction, index) => {
        const transactionErrors = validateTransaction(transaction, index + 1);
        errors.push(...transactionErrors);
      });

      setValidationErrors(errors);
      setShowPreview(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(
        `Error parsing file: ${errorMessage}\n\nPlease check the file format and try again.`
      );
      clearImport();
      console.error('File parsing error:', error);
    }
  };

  const handleExport = async () => {
    let exportStartDate: Date;
    let exportEndDate: Date;

    if (!useCustomRange) {
      // Use selected month for export
      exportStartDate = new Date(selectedYear, selectedMonth, 1);
      // Set to start of day (00:00:00)
      exportStartDate.setHours(0, 0, 0, 0);

      // Get the last day of the month and set to end of day (23:59:59.999)
      exportEndDate = new Date(selectedYear, selectedMonth + 1, 0);
      exportEndDate.setHours(23, 59, 59, 999);
    } else {
      // Custom date range
      if (!startDate || !endDate) {
        toast.error('Please select both start and end dates');
        return;
      }
      exportStartDate = new Date(startDate);
      exportStartDate.setHours(0, 0, 0, 0);

      exportEndDate = new Date(endDate);
      exportEndDate.setHours(23, 59, 59, 999);

      if (exportStartDate > exportEndDate) {
        toast.error('Start date must be before end date');
        return;
      }
    }

    try {
      setIsExporting(true);
      await onExport(exportStartDate, exportEndDate, exportFormat);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getPeriodLabel = () => {
    if (!useCustomRange) {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      return `${format(startOfMonth, 'MMMM yyyy')} (${format(
        startOfMonth,
        'dd/MM'
      )} - ${format(endOfMonth, 'dd/MM/yyyy')})`;
    } else {
      if (startDate && endDate) {
        return `${format(new Date(startDate), 'dd/MM/yyyy')} - ${format(
          new Date(endDate),
          'dd/MM/yyyy'
        )}`;
      }
      return 'Select custom date range';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import & Export Transactions"
      size="lg"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-primary-muted/30 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'export'
                ? 'bg-primary-accent text-primary-accent-foreground shadow-sm'
                : 'text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50'
            }`}
          >
            <FiDownload className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'import'
                ? 'bg-primary-accent text-primary-accent-foreground shadow-sm'
                : 'text-primary-muted-foreground hover:text-primary-foreground hover:bg-primary-muted/50'
            }`}
          >
            <FiUpload className="w-4 h-4" />
            Import
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                Export Transactions to CSV
              </h3>
              <p className="text-sm text-primary-muted-foreground">
                Download your transaction data in CSV format for external use or
                backup.
              </p>
            </div>

            {/* Period Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-primary-foreground">
                Select Time Period
              </label>

              {/* Month Picker */}
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="exportPeriod"
                    value="month"
                    checked={!useCustomRange}
                    onChange={() => setUseCustomRange(false)}
                    className="w-4 h-4 text-primary-accent mr-3"
                  />
                  <div className="text-primary-foreground font-medium">
                    Select Month
                  </div>
                </label>

                <MonthYearNavigator
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onPreviousMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                  onCurrentMonth={goToCurrentMonth}
                  onMonthChange={setSelectedMonth}
                  onYearChange={setSelectedYear}
                  showCurrentButton={true}
                  showDropdowns={true}
                  className="bg-primary-muted/20 border-primary-border"
                />
              </div>

              {/* Custom Range */}
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-primary-border rounded-lg cursor-pointer hover:bg-primary-muted/20 transition-colors">
                  <input
                    type="radio"
                    name="exportPeriod"
                    value="custom"
                    checked={useCustomRange}
                    onChange={() => setUseCustomRange(true)}
                    className="w-4 h-4 text-primary-accent"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-primary-foreground font-medium">
                      Custom Date Range
                    </div>
                    <div className="text-sm text-primary-muted-foreground">
                      Select your own start and end dates
                    </div>
                  </div>
                </label>

                {useCustomRange && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                    <div>
                      <label className="block text-xs font-medium text-primary-muted-foreground mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-primary-border rounded-md bg-primary-input text-primary-foreground text-sm focus:outline-none focus:border-primary-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-muted-foreground mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-primary-border rounded-md bg-primary-input text-primary-foreground text-sm focus:outline-none focus:border-primary-accent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-primary-foreground">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-primary-border rounded-lg cursor-pointer hover:bg-primary-muted/20 transition-colors">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) =>
                      setExportFormat(e.target.value as 'csv' | 'xlsx')
                    }
                    className="w-4 h-4 text-primary-accent"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-primary-foreground font-medium">
                      CSV
                    </div>
                    <div className="text-sm text-primary-muted-foreground">
                      Comma Separated Values
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-primary-border rounded-lg cursor-pointer hover:bg-primary-muted/20 transition-colors">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="xlsx"
                    checked={exportFormat === 'xlsx'}
                    onChange={(e) =>
                      setExportFormat(e.target.value as 'csv' | 'xlsx')
                    }
                    className="w-4 h-4 text-primary-accent"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-primary-foreground font-medium">
                      Excel
                    </div>
                    <div className="text-sm text-primary-muted-foreground">
                      Excel Spreadsheet (.xlsx)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Export Preview */}
            <div className="bg-primary-muted/20 border border-primary-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiFileText className="w-4 h-4 text-primary-accent" />
                <span className="font-medium text-primary-foreground">
                  Export Preview
                </span>
              </div>
              <div className="text-sm text-primary-muted-foreground">
                <div>
                  <strong>Period:</strong> {getPeriodLabel()}
                </div>
                <div>
                  <strong>Format:</strong>{' '}
                  {exportFormat === 'csv'
                    ? 'CSV (Comma Separated Values)'
                    : 'Excel Spreadsheet (.xlsx)'}
                </div>
                <div>
                  <strong>Includes:</strong> Date, Description, Amount,
                  Category, Type, Currency, Notes
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-primary-muted-foreground hover:text-primary-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={
                  isExporting || (useCustomRange && (!startDate || !endDate))
                }
                className="bg-primary-accent text-primary-accent-foreground px-6 py-2 rounded-lg hover:bg-primary-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                {isExporting
                  ? 'Exporting...'
                  : `Export ${exportFormat.toUpperCase()}`}
              </button>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                Import Transactions from CSV
              </h3>
              <p className="text-sm text-primary-muted-foreground">
                Upload a CSV file with your transaction data to import multiple
                transactions at once.
              </p>
            </div>

            {!showPreview ? (
              <div className="space-y-4">
                {/* File Format Info */}
                <div className="bg-primary-muted/20 border border-primary-border rounded-lg p-4">
                  <h4 className="font-medium text-primary-foreground mb-2 flex items-center gap-2">
                    <FiFileText className="w-4 h-4" />
                    Supported File Formats
                  </h4>
                  <div className="text-sm text-primary-muted-foreground">
                    <p className="mb-2">
                      Supported formats: <strong>CSV</strong> and{' '}
                      <strong>Excel (.xlsx)</strong>
                    </p>
                    <p className="mb-2">
                      Your file must include these columns (in any order):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <strong>date</strong> - YYYY-MM-DD, YYYY/MM/DD,
                        MM/DD/YYYY, or Excel dates
                      </div>
                      <div>
                        <strong>description</strong> - Transaction description
                      </div>
                      <div>
                        <strong>amount</strong> - Positive number
                      </div>
                      <div>
                        <strong>category</strong> - Category name
                      </div>
                      <div>
                        <strong>type</strong> - "income" or "expense"
                      </div>
                      <div>
                        <strong>currency</strong> - 3-letter code (USD, EUR,
                        etc.)
                      </div>
                      <div>
                        <strong>notes</strong> - Optional notes
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div
                  className={`bg-primary-muted/20 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary-accent bg-primary-accent/10'
                      : 'border-primary-border'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <FiUpload
                      className={`w-12 h-12 transition-colors ${
                        isDragOver
                          ? 'text-primary-accent scale-110'
                          : 'text-primary-accent'
                      }`}
                    />
                    <div>
                      <div className="text-primary-foreground font-medium mb-1">
                        {isDragOver ? 'Drop File Here' : 'Choose File'}
                      </div>
                      <div className="text-sm text-primary-muted-foreground">
                        Click to browse or drag and drop your CSV or Excel file
                        here
                      </div>
                    </div>
                  </label>

                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-primary-card rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiFileText className="w-4 h-4 text-primary-accent" />
                        <span className="text-sm text-primary-foreground">
                          {uploadedFile.name}
                        </span>
                      </div>
                      <button
                        onClick={clearImport}
                        className="p-1 hover:bg-primary-muted/30 rounded transition-colors"
                        type="button"
                      >
                        <FiX className="w-4 h-4 text-primary-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Validation Summary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-5 h-5 text-success dark:text-success" />
                      <span className="text-sm text-primary-foreground">
                        {parsedData.length} transactions found
                      </span>
                    </div>
                    {validationErrors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FiAlertCircle className="w-5 h-5 text-destructive dark:text-destructive" />
                        <span className="text-sm text-destructive dark:text-destructive">
                          {validationErrors.length} validation errors
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={clearImport}
                    className="text-sm text-primary-muted-foreground hover:text-primary-foreground flex items-center gap-1"
                  >
                    <FiX className="w-4 h-4" />
                    Clear
                  </button>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg p-4">
                    <h4 className="font-medium text-destructive dark:text-destructive mb-2 flex items-center gap-2">
                      <FiAlertCircle className="w-4 h-4" />
                      Validation Errors
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {validationErrors.slice(0, 10).map((error, index) => (
                        <div
                          key={index}
                          className="text-sm text-destructive dark:text-destructive"
                        >
                          Row {error.row}: {error.field} - {error.message}
                        </div>
                      ))}
                      {validationErrors.length > 10 && (
                        <div className="text-sm text-destructive dark:text-destructive">
                          ... and {validationErrors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Data Preview */}
                <div className="bg-primary-muted/20 border border-primary-border rounded-lg">
                  <div className="p-4 border-b border-primary-border">
                    <h4 className="font-medium text-primary-foreground flex items-center gap-2">
                      <FiEye className="w-4 h-4" />
                      Transaction Preview ({parsedData.length} transactions)
                    </h4>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-primary-muted/30">
                        <tr>
                          <th className="px-3 py-2 text-left text-primary-foreground">
                            #
                          </th>
                          <th className="px-3 py-2 text-left text-primary-foreground">
                            Date
                          </th>
                          <th className="px-3 py-2 text-left text-primary-foreground">
                            Description
                          </th>
                          <th className="px-3 py-2 text-left text-primary-foreground">
                            Amount
                          </th>
                          <th className="px-3 py-2 text-left text-primary-foreground">
                            Category
                          </th>
                          <th className="px-3 py-2 text-left text-primary-foreground">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 10).map((transaction, index) => {
                          const hasError = validationErrors.some(
                            (error) => error.row === index + 1
                          );
                          return (
                            <tr
                              key={index}
                              className={`border-b border-primary-border/50 ${
                                hasError
                                  ? 'bg-destructive/10 dark:bg-destructive/20'
                                  : ''
                              }`}
                            >
                              <td className="px-3 py-2 text-primary-muted-foreground">
                                {index + 1}
                              </td>
                              <td className="px-3 py-2 text-primary-foreground">
                                {transaction.date}
                              </td>
                              <td className="px-3 py-2 text-primary-foreground">
                                {transaction.description}
                              </td>
                              <td className="px-3 py-2 text-primary-foreground">
                                {transaction.currency} {transaction.amount}
                              </td>
                              <td className="px-3 py-2 text-primary-foreground">
                                {transaction.category}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    transaction.type === TransactionType.INCOME
                                      ? 'bg-success/20 dark:bg-success/30 text-success dark:text-success'
                                      : 'bg-destructive/20 dark:bg-destructive/30 text-destructive dark:text-destructive'
                                  }`}
                                >
                                  {transaction.type}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {parsedData.length > 10 && (
                      <div className="p-3 text-center text-sm text-primary-muted-foreground bg-primary-muted/10">
                        ... and {parsedData.length - 10} more transactions
                      </div>
                    )}
                  </div>
                </div>

                {/* Import Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 text-primary-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={
                      isImporting ||
                      validationErrors.length > 0 ||
                      parsedData.length === 0
                    }
                    className="bg-primary-accent text-primary-accent-foreground px-6 py-2 rounded-lg hover:bg-primary-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FiUpload className="w-4 h-4" />
                    {isImporting
                      ? 'Importing...'
                      : `Import ${parsedData.length} Transactions`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
