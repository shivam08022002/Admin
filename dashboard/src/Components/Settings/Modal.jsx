import { useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

function Modal({ 
  children, 
  onClose, 
  noTopPadding = false, 
  borderRadius = false,
  maxWidth = "50%",
  closeOnEscape = true,
  showCloseButton = false
}) {
  const theme = useTheme();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Enhanced outside click handler
  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay (not on modal content)
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Additional safety: handle mouse down/up events to prevent accidental closes
  const handleMouseDown = (e) => {
    e.stopPropagation();
  };

  const dynamicStyles = {
    overlay: {
      position: "fixed",
      zIndex: 99999,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: noTopPadding ? "flex-start" : "center",
      justifyContent: "center",
      padding: isMobile ? "10px" : "150px",
      overflowY: "auto",
      animation: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    modal: {
      position: "relative",
      width: isMobile ? "100%" : maxWidth,
      maxWidth: isMobile ? "100%" : "90vw",
      maxHeight: isMobile ? "95vh" : "90vh",
      minHeight: isMobile ? "auto" : "auto",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderRadius: borderRadius ? (isMobile ? "8px" : "12px") : "0px",
      boxShadow: theme.shadows[24] || "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
      outline: "none",
      overflow: "hidden",
      animation: "modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      marginTop: noTopPadding ? "0" : "auto",
      marginBottom: noTopPadding ? "auto" : "auto",
    },
    closeButton: {
      position: "absolute",
      top: noTopPadding ? (isMobile ? "6px" : "4px") : (isMobile ? "3px" : "3px"),
      right: isMobile ? "8px" : "12px",
      zIndex: 1,
      cursor: "pointer",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      border: "none",
      borderRadius: "50%",
      width: isMobile ? "28px" : "28px",
      height: isMobile ? "28px" : "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.text.primary,
      transition: "all 0.2s ease",
    },
  };

  return (
    <>
      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: ${isMobile ? 'translateY(20px)' : 'scale(0.95) translateY(-10px)'};
          }
          to {
            opacity: 1;
            transform: ${isMobile ? 'translateY(0)' : 'scale(1) translateY(0)'};
          }
        }

        .close-button:hover {
          background-color: rgba(0, 0, 0, 0.2) !important;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .close-button:hover {
            transform: scale(1.05);
          }
        }
      `}</style>
      <div
        ref={overlayRef}
        style={dynamicStyles.overlay}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          style={dynamicStyles.modal}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              style={dynamicStyles.closeButton}
              className="close-button"
              aria-label="Close modal"
              title="Close"
            >
              <CloseIcon style={{ fontSize: isMobile ? "16px" : "18px" }} />
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;