import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';
import { format, addDays, startOfToday } from 'date-fns';
import { FaCalendar } from 'react-icons/fa';

const DateRangePicker = ({ fetchStatement, isSmallScreen, fetchLast7DaysOnLoad, locationChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showDatePickers, setShowDatePickers] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const dropdownRef = useRef(null);

    const handleToggleDatePickers = () => {
        setShowDatePickers(prevState => !prevState);
    };

    // Handle date change for start and end dates
    const handleDateChange = (date, type) => {
        if (type === 'start') {
            if (endDate && date > endDate) {
                setErrorMessage('Start date cannot be later than end date.');
                return;
            }
            setStartDate(date);
            setFocusedInput('end'); // Focus the end date picker after selecting start date
        } else {
            if (date < startDate) {
                setErrorMessage('End date cannot be earlier than start date.');
                return;
            }
            setEndDate(date);
            setFocusedInput(null); // Clear focus after selecting end date
        }
        setErrorMessage(''); // Clear error message if dates are valid
    };

    // Clear the selected dates
    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        setErrorMessage('');
        setShowDatePickers(prevState => !prevState);
    };

    // Apply the selected dates and close the picker
    const handleApply = () => {
        if (!startDate || !endDate) {
            setErrorMessage('Please select both start and end dates.');
            return;
        }
        setShowDatePickers(false);
        setErrorMessage('');
    };

    // Handle preset button click
    const handlePresetClick = (type) => {
        const today = startOfToday();
        let presetStartDate, presetEndDate;

        switch (type) {
            case 'today':
                presetEndDate = today;
                presetStartDate = today;
                break;
            case 'yesterday':
                presetEndDate = today;
                presetStartDate = addDays(today, -1);
                break;
            case 'last7days':
            case 'lastWeek':
                presetEndDate = today;
                presetStartDate = addDays(today, -7);
                break;
            case 'last30days':
            case "lastMonth":
                presetEndDate = today;
                presetStartDate = addDays(today, -30);
                break;
            case 'thisWeek':
                presetEndDate = addDays(today, 7);
                presetStartDate = today;
                break;
            case 'thisMonth':
                presetEndDate = addDays(today, 30);
                presetStartDate = today;
                break;
            default:
                return;
        }

        setStartDate(presetStartDate);
        setEndDate(presetEndDate);
        setShowDatePickers(false);
        setErrorMessage('');
    };

    // Close date pickers if clicked outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDatePickers(false);
        }
    };

    useEffect(() => {
        if (locationChange || fetchLast7DaysOnLoad) {
            const today = startOfToday();
            let presetEndDate = today;
            let presetStartDate = addDays(today, -7);
            setStartDate(presetStartDate);
            setEndDate(presetEndDate);
            fetchStatement(apiFormatDate(presetStartDate), apiFormatDate(presetEndDate));
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [locationChange]);

    // Format dates for display
    const formatDate = (date) => {
        return date ? format(date, 'MMM d, yyyy') : 'Select Date';
    };

    const apiFormatDate = (date) => {
        return date ? format(date, 'yyyy-MM-dd') : null;
    };

    // Set button text based on selected dates
    const getButtonText = () => {
        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        return 'Select Date Range';
    };

    return (
        <div className="date-range-form-container" style={{ flexDirection: "row" }}>
            <div className="date-range-picker-container" ref={dropdownRef}>
                <div className="dropdown">
                    <button className="dropdown-button" onClick={handleToggleDatePickers}>
                        <FaCalendar style={{ color: "#3963af", height: "12px" }} />
                        &nbsp; {getButtonText()}
                        <i className="arrow down"></i>
                    </button>
                    {showDatePickers && (
                        <div className="dropdown-content" style={{ width: '530px' }}>
                            <div className="presets">
                                <button onClick={() => handlePresetClick('today')}>Today</button>
                                <button onClick={() => handlePresetClick('yesterday')}>Yesterday</button>
                                <button onClick={() => handlePresetClick('last7days')}>Last 7 days</button>
                                <button onClick={() => handlePresetClick('lastWeek')}>Last Week</button>
                                <button onClick={() => handlePresetClick('last30days')}>Last 30 days</button>
                                <button onClick={() => handlePresetClick('thisWeek')}>Coming Week</button>
                                <button onClick={() => handlePresetClick('thisMonth')}>Coming Month</button>
                            </div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <div className="date-pickers">
                                <div className="date-picker-wrapper">
                                    <button
                                        onClick={() => setFocusedInput('start')}
                                        className={`date-picker-toggle ${focusedInput === 'start' ? 'focused' : ''}`}
                                    >
                                        {startDate ? formatDate(startDate) : 'Start Date'}
                                    </button>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => handleDateChange(date, 'start')}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={null}
                                        maxDate={endDate}
                                        inline
                                        className="react-datepicker-inline"
                                        calendarClassName="calendar-start"
                                    />
                                </div>
                                <div className="date-picker-wrapper">
                                    <button
                                        onClick={() => setFocusedInput('end')}
                                        className={`date-picker-toggle ${focusedInput === 'end' ? 'focused' : ''}`}
                                    >
                                        {endDate ? formatDate(endDate) : 'End Date'}
                                    </button>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => handleDateChange(date, 'end')}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate} // Prevent selecting an end date before the start date
                                        maxDate={null} // Allow any end date
                                        inline
                                        className="react-datepicker-inline" // Custom class for styling
                                        calendarClassName="calendar-end" // Custom class to ensure correct styling
                                    />
                                </div>
                            </div>
                            <div className="actions">
                                <button className="action-button clear" onClick={handleClear}>Clear</button>
                                <button className="action-button apply" onClick={handleApply}>Apply</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="search-button-wrapper">
                <button className="cric-board-buttons board-buttons-nav-bar-dark-smaller"
                    style={{ marginLeft: "0px", height: isSmallScreen ? "34px" : "37px" }}
                    onClick={(e) => fetchStatement(apiFormatDate(startDate), apiFormatDate(endDate))}>
                    Search
                </button>
            </div>

        </div>
    );
};

export default DateRangePicker;
