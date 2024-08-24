import React from 'react'
import image from "../../assets/transactions.svg"
function NoTransactions() {
  return (
   <div style={{width:"100%", display:"flex",justifyContent:"center",alignItems:"center"}}> <img src={image} style={{width:"300px"}} /></div>
  )
}

export default NoTransactions