import React, { useState, useEffect } from 'react';
import { Table, Select, Radio, Spin } from 'antd';
import searchImg from "../../assets/search.svg";
import { collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from 'react-toastify';
import "./styles.css";
import Header from '../Header';
import NoTransactionsNew from '../notransactionsnew';

const { Option } = Select;

function Analysis() {
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/loanandborrow`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
    } catch (e) {
      toast.error("Failed to fetch transactions.");
    }
    setLoading(false);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Due Date",
      dataIndex: "duedate",
      key: "duedate",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
  ];

  let lentBorrowedTransactions = transactions.filter((item) => 
    item.type === 'lent' || item.type === 'borrow'
  );
  let filteredTransactions = lentBorrowedTransactions.filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase()) && 
    (item.type ? item.type.includes(typeFilter) : true)
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  return (
    <>
    <Header />
      <div className='inputandselect'>
        <div className='input-flex'>
          <img src={searchImg} width="16" alt="Search Icon" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by Name'
          />
        </div>
        <Select 
          className='select-input'
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="lent">Lent</Option>
          <Option value="borrow">Borrowed</Option>
        </Select>
      </div>
      <div className='analysissorts'>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
      </div>
      <div className='heading'><h2>Transactions</h2></div>
      {loading ? (
        <Spin size="large" />
      ) : (
       sortedTransactions.length > 0 ?(
          <Table dataSource={sortedTransactions} columns={columns} rowKey="name" />)
          :(<NoTransactionsNew/>)
        
      )}
    </>
  );
}

export default Analysis;
