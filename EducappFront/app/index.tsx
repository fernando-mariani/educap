import GlobalError from '@/context/Context/GlobalError';
import GlobalLoading from '@/context/Context/GlobalLoading';
import GlobalSucess from '@/context/Context/GlobalSucess';
import * as WebBrowser from "expo-web-browser";
import ContextProvider from '../context/Context/context';
import AllRoutes from './Routes/AllRoutes';
export default function App() {

  WebBrowser.maybeCompleteAuthSession();

  return (
    <ContextProvider>
        <AllRoutes/>
        <GlobalLoading/>
        <GlobalError/>
        <GlobalSucess/>
    </ContextProvider>
  );
}
