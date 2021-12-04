import React ,{ useState, useEffect } from 'react'
import Header from '../../components/header/Header';
import api from "../../services/Api";
import { Link } from 'react-router-dom';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronLeft, faChevronRight, faSort, faPrint, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Bills.css';

var sortJsonArray = require('sort-json-array');

const initialState = {
  search:{ name: '', days: '7', from: '', to: '', sortField: '', order:''}
}

export default function Bills() {

  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState(initialState.search);
  const [fromDate, setFromDate] = useState(moment().subtract(search.days, 'DAYS').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  
  useEffect(() => {
    loadBills();
  }, []);

  function renderGrid(...status){
   return(
    <div className='grid'>
      <div className='header'>
          <div><a href='#'><FontAwesomeIcon icon={faSort} /> Vencimento</a></div>
          <div><a href='#' ><FontAwesomeIcon icon={faSort} /> Nome do Beneficiário</a></div>
          <div><a href='#'><FontAwesomeIcon icon={faSort} /> Valor</a></div>
          <div>Situação</div>
          <div>Opções</div>
      </div>
      <div className='content'>
        {renderBills(...status)}
      </div>
      <div className='footer'>
        <select name=''>
          <option value=''>10 por página</option>
        </select>
        <span className='total'>Total: 100 resultados</span>
        <ul className='pagination'>
          <li><a href="#"><FontAwesomeIcon icon={faChevronLeft} /></a></li>
          <li className='selected'><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /></a></li>
        </ul>
      </div>
    </div>
   ) ;
  }

  function renderBills(...status){

    const rows = bills.filter(item =>{
    
      const isSameOrBefore = moment(item.duedate).isSameOrBefore(toDate, 'day');
      const isSameOrAfter = moment(item.duedate).isSameOrAfter(fromDate, 'day');

      //console.log(moment(item.duedate).format('YYYY-MM-DD')+' | '+fromDate+' | '+toDate+' | '+isSameOrBefore +' |  '+isSameOrAfter)
      //console.log(item.name+' | '+search.name+' | '+item.name.includes(search.name));
      
        if (
            status.includes(item.status) && 
           item.name.includes(search.name) &&
            (isSameOrBefore && isSameOrAfter) 
          ){
          return true
        }

      }).map(bill => {
        
        if(bill.status == 'paid'){
          var statusName = 'Pago'
        }else if(bill.status == 'late'){
          var statusName = 'Atrasado'
        }else if(bill.status == 'overcome'){
          var statusName = 'A Vencer'
        }

      return(
      <div className='item'>
        <div>{moment(bill.duedate).format('DD/MM/YYYY')}</div>
        <div>{bill.name}</div>
        <div>R$ {new Intl.NumberFormat('pt-BR').format(bill.amount)}</div>
        <div className={bill.status}>{statusName}</div>
        <div>
          <a href='#'><FontAwesomeIcon icon={faPrint} /></a>
          <a href='#'><FontAwesomeIcon icon={faPaperclip} /></a>
        </div>
      </div>
      );
    })

    const Total = () => {
      
      const totalAmount = bills.reduce((amountTotal, bill) => {
        
        if(
          status.includes(bill.status) && 
          bill.name.includes(search.name) &&
          (moment(bill.duedate).isSameOrBefore(toDate, 'day') && moment(bill.duedate).isSameOrAfter(fromDate, 'day') ) 
        ){
          amountTotal = amountTotal + bill.amount;
        }
        return amountTotal; 
      }, 0);

      return (  
      <div className='total'>
        <div>Total</div>
        <div>R$ {new Intl.NumberFormat('pt-BR').format(totalAmount)}</div>
      </div>)
    }

    return (
      <>
        {rows}
        {Total()}
      </>
    )
   
  }

  function loadBills(){

    api.get("/bills")
    .then((response) => {
      setBills(response.data);
    })
    .catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setSearch(prevState => ({
        ...prevState,
        [name]: value
    }));
    //console.clear();
  };

  const days = e => {
    const { value } = e.target;
    setFromDate(moment().subtract(value, 'DAYS').format('YYYY-MM-DD')); 
    setToDate(moment().format('YYYY-MM-DD')); 
  }

  const from = e => {
    const { value } = e.target;
    setFromDate(moment(value).format('YYYY-MM-DD')); 
  }

  const to = e => {
    const { value } = e.target;
    setToDate(moment(value).format('YYYY-MM-DD')); 
  }

  return (
    <>
    <Header />
    <main>
      <div className='actions'>
        <a href='#'><FontAwesomeIcon icon={faChevronLeft} /> Voltar</a>
      </div>
      <section>
          <div className='header'>
            <div>
              <h1>Relação de Cobranças Recebidas</h1>
              <span>De <span id="de">{moment(fromDate).format('DD/MM/YYYY')}</span> Até <span id="ate">{moment(toDate).format('DD/MM/YYYY')}</span></span>
            </div>
            <div className='search'>
              <div className='group'>
                <input type='text' name='name' placeholder='Buscar' onChange={handleChange}/>
              </div>
              <div className='group'>
                <select name='days' onChange={(e) => {handleChange(e); days(e);}}>
                  <option value='7'>7 dias</option>
                  <option value='14'>14 dias</option>
                  <option value='30'>30 dias</option>
                </select>
              </div>
              <div className='group from'>
                  <label>De</label>
                  <input type='date' name='from' onChange={(e) => {handleChange(e); from(e);}}/>
              </div>
              <div className='group'>
                  <label>Até</label>
                  <input type='date' name='to' onChange={(e) => {handleChange(e); to(e);}}/>
              </div>
            </div>
          </div>
          <div className='container'>
          <Tabs>
              <TabList>
                <Tab>Todas as cobranças</Tab>
                <Tab>Pendentes</Tab>
                <Tab>Pagas</Tab>
              </TabList>
              <TabPanel>
              {renderGrid('late','overcome','paid')}
              </TabPanel>
              <TabPanel>
              {renderGrid('late','overcome')}
              </TabPanel>
              <TabPanel>
              {renderGrid('paid')}
              </TabPanel>
            </Tabs>
          </div>
      </section>
    </main>
  </>
  );
}

