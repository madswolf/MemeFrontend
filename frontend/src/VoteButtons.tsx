import React from 'react';
import { ReactComponent as Logo } from './vote.svg';
import { Alert } from 'rsuite';

export const Votebuttons: React.FC<{
  state: boolean | undefined;
  voteCount: number;
  setVote(isUpvote: boolean): void;
  size: string;
  isLoggedIn: boolean;
  vote(isUpvote: boolean): void;
}> = (props) => {
  function handleVote(isUpvote: boolean) {
    if (props.isLoggedIn) {
      props.setVote(isUpvote);
      props.vote(isUpvote);
    } else {
      Alert.error(`You need to be logged in to vote`, 3000);
    }
  }

  return (
    <span className="vote-container">
      <button className="vote" onClick={() => handleVote(true)}>
        <Logo className={(props.state ? 'upvoted' : 'upvote') + ' ' + props.size} />
      </button>
      <h3>{props.voteCount + (props.state == null ? 0 : props.state ? 1 : -1)}</h3>
      <button className="vote" onClick={() => handleVote(false)}>
        <Logo
          className={
            (props.state != null && !props.state ? 'downvoted' : 'downvote') + ' ' + props.size
          }
        />
      </button>
    </span>
  );
};
