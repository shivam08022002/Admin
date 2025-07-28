import React from 'react';
import { Breadcrumbs, Link, Typography, useTheme } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLocation, useNavigate } from 'react-router-dom';

function CustomBreadcrumbs() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Always start with Home, then Dashboard, then the rest
  const filteredPathnames = pathnames.filter((x) => x !== 'dashboard');
  const crumbs = [
    {
      label: 'Home',
      to: '/',
      isLink: true,
    },
    {
      label: 'Dashboard',
      to: '/dashboard',
      isLink: filteredPathnames.length > 0,
    },
    ...filteredPathnames.map((value, idx) => ({
      label: decodeURIComponent(value.replace(/-/g, ' ')),
      to: `/dashboard/${filteredPathnames.slice(0, idx + 1).join('/')}`,
      isLink: idx !== filteredPathnames.length - 1,
    })),
  ];

  // Helper for camel case (capitalize first letter of each word)
  const toCamelCase = (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <div style={{ marginBottom: 8 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'Open Sans, Arial, sans-serif',
          fontWeight: 500,
          fontSize: { xs: 20, sm: 24, md: 26, lg: 28 },
          color: theme.palette.text.primary,
          mb: 0.5,
          textTransform: 'none',
        }}
      >
        {crumbs.length > 0 ? toCamelCase(crumbs[crumbs.length - 1].label) : 'Home'}
      </Typography>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" sx={{ color: theme.palette.text.disabled }} />}
        sx={{
          fontFamily: 'Open Sans, Arial, sans-serif',
          fontSize: { xs: 13, sm: 15, md: 16, lg: 17 },
          fontWeight: 400,
          color: theme.palette.text.secondary,
          mt: 0.5,
        }}
      >
        {crumbs.map((crumb) =>
          crumb.isLink ? (
            <Link
              key={crumb.to}
              underline="hover"
              color={theme.palette.text.secondary}
              onClick={() => navigate(crumb.to)}
              sx={{
                cursor: 'pointer',
                fontFamily: 'Open Sans, Arial, sans-serif',
                fontSize: { xs: 13, sm: 15, md: 16, lg: 17 },
                fontWeight: 400,
                textTransform: 'none',
                color: theme.palette.text.secondary,
              }}
            >
              {toCamelCase(crumb.label)}
            </Link>
          ) : (
            <Typography
              key={crumb.to}
              sx={{
                fontFamily: 'Open Sans, Arial, sans-serif',
                fontSize: { xs: 13, sm: 15, md: 16, lg: 17 },
                fontWeight: 400,
                textTransform: 'none',
                color: theme.palette.text.disabled,
              }}
            >
              {toCamelCase(crumb.label)}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  );
}

export default CustomBreadcrumbs;
