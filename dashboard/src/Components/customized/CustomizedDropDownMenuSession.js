// TabsComponent.js
import React, { useState } from 'react';
import { Box, MenuItem, FormControl, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

// Sample data for dynamic menu items
const tabOptions = [
    { id: 1, label: "Tab 1" },
    { id: 2, label: "Tab 2" },
    { id: 3, label: "Tab 3" },
    // Add more options here as needed
];

const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: 'white',
    color: theme.palette.text.primary,
    border: 'none', // Remove default border
    borderRadius: '4px', // Ensure border radius is consistent
    padding: '0 16px', // Adjust padding if necessary
    position: 'relative', // Position relative for pseudo-element
    '& .MuiSelect-icon': {
        color: theme.palette.text.primary, // Icon color
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent', // Hide default border
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent', // Hide default border on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent', // Hide default border when focused
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        border: `1px solid ${theme.palette.divider}`, // Thicker border around the dropdown
        borderRadius: '4px', // Ensure border radius matches
        pointerEvents: 'none', // Ensure this does not interfere with interactions
    },
    textAlign: "left",
    height: "30px",
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: 'white',
    padding: '10px 16px', // Ensure padding is consistent
    '&:hover': {
        backgroundColor: '#f5f5f5 !important', // Ensure hover background color
    },
    '&.Mui-selected': {
        backgroundColor: '#e0e0e0 !important', // Background color for selected item
    },
    textAlign: "left",
    height: "30px",
}));

const CustomizedDropDownMenuSession = ({ users, sessions, userName, marketName, setUserName, setMarketName, candidateMarketsId, candidateMarketsName }) => {

    const handleUserChange = (event) => {
        const id = event.target.value;
        setUserName(id);
    };

    const handleMarketChange = (event) => {
        const id = event.target.value;
        setMarketName(id);
    };

    return (
        <FormControl fullWidth>
            {users && <StyledSelect
                value={userName}
                onChange={handleUserChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Tab' }}
                variant="outlined"
            >
                <StyledMenuItem key="alluser" value="alluser">
                    All User
                </StyledMenuItem>
                {users.map(id => (
                    <StyledMenuItem key={id} value={id}>
                        {id}
                    </StyledMenuItem>
                ))}
            </StyledSelect>}
            {sessions && <StyledSelect
                value={marketName}
                onChange={handleMarketChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Tab' }}
                variant="outlined"
            >
                <StyledMenuItem key="allfancy" value="allfancy">
                    All Fancy
                </StyledMenuItem>
                {candidateMarketsId.map((id, index) => (
                    <StyledMenuItem key={id} value={id}>
                        {candidateMarketsName[index]}
                    </StyledMenuItem>
                ))}
            </StyledSelect>}
        </FormControl>
    );
};

export default CustomizedDropDownMenuSession;
