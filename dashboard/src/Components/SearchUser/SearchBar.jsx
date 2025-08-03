import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from 'rsuite';
import { FaSearch } from 'react-icons/fa'; // ✅ Using FontAwesome search icon


const SearchBar = ({ setId, setError }) => {
    const [userId, setUserId] = useState("");

    const handleSearchClick = () => {
        if (userId.trim()) {
            setId(userId.toUpperCase());
        } else {
            setError("Please Enter User Id");
        }
    };

    const onChangeUserId = (value) => {
        setUserId(value.toUpperCase());
    };

    return (
        <div className="search-bar-container">
            <div className="search-input-wrapper">
                <Input
                    placeholder="Enter User ID"
                    maxLength="18"
                    value={userId}
                    onChange={onChangeUserId}
                    className="user-search-input"
                />
            </div>

            <div className="search-action-wrapper">
                <button
                    className="search-submit-btn"
                    onClick={handleSearchClick}
                >
                <FaSearch className="search-icon" /> Search
                </button>
            </div>

            <style jsx>{`
                .search-bar-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px;
                    background: var(--color-bg-card, #fff);
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    margin: 10px;
                }

                .search-input-wrapper {
                    flex: 1;
                }

                .user-search-input {
                    width: 100%;
                    font-size: 14px;
                    border: 1px solid var(--color-border, #ccc);
                    border-radius: 6px;
                    padding: 8px 12px;
                    transition: all 0.2s ease;
                }

                .user-search-input:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
                    outline: none;
                }

                .search-action-wrapper {
                    flex-shrink: 0;
                }

                .search-submit-btn {
                    background: #3f4d67;;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .search-bar-container {
                        flex-direction: row;
                        align-items: flex-end;
                        gap: 8px;
                        padding: 8px;
                        margin: 8px;
                    }

                    .search-submit-btn {
                        width: 100%;
                        justify-content: center;
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
};

export default SearchBar;
