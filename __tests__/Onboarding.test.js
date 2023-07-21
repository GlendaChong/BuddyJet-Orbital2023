import React from 'react';
import OnboardingScreen from '../app/(authentication)/index';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useRouter } from '../__mocks__/expo-router';

jest.mock('../__mocks__/expo-router', () => ({
  useRouter: jest.fn(),
}));


describe('Onboarding', () => {

  useRouter.mockReturnValue({
    push: jest.fn(), // Mock the push method
  });

  it('should navigate to create account page when Create Account button is pressed', async () => {
    
    const { getByText } = render(<OnboardingScreen />);
    const loginButton = getByText('Create Account');
    fireEvent.press(loginButton);
  
    // Assert that router.push is called with the expected route
    expect(useRouter().push).toHaveBeenCalledWith('./CreateAccount');
  });

  it('should navigate to login page when Login button is pressed', async () => {
    
    const { getByText, findByText } = render(<OnboardingScreen />);
    const loginButton = getByText('Login Now');
    fireEvent.press(loginButton);
  
    // Assert that router.push is called with the expected route
    expect(useRouter().push).toHaveBeenCalledWith('./Login');
  });

});



