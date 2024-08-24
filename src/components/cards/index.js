import React from 'react'
import { Card, Row} from "antd";
import Button from '../button/idex';
import "./styles.css";
function Cards({showExpenseModal, showIncomeModal,income,expense,totalBalance,resetbalance,borrow,showBorrowModal,Lent,showLentModal,resetloanandborrowbalance}) {

  const handleClick = () => {
    resetbalance();
    resetloanandborrowbalance();
  };
  return (
    <div>
      <Row className='my-row'>
        <Card className='my-card' title="Current Balance"><p>₹{totalBalance}</p>
        <Button text="Reset Balance" blue={true} onClick={handleClick}/>
        </Card>
        </Row>
        <Row className='my-row'>       
        <Card className='my-card' title="Total Income"><p>₹{income} </p>
        <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
        </Card>
        <Card className='my-card' title="Total expense"><p>₹{expense} </p>
        <Button text="Add expense" blue={true} onClick={showExpenseModal}/>
        </Card>
        <Card className='my-card' title="Total Amount Borrowed"><p>₹{borrow} </p>
        <Button text="Add Borrowed Amount" blue={true} onClick={showBorrowModal}/>
        </Card>
        <Card className='my-card' title="Total Amount Lend"><p>₹{Lent} </p>
        <Button text="Add Lent Amount" blue={true} onClick={showLentModal}/>
        </Card>
        </Row>
    </div>
  );
}

export default Cards;