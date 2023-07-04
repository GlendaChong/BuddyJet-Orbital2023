import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateAccount from '../app/(authentication)/CreateAccount';
import { supabase } from '../lib/supabase';

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe('CreateAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });



  it('should validate date of birth input format', async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);
  
    const nameInput = getByLabelText('Name');
    const dateOfBirthInput = getByLabelText('Date of Birth (DD-MM-YYYY)');
  
    // Enter an invalid date format
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(dateOfBirthInput, '01/02/2000');

    fireEvent.press(getByText('Sign Up'));

    const errorMessage = getByText('Date of Birth must be in DD-MM-YYYY format');
    expect(errorMessage).toBeDefined();

  });

  it('should validate phone number format', async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);
  
    const nameInput = getByLabelText('Name');
    const phoneNumberInput = getByLabelText('Phone Number');
    const dateOfBirthInput = getByLabelText('Date of Birth (DD-MM-YYYY)');
  
    // Enter an invalid date format
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(dateOfBirthInput, '01-02-2000');
    fireEvent.changeText(phoneNumberInput, 'qwerty');

    fireEvent.press(getByText('Sign Up'));

    const errorMessage = getByText('Phone number contains illegal characters');
    expect(errorMessage).toBeDefined();

  });
  

  it('should sign up a new user', async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);

    // Set up the input fields
    const nameInput = getByLabelText('Name');
    const dateOfBirthInput = getByLabelText('Date of Birth (DD-MM-YYYY)');
    const phoneNumberInput = getByLabelText('Phone Number');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const confirmPasswordInput = getByLabelText('Confirm Password');

    // Enter the input values
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(dateOfBirthInput, '01-01-1990');
    fireEvent.changeText(phoneNumberInput, '1234567890');
    fireEvent.changeText(emailInput, 'test@gmail.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    // Mock the sign-up response
    const mockUser = { id: 123, email: 'test@gmail.com' };
    supabase.auth.signUp.mockResolvedValue({ user: mockUser });

    // Trigger the form submission
    fireEvent.press(getByText('Sign Up'));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
            phone_number: '1234567890',
            date_of_birth: '01-01-1990',
          },
        },
      });
    });

    // Assert that the user is signed up successfully
    // You can add your own assertions based on the desired behavior
    // For example, you can assert that a success message is displayed
    // or that the user is redirected to a different page.

    // ...

  });
});
