import React from 'react';
import { ReactComponent as Logo } from './vote.svg';
import { Alert } from 'rsuite';
import { Upvote } from './State';

export const Votebuttons: React.FC<{
  state: Upvote;
  voteCount: number;
  setVote(isUpvote: Upvote): void;
  size: string;
  isLoggedIn:boolean
  vote(isUpvote: Upvote): void;
}> = (props) => {
  function handleVote(isUpvote: Upvote) {
    if (props.isLoggedIn) {
      props.setVote(isUpvote);
      props.vote(isUpvote);
    } else {
      Alert.error(`You need to be logged in to vote`, 3000);
    }
  }

  return (
    <span className="vote-container">
      <button className="vote" onClick={() => handleVote((props.state === Upvote.Upvote ? Upvote.Unvote : Upvote.Upvote))}>
        <Logo className={(props.state === Upvote.Upvote ? 'upvoted' : 'upvote') + ' ' + props.size} />
      </button>
      <h3>{props.voteCount + (props.state === Upvote.Unvote ? 0 : props.state === Upvote.Upvote ? 1 : -1)}</h3>
      <button className="vote" onClick={() => handleVote((props.state === Upvote.Downvote ? Upvote.Unvote : Upvote.Downvote))}>
        <Logo
          className={
            (props.state === Upvote.Downvote  ? 'downvoted' : 'downvote') + ' ' + props.size
          }
        />
      </button>
    </span>
  );
};
