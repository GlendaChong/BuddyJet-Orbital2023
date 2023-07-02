import React from 'react';
import OnboardingScreen from '../app/(authentication)/index';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useRouter } from '../__mocks__/expo-router';

jest.mock('../__mocks__/expo-router', () => ({
  useRouter: jest.fn(),
}));


test('app boot', async () => {

  //Mocking
  useRouter.mockReturnValue({
    push: jest.fn(), // Mock the push method
  });


  const { getByText } = render(<OnboardingScreen />);
  
  // Test that fonts are loaded
  await waitFor(() => {
    const mainText = getByText('BuddyJet');
    expect(mainText).toBeTruthy();
  });

  // Test that splash screen is dismissed
  const createAccountButton = getByText('Create Account');
  expect(createAccountButton).toBeTruthy();


  // Test navigation
  const loginButton = getByText('Login Now');
  fireEvent.press(loginButton);

  // Assert that router.push is called with the expected route
  expect(useRouter().push).toHaveBeenCalledWith('./Login');
});



