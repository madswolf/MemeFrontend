import React from 'react';
import { ReactComponent as Logo } from './vote.svg';
import { Alert } from 'rsuite';
import { isLoggedIn } from './State';

export const Votebuttons: React.FC<{
  state: boolean | undefined;
  voteCount: number;
  setVote(isUpvote: boolean | undefined): void;
  size: string;
  isLoggedIn:boolean
  vote(isUpvote: boolean | undefined): void;
}> = (props) => {
  function handleVote(isUpvote: boolean | undefined) {
    if (props.isLoggedIn) {
      props.setVote(isUpvote);
      props.vote(isUpvote);
    } else {
      Alert.error(`You need to be logged in to vote`, 3000);
    }
  }

  return (
    <span className="vote-container">
      <button className="vote" onClick={() => handleVote((props.state === true ? undefined : true))}>
        <Logo className={(props.state ? 'upvoted' : 'upvote') + ' ' + props.size} />
      </button>
      <h3>{props.voteCount + (props.state == null ? 0 : props.state ? 1 : -1)}</h3>
      <button className="vote" onClick={() => handleVote((props.state === false ? undefined : false))}>
        <Logo
          className={
            (props.state != null && !props.state ? 'downvoted' : 'downvote') + ' ' + props.size
          }
        />
      </button>
    </span>
  );
};
