import { useTheme } from "@mui/material";

const isSmallScreen = window.matchMedia("(max-width: 700px)").matches;

function Modal({ children, onClose, noTopPadding = false, borderRadius = false }) {
  const theme = useTheme(); // ✅ Get MUI theme

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // ✅ Close only when clicking outside modal content
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={{ paddingTop: noTopPadding ? "0px" : "80px", width: "100%" }}>
        <div
          style={{
            ...styles.modal,
            borderRadius: borderRadius ? "12px" : "0px",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    zIndex: 99999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slightly transparent
    backdropFilter: "blur(4px)",           // ✅ Adds blur effect
    WebkitBackdropFilter: "blur(4px)",     // ✅ Safari support
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    animation: "fadeIn 0.3s ease",
  },
  modal: {
    padding: "0px",
    position: "relative",
    width: isSmallScreen ? "95%" : "50%",
    height: "fit-content",
    margin: "0 auto",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
  },
};

export default Modal;
