import React, { useState } from 'react';
import "./styles.css";
import Input from '../input';
import { Form, useNavigate } from 'react-router-dom';
import Button from '../button/idex';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth,db, provider } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from '../../context/ThemeContext';

function SignupSigninComponent() {
const { theme } = useTheme();
const[name,setName]=useState("");
const[password,setPassword]=useState("");
const[email,setEmail]=useState("");
const[confirmpassword,setConfirmPassword]=useState("");
const[loading,setloading]=useState(false);
const[loginForm,setLoginForm]=useState(false)
const navigate=useNavigate();

function signupWithEmail()
{
  setloading(true);
  if(name!="" && password!="" && email!="" && confirmpassword!="")
 {
  if(password==confirmpassword)
  {
   createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    toast.success("User Created!")
    setloading(false);
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    createDoc(user);
    navigate("/dashboard")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setloading(false);
    // ..
  });
}
else{
  toast.error("Password does not match confirm Password")
  setloading(false);
}
}
else{
  toast.error("All files are mandatory!")
  setloading(false);
}
}
async function createDoc(user){
  setloading(true);

  const userRef=doc(db, "users",user.uid);
  const userData=await getDoc(userRef)
if(!userData.exists())
  {
    try{
   await setDoc(doc(db, "users", user.uid), {
    name: user.displayName?user.displayName:name,
    email: user.email,
    photoURL: user.photoURL?user.photoURL:"",
    createdAT: new Date(),
  });
  toast.success("Doc created");
  setloading(false);
}catch(e){
  toast.error(e.message);
  setloading(false);
}
}
else{
  toast.error("Doc already exists");
  setloading(false);
}
}



function loginUsingEmail(){

  setloading(true);
  if(email!="" && password!="")
  {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      toast.success("user logged in")
      setloading(false);
      navigate("/dashboard")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage)
      setloading(false);
    });
  }
  else{
    toast.error("all fields are mandatory!")
    setloading(false);
  }
 
}

function googleAuth()
{
  setloading(true);
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    toast.success("signned in successfully")
    createDoc(user);
    navigate("/dashboard")
    setloading(false);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    toast.error(error.message)
    setloading(false);
    // ...
  });

}
  return (
    <>
    {
    loginForm?(<div className='signup-wrapper'>
      <h2 className='title'>Login On <span style={{color: "var(--theme)"}}>FinanceX</span></h2>
    <form>
   
      <Input
       type="email"
       label={"Email ID"} 
      state={email} 
      setState={setEmail} 
      placeholder={"Enter Your Email ID"}/> 

      <Input 
      type="password"
      label={"Password"} 
      state={password} 
      setState={setPassword} 
      placeholder={"Example @123*"}/>

      <Button 
      disabled={loading}
      text={loading?"loading....":"Login"} onClick={loginUsingEmail}/> 

      <p style={{textAlign:"center"}}>or</p>

      <Button text={loading?"loading....":"Login using Google"} blue={true} onClick={googleAuth}/> 

      <p className='p-login' style={{cursor:"pointer"}} onClick={()=> setLoginForm(!loginForm)}>Don't have an account already? Click here</p> 
    </form>
      </div>):
    (<div className='signup-wrapper'>
      <h2 className='title'>Signup On <span style={{color: "var(--theme)"}}>FinanceX</span></h2>
    <form>
      <Input label={"Full Name"} 
      state={name} 
      setState={setName} 
      placeholder={"Enter Your Name"}/>


      <Input
       type="email"
       label={"Email ID"} 
      state={email} 
      setState={setEmail} 
      placeholder={"Enter Your Email ID"}/> 

      <Input 
      type="password"
      label={"Password"} 
      state={password} 
      setState={setPassword} 
      placeholder={"Example @123*"}/>
  
      <Input 
       type="password"
      label={"Confirm Password"} 
      state={confirmpassword} 
      setState={setConfirmPassword} 
      placeholder={"Example @123*"}/>

      <Button 
      disabled={loading}
      text={loading?"loading....":"Signup"} onClick={signupWithEmail}/> 

      <p style={{textAlign:"center"}}>or</p>

      <Button text={loading?"loading....":"Signup using Google"} blue={true} onClick={googleAuth}/>  

      <p className='p-login' style={{cursor:"pointer"}} onClick={()=> setLoginForm(!loginForm)}> Have an account already? Click here</p> 
    </form>
      </div>)
      }
    
      </>
  )
}

export default SignupSigninComponent;