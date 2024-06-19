import React, { useEffect } from 'react';
import DescriptionBox from './description_box';
import {v4 as uuidV4} from 'uuid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [roomId,SetRoomId] = useState("");
  const [username,setUsername] = useState("");

  const createNewRoom = (e) =>{
    e.preventDefault();
    const id = uuidV4();
    SetRoomId(id);
    toast.success("Room Created Successfully");
  }

  const JoinRoom = () => {
    if(!roomId || !username){
      toast.error("Room Id & Username are required");
      return;
    }

    navigate(`/editor/${roomId}`,{
      state:{
        username,
      },
    })
  }
  
  const handleInputEnter = (e) =>{
    if(e.code==="Enter"){
      JoinRoom();
    }
  }

  return (
    <>
    <div className="homePageWrapper">
      <div className="description">
        <DescriptionBox/>
      </div>

      <div className="formWrapper">
        <img src="/images/LogoFinal.png" className="homeLogo" alt="NCS PRODUCTS" />
        <h4 className="mainLabel">Paste Invitation Room Id</h4>
        <div className="InputGroup">
          <input 
            type="text" 
            className="InputBox" 
            placeholder="Room Id"
            onChange={(e)=>SetRoomId(e.target.value)}
            value = {roomId}
            onKeyUp={handleInputEnter}
          />
          <input type="text" 
            className="InputBox" 
            placeholder="userName"
            onChange={(e)=>setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button className='btn joinBtn' onClick={JoinRoom}>Join</button>
          <span className='createInfo'>If you don't have an invite, then create &nbsp; <a onClick={createNewRoom} href="" className="createNewBtn">new room</a></span>
        </div>
      </div>
    </div>
    <footer className='footer'>
      <h4>Created by 🚀 <a href="/ncs-portfolio" className="createNewBtn">Divyansh</a></h4>
    </footer>
    </>
  )
}

export default Home
