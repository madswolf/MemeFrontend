import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';

const state = {
    isLoggedIn : true,
    username: 'LoneliestCrab',
    email: 'theLoneliestCrab@crabmail.com',
    profilePicURL: "https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg"
}

test('HomePage renders with username', () => {
    const {getByText} = render(<HomePage isLoggedIn={state.isLoggedIn} username={state.username} />);
    const greeting = getByText(/Welcome back/);
    expect(greeting.textContent).toBe('Welcome back ' + state.username + '!');
});

test('HomePage renders as guest', () => {
    const {getByText} = render(<HomePage isLoggedIn={false} username={state.username}/>);
    const greeting = getByText(/Hello/);
    expect(greeting.textContent).toBe('Hello you lonely crab');
});