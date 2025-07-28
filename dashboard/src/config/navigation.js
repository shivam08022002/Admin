import {
  FaChartBar as DashboardIcon,
  FaGamepad as InplayIcon,
  FaUsers as UsersIcon,
  FaBook as LedgerIcon,
  FaChartLine as ReportIcon,
  FaUserSlash as DeadUserIcon,
  FaBan as BlockIcon,
  FaWallet as ProfitLossIcon,
  FaHistory as CoinIcon,
  FaSearch as SearchIcon,
  FaCog as SettingsIcon,
  FaLock as PasswordIcon,
  FaSignOutAlt as LogoutIcon
} from 'react-icons/fa';

export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main Menu',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard'
  },
  {
    segment: 'inplay',
    title: 'Inplay',
    icon: InplayIcon,
    path: '/inplay'
  },
  {
    segment: 'users',
    title: 'Users',
    icon: UsersIcon,
    children: [
      {
        segment: 'create',
        title: 'Create Users',
        path: '/users/create'
      },
      {
        segment: 'sm',
        title: 'SM',
        path: '/users/sm'
      },
      {
        segment: 'sc',
        title: 'SC',
        path: '/users/sc'
      },
      {
        segment: 'stockist',
        title: 'Stockist',
        path: '/users/stockist'
      },
      {
        segment: 'agents',
        title: 'Agents',
        path: '/users/agents'
      }
    ]
  },
  {
    kind: 'divider'
  },
  {
    kind: 'header',
    title: 'Management'
  },
  {
    segment: 'ledgers',
    title: 'Ledgers',
    icon: LedgerIcon,
    path: '/ledgers'
    
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: ReportIcon,
    children: [
      {
        segment: 'daily',
        title: 'Daily Report',
        path: '/report/daily'
      },
      {
        segment: 'monthly',
        title: 'Monthly Report',
        path: '/report/monthly'
      }
    ]
  },
  {
    segment: 'deadUsers',
    title: 'Dead Users',
    icon: DeadUserIcon,
    path: '/dead-users'
  },
  {
    segment: 'blockMarket',
    title: 'Block Market',
    icon: BlockIcon,
    path: '/block-market'
  },
  {
    segment: 'profitLoss',
    title: 'Profit & Loss',
    icon: ProfitLossIcon,
    path: '/profit-loss'
  },
  {
    segment: 'coinHistory',
    title: 'Coin History',
    icon: CoinIcon,
    path: '/coin-history'
  },
  {
    kind: 'divider'
  },
  {
    kind: 'header',
    title: 'Settings'
  },
  {
    segment: 'searchUser',
    title: 'Search User',
    icon: SearchIcon,
    path: '/search-user'
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: SettingsIcon,
    path: '/settings'
  },
  {
    segment: 'changePassword',
    title: 'Change Password',
    icon: PasswordIcon,
    path: '/change-password'
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: LogoutIcon,
    path: '/logout'
  }
];
