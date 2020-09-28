import React from 'react';
import { render,screen } from '@testing-library/react';
import {UserPage} from './UserPage';
import { scryRenderedDOMComponentsWithClass, renderIntoDocument } from 'react-dom/test-utils';
import { Console } from 'console';

const state = {
    isLoggedIn : true,
    username: 'LoneliestCrab',
    email: 'theLoneliestCrab@crabmail.com',
    profilePicURL: "https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg"
}

test('Check if page renders',() => {
    const {getByText} = render(<UserPage isLoggedIn={state.isLoggedIn} username={state.username} email = {state.email} profilePicURL={state.profilePicURL} />);
    const username = getByText(/USERNAME/);
    expect(username.textContent).toBe('USERNAME');
});


