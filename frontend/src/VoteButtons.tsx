import React from "react";
import {useVoteState } from "./State";
import {ReactComponent as Logo} from "./vote.svg";
import {Alert} from 'rsuite'

export const Votebuttons :React.FC<{voteCount:number, size:string, isLoggedIn:boolean, vote(isUpvote:boolean):void}> = (props) =>{
    const {voteCount,upvoted,downvoted,setVote} = useVoteState(props.voteCount);

    function handleVote(isUpvote:boolean){
        if(props.isLoggedIn){
            setVote(isUpvote);
            props.vote(isUpvote);
        } else {
            Alert.error(`You need to be logged in to vote`,3000)
        }
    }

    return(
        <span className="vote-container">
            <button className="vote" onClick={() => handleVote(true)} >
                <Logo className= {(upvoted ? "upvoted" : "upvote") + " " + props.size} ></Logo>
            </button>
            <h3>{voteCount}</h3>
            <button className="vote" onClick={() => handleVote(false)}>
                <Logo className= {(downvoted ? "downvoted" : "downvote") + " " + props.size}></Logo>
            </button>
        </span>
    );
}