import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import router from 'src/router';

import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import AppInit from './components/AppInit';
import { CustomSnackBarProvider } from './contexts/CustomSnackBarContext';
import ReactGA from 'react-ga4';
import {
  customLogoPaths,
  googleTrackingId,
  IS_LOCALHOST,
  isWhiteLabeled
} from './config';
import { useEffect } from 'react';
import { CompanySettingsProvider } from './contexts/CompanySettingsContext';
import { getLicenseValidity } from './slices/license';
import { useDispatch, useSelector } from './store';
import { useBrand } from './hooks/useBrand';

// --- PASO 1: IMPORTAR createGlobalStyle ---
import { createGlobalStyle } from 'styled-components';

// --- PASO 2: DEFINIR EL ESTILO GLOBAL ---
const GlobalStyle = createGlobalStyle`
  div[style*="z-index: 100000"] {
    display: none !important;
  }
`;

if (!IS_LOCALHOST && googleTrackingId) ReactGA.initialize(googleTrackingId);
function App() {
  const content = useRoutes(router);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logo } = useBrand();
  const { isInitialized, company, isAuthenticated, user } = useAuth();
  const { isLicenseValid } = useSelector((state) => state.license);
  let location = useLocation();
  useEffect(() => {
    if (!IS_LOCALHOST && googleTrackingId)
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search
      });
  }, [location]);
  useEffect(() => {
    const arr = location.pathname.split('/');
    if (
      !['downgrade', 'upgrade'].includes(arr[arr.length - 1]) &&
      isInitialized &&
      isAuthenticated
    )
      if (company.subscription.downgradeNeeded) {
        navigate('/app/downgrade');
      } else if (user.ownsCompany && company.subscription.upgradeNeeded) {
        navigate('/app/upgrade');
      }
  }, [company, isInitialized, isAuthenticated, location]);

  useEffect(() => {
    const arr = location.pathname.split('/');
    if (
      !['switch-account'].includes(arr[arr.length - 1]) &&
      isInitialized &&
      isAuthenticated
    )
      if (user.superAccountRelations.length) {
        navigate('/app/switch-account');
      }
  }, [user, isInitialized, isAuthenticated, location]);

  useEffect(() => {
    if (isWhiteLabeled) dispatch(getLicenseValidity());
  }, []);

  useEffect(() => {
    if (customLogoPaths && isLicenseValid) {
      let link: HTMLLinkElement = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = logo.dark;
    }
  }, [logo.dark, isLicenseValid]);

  return (
    <ThemeProvider>
      {/* --- PASO 3: AÑADIR EL COMPONENTE DE ESTILO AQUÍ --- */}
      <GlobalStyle />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <CustomSnackBarProvider>
            <CompanySettingsProvider>
              <CssBaseline />
              {isInitialized ? content : <AppInit />}
            </CompanySettingsProvider>
          </CustomSnackBarProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;