import './styles.css';
import { Table, Select, Radio } from 'antd';
import React, { useState } from 'react';
import Button from '../button/idex';
import { unparse, parse } from 'papaparse';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

function TransactionsTable({
  transactions,
  addTransaction,
  fetchTransactions,
}) {
  const { Option } = Select;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const { theme } = useTheme();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (item.type ? item.type.includes(typeFilter) : true)
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function Exportcsv() {
    var csv = unparse({
      fields: ['name', 'amount', 'tag', 'date', 'type'],
      data: transactions,
    });
    var data = new Blob([csv], { type: 'text/csv' });
    var csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'filename.csv');
    tempLink.click();
  }

  function Importcsv(event) {
    event.preventDefault();
    parse(event.target.files[0], {
      header: true,
      complete: async function (results) {
        for (const transaction of results.data) {
          const newTransaction = {
            ...transaction,
            amount: parseFloat(transaction.amount),
          };
          await addTransaction(newTransaction, true);
        }
      },
    });
    toast.success('All Transactions Imported');
    fetchTransactions();
    event.target.files = null;
  }

  return (
    <>
      <div className="heading">
        <h2>Transactions</h2>
      </div>
      <div className="input-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme === 'dark' ? '#fff' : '#000'}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-search"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Name"
        />
      </div>
      <div className="sorts">
      <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>

        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>

        <div className="csv-buttons">
          <Button text={'Export CSV'} onClick={Exportcsv} blue={true}>
            Export
          </Button>

          <label htmlFor="file-csv" className="btn btn-blue">
            Import From CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={Importcsv}
            style={{ display: 'none' }}
          ></input>
        </div>
      </div>
      <Table dataSource={sortedTransactions} columns={columns} />
    </>
  );
}

export default TransactionsTable;
