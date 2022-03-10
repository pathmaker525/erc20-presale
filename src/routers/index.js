import { useState, useEffect } from "react"
import { useRoutes } from "react-router-dom"

import Footer from "components/Footer"
import NotFound from "components/NotFound"

import Presale from "./Presale"

import UseScrollToTop from "hooks/useScrollToTop"

import { AppRoutes } from "constants/UI"

const AppRouter = () => {
  let routes = useRoutes([
    { path: AppRoutes.PRESALE, element: <Presale /> },
    { path: AppRoutes.NOTFOUND, element: <NotFound /> },
  ])

  return (
    <>
      <UseScrollToTop>{routes}</UseScrollToTop>
      <Footer />
    </>
  )
}

export default AppRouter
