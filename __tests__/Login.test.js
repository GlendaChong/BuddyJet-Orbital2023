import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { supabase } from '../lib/supabase';
import Login from '../app/(authentication)/Login';

// jest.useFakeTimers(); // Add this line to mock timers

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));


describe('Login', () => {

  it('should display an error message when email is empty', async () => {
    
    const { getByLabelText, getByText } = render(<Login />);

    // Set up the input fields
    const passwordInput = getByLabelText('Password');

    // Enter the password value
    fireEvent.changeText(passwordInput, 'testtest');

    // Trigger the form submission
    fireEvent.press(getByText('Login'));

    // Assert the error message is displayed
    const errorMessage = getByText('Email cannot be empty');
    expect(errorMessage).toBeDefined();
  });



  // it('should display an error message when wrong login credentials are provided', async () => {
  //   const { getByLabelText, getByText, queryByText } = render(<Login />);
  
  //   // Set up the input fields
  //   const emailInput = getByLabelText('Email');
  //   const passwordInput = getByLabelText('Password');
  
  //   // Enter the email and password values
  //   fireEvent.changeText(emailInput, 'test@gmail.com');
  //   fireEvent.changeText(passwordInput, 'wrongpassword');
  
  //   // Mock the sign-in response to simulate authentication failure
  //   supabase.auth.signInWithPassword.mockRejectedValue({});
  
  //   // Trigger the form submission
  //   fireEvent.press(getByText('Login'));
  
  //   // Wait for the error message to be displayed
  //   // await waitFor(() => {
  //   //   expect(queryByText('Invalid login credentials')).toBeTruthy();
  //   // });

  //   const errorMessage = getByText('Invalid login credentials');
  //   expect(errorMessage).toBeDefined();
  // });
  



  it('should sign in with valid email and password', async () => {
    const { getByLabelText, getByText } = render(<Login />);

    // Set up the input fields
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');

    // Enter the email and password values
    fireEvent.changeText(emailInput, 'test@gmail.com');
    fireEvent.changeText(passwordInput, 'testtest');

    // Mock the sign-in response
    supabase.auth.signInWithPassword.mockResolvedValue({});

    // Trigger the form submission
    fireEvent.press(getByText('Login'));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: 'testtest',
      });
    });

    // Assert any additional expectations based on the test scenario
  });
});




