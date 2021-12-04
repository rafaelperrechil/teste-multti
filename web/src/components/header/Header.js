import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown} from '@fortawesome/free-solid-svg-icons'
import 'react-tabs/style/react-tabs.css';
import './Header.css';

export default function Header() {

  return(
    <header>
    <div className='logo'>
      <a href='#' alt='' title=''>
        <img src={process.env.PUBLIC_URL + 'assets/images/logo.png'} alt='' title=''/>
      </a>
    </div>
    <nav>
      <ul>
        <li><a href='#'>Cobranças Recebidas</a></li>
      </ul>
    </nav>
    <div className='user-info'>
      <img src={process.env.PUBLIC_URL + 'assets/images/avatar.png'} alt='' title=''/>
      <div>
        <span>Nome do Usuário</span>
        <span>387 *** *** **</span>
      </div>
      <a href='#'><FontAwesomeIcon icon={faChevronDown} /></a>
    </div>
  </header>
  );

}