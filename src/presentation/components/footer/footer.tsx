import React, { memo } from 'react'
import Styles from './footer-header-styles.scss'
const Footer: React.FC = () => {
  return (
    <footer className={Styles.footer}></footer>
  )
}
export default memo(Footer)
