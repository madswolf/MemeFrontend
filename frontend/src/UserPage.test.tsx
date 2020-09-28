import React from 'react';
import { shallow } from 'enzyme';
import { render,screen } from '@testing-library/react';
import {UserPage} from './UserPage';


const state = {
    isLoggedIn : true,
    username: 'LoneliestCrab',
    email: 'theLoneliestCrab@crabmail.com',
    profilePicURL: "https://pbs.twimg.com/profile_images/1132302593521311744/pT5xEDTL_400x400.jpg"
}

test('Check if page renders',() => {
    const {getByText} = render(<UserPage username={state.username} email = {state.email} profilePicURL={state.profilePicURL} />);
    const username = getByText(/USERNAME/);
    expect(username.textContent).toBe('USERNAME');
});

describe('UserPage', () => {
    it('Renders link to Google', () => {
      const link = shallow(<UserPage username={state.username} email = {state.email} profilePicURL={state.profilePicURL}/>);
      expect(link).toMatchSnapshot();
    });  
});


