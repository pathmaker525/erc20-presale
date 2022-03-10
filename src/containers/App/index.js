import { Suspense, lazy } from "react"
import { BrowserRouter } from "react-router-dom"
import { Web3ReactProvider } from "@web3-react/core"
import { getLibrary } from "utils/Web3React"

import { Provider } from "react-alert"

import Loading from "components/Loading"
import AlertTemplate, { alertOptions } from "utils/GetAlertTemplate"

const AppRouter = lazy(() => import("routers"))

const App = () => (
  <Suspense fallback={<Loading />}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider template={AlertTemplate} {...alertOptions}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </Web3ReactProvider>
  </Suspense>
)

export default App
