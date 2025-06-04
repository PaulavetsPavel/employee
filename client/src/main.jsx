import { StrictMode, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import Store from './store/store';

export const store = new Store();

export const Context = createContext({
  store,
});


const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>

    <Context.Provider
      value={{
        store,
      }}
    >
      <App />
    </Context.Provider>
  </QueryClientProvider>

  // </StrictMode>
);
