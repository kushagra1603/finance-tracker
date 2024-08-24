import React, { useEffect } from 'react'
import Header from '../components/Header';
import Cards from '../components/cards';
import { useState } from 'react';
import AddExpensemodal from '../components/modals/addExpense';
import AddIncomemodal from '../components/modals/addIncome';
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TransactionsTable from '../components/TransactionsTable';
import { deleteDoc} from "firebase/firestore";
import ChartComponent from '../components/charts';
import NoTransactions from '../components/notransaction';
import AddLentModal from '../components/modals/showLent';
import AddBorrowModal from '../components/modals/showborrow';

function Dashboard()
 {
  const[income, setIncome]=useState(0);
  const[expense, setExpense]=useState(0);
  const[totalBalance, setTotalBalance]=useState(0);
  const[Lent, setLent]=useState(0);
  const[Borrow, setBorrow]=useState(0);
  const[transactions, setTransactions]= useState([]);
  const[loanandborrowtransactions, setloanandborrowTransactions]= useState([]);
  const[loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isLentModalVisible, setIsLentModalVisible] = useState(false);
  const [isBorrowModalVisible, setIsBorrowModalVisible] = useState(false);
 


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const showLentModal=()=>{
    setIsLentModalVisible(true);
  }
  const showBorrowModal=()=>{
    setIsBorrowModalVisible(true);
  }
  const handleLentCancel = () => {
    setIsLentModalVisible(false);
  };

  const handleBorrowCancel = () => {
    setIsBorrowModalVisible(false);
  };



  const onFinish=(values, type)=>{
    const newTransaction={
      type: type,
      date:values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name:values.name,
    };
    addTransaction(newTransaction);

  };
  const onFinishlentandborrow=(values, type)=>{
    const newloanandborrow={
      type: type,
      date:values.date.format("YYYY-MM-DD"),
      duedate:values.duedate.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name:values.name,
    };
    addloanandborrow(newloanandborrow);

  };
  async function addloanandborrow(transaction,many){
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/loanandborrow`),
        transaction
      );
        if(!many)toast.success("loan and borrow Added!");
        let newArr = loanandborrowtransactions;
        newArr.push(transaction);
        setloanandborrowTransactions(newArr);
        calculateBalance();
      }
    catch (e) {
      if(!many) toast.error("Couldn't add loan and borrow transaction");
      
    }
  }  
  
  async function addTransaction(transaction,many){
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
        if(!many)toast.success("Transaction Added!");
        let newArr = transactions;
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
      }
    catch (e) {
      if(!many) toast.error("Couldn't add transaction");
      
    }
  }
 
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      
    }
    toast.success("Transactions Fetched!");
    setLoading(false);
  }
  async function loanandborrowfetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/loanandborrow`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setloanandborrowTransactions(transactionsArray);
      
    }
    setLoading(false);
  }
   function calculateBalance(){
    let incomeTotal=0;
    let expenseTotal=0;
    let lenttotal=0;
    let borrowtotal=0;

    transactions.forEach((transaction)=>{
      if(transaction.type==="income")
      {
        incomeTotal+=transaction.amount;
      }
      else if(transaction.type==="expense"){
        expenseTotal+=transaction.amount;
      }
    });
    loanandborrowtransactions.forEach((transaction)=>{
      if(transaction.type==="lent")
      {
        incomeTotal-=transaction.amount;
        lenttotal+=transaction.amount
      }
      else if(transaction.type==="borrow"){
        expenseTotal+=transaction.amount;
        borrowtotal+=transaction.amount;
      }
    }
  
  
  );

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal-expenseTotal);
    setLent(lenttotal);
    setBorrow(borrowtotal);


  }
  async function resetbalance(many) {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        try {
          await deleteDoc(doc.ref);         
        } catch (error) {
          toast.error("Error reseting transaction");
        }
      }
      toast.success(`Transaction successfully Reseted!`);
        setTransactions([]);
  }
  else{
    toast.error("Enter Transaction First");
  }
  }
  async function resetloanandborrowbalance(many) {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/loanandborrow`));
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        try {
          await deleteDoc(doc.ref);         
        } catch (error) {
          toast.error("Error reseting transaction");
        }
      }
      toast.success(`Transaction successfully Reseted!`);
        setloanandborrowTransactions([]);
  }
  else{
    toast.error("Enter Transaction First");
  }
  }

   
  let sortedTransactions=transactions.sort((a,b)=>{
      return new Date(a.date) - new Date(b.date);    
  });

  useEffect(()=>{
    fetchTransactions();
  }, [user]);

  useEffect(()=>{
    loanandborrowfetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions, loanandborrowtransactions]);

  return (
    <div><Header/>
    {loading?(<p>Loading...</p>):(<>
    <Cards 
      income={income}
      expense={expense}
      totalBalance={totalBalance}
      Lent={Lent}
      borrow={Borrow}
      
      showIncomeModal={showIncomeModal } showExpenseModal={showExpenseModal}
      resetbalance={resetbalance}
      resetloanandborrowbalance={resetloanandborrowbalance}
      showLentModal={showLentModal}
      showBorrowModal={showBorrowModal} />

    <AddExpensemodal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish}>
    </AddExpensemodal>

    <AddIncomemodal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}>
    </AddIncomemodal>

    <AddLentModal
      isLentModalVisible={isLentModalVisible}
      handleLentCancel={handleLentCancel}
      onFinishlentandborrow={onFinishlentandborrow}>
    </AddLentModal>

    <AddBorrowModal
      isBorrowModalVisible={isBorrowModalVisible}
      handleBorrowCancel={handleBorrowCancel}
      onFinishlentandborrow={onFinishlentandborrow}>
    </AddBorrowModal>
    <div style={{width: '95%', margin: '1.5rem'}}> 
    {
    transactions.length > 0 ?(
    <ChartComponent transactions={sortedTransactions}/>):(<NoTransactions/>)
    }
     
    <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
    </div> 
    </>)}
    </div>
  )
}

export default Dashboard;