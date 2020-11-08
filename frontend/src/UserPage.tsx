import React, { useState } from 'react';
import { Alert, Button, Input } from 'rsuite';
import { email, isLoggedIn, login, profilePic, userName } from './State';
import { MemeLoader } from './UploadPage';

import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { apiHost } from './App';

function UserPicture(profilePicURL:string, classExtension :string) {
  let className = classExtension === "" ? "User-picture" : "User-picture-" + classExtension
  return (
    <div>
      <img src={profilePicURL} className={className} alt="user-profile" />
    </div>
  );
}

const UserPage:React.FC<(userName & email & profilePic & login & isLoggedIn)> = (props) => {
  //state for editing user
  const[isEditing,setIsEditing] = useState(false);
  const[editedUserName,setEditedUserName] = useState(props.username);
  const[editedEmail,seteditedEmail] = useState(props.email);
  const[password,setPassword] = useState('');
  const[profilePic,setNewProfilePic] = useState<File>();
  //state for displaying new profile pic
  const[profilePicURL,setProfilePicURL] = useState('');
  //state for changing password
  const[isEditingPassword,setIsEditingPassword] = useState(false);
  const[newPassword,setNewPassword] = useState('');

  const [isLoading,setIsLoading] = useState(false);
  const [toolTipString,setToolTipString] = useState("");

  function UserField(name:string,value:string,input:boolean,onChange:React.Dispatch<React.SetStateAction<string>>){
    return(
      <li className="User-field">
        <text className="User-field-name">{name}</text>
        <br/>
        {!input? <text className="User-field-value">{value}</text> : <Input className="User-field-value" value={value} onChange={(v,e) => onChange(v)}></Input>}
      </li>
    );
  }

  function fileChangeHandler(v:string,event:React.SyntheticEvent<HTMLElement>){
    const target = ((event.currentTarget as HTMLInputElement))
    if (target.files){
      var fr = new FileReader();
      fr.onload = () => {
        setProfilePicURL(fr.result as string)
      };
      setNewProfilePic(target.files[0]);
      fr.readAsDataURL(target.files[0]);
    }
  }

  function handleUpload(){
    if(password){
      let formdata = new FormData();
      if (editedUserName !== props.username){
        formdata.append("username",editedUserName);
      }
      if (editedEmail !== props.email){
        formdata.append("email",editedEmail);
      }
      if (profilePic){
        formdata.append("newProfilePic",profilePic);
      }
      if(newPassword){
        formdata.append("newPassword",newPassword)
      }
      formdata.append("password",password);

      setIsLoading(true);
      axios.post(`https://${apiHost}/user/update`,formdata, {
        headers: {
          'Content-Type' : 'multipart/form-data',
          'auth' : props.token
        }
      }).then(response => {
        if(response.status===200){
          setIsEditing(false);
          setIsEditingPassword(false);

          seteditedEmail('')
          setEditedUserName('')
          setProfilePicURL('')
          setNewProfilePic(undefined);
          setNewPassword('');
          props.login({...response.data,isLoggedIn:true,profilePicURL:`/public/${response.data.profilePicFileName}`})
        } else {
          setToolTipString(response.headers.error);
        } 
        setIsLoading(false);
      }) 
    }
      
  }
  
  return(
    <div className="User-page">
      <div className="User-box-container">
        <div className="User-box">  
            {!profilePic? UserPicture(props.profilePicURL,"") :  UserPicture(profilePicURL,"")}
            <div className="User-info-container">
              <ul className="User-info">
                {isEditing ? 
                  <li className="User-field">
                    <text className="User-field-name">PROFILE PICTURE</text>
                    <br/>
                    <Input type="file" accept=".png,.jpg,.jpeg" className="User-field-value"  onChange={fileChangeHandler} />
                  </li> 
                : null}
                {UserField("USERNAME",editedUserName,isEditing,setEditedUserName)}
                {UserField("E-MAIL",editedEmail,isEditing,seteditedEmail)}  
                {isEditing ? UserField("NUVÆRENDE PASSWORD",password, true, setPassword) : null}
                {isEditing ? !isEditingPassword ? <Button appearance="link" onClick={() => setIsEditingPassword(true)}>Ændre password?</Button> : UserField("NYT PASSWORD",newPassword, true, setNewPassword) : null}            
              </ul>
            </div>
            <div className="User-edit-button-container">
              {!isEditing? 
                <Button className="User-edit-button" appearance="primary" onClick={() => setIsEditing(!isEditing)}>Rediger</Button>
                :
                <div>
                  <Button appearance="ghost" color="red" onClick={() => Alert.error("Not implemented: too bad")}>Slet konto</Button>
                  <Button appearance="subtle" onClick={() => {setIsEditing(false); setIsEditingPassword(false)} }>Annuller</Button>
                  {!toolTipString? <Button appearance="primary" color="green" onClick={() => handleUpload()}>Gem</Button> : <Button data-tip data-for="submit" appearance="primary" color="green" onClick={() => handleUpload()}>Gem</Button>}
                </div>
              }
            </div>
            <MemeLoader isloading={isLoading}/>
        </div>
      </div>
      <ReactTooltip id="submit" place="top" effect="solid">
        {toolTipString}
      </ReactTooltip>
    </div>
  );
}


export {UserPage,UserPicture};
