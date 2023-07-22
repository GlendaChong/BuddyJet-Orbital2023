import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateAccount from "../app/(authentication)/CreateAccount";
import { supabase } from "../lib/supabase";

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe("CreateAccount", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate date of birth input format", async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);

    const nameInput = getByLabelText("Name");
    const dateOfBirthInput = getByLabelText("Date of Birth (DD-MM-YYYY)");

    // Enter an invalid date format
    fireEvent.changeText(nameInput, "John Doe");
    fireEvent.changeText(dateOfBirthInput, "01/02/2000");

    fireEvent.press(getByText("Sign Up"));

    const errorMessage = getByText(
      "Date of Birth must be in DD-MM-YYYY format"
    );
    expect(errorMessage).toBeDefined();
  });

  it("should validate phone number format", async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);

    const nameInput = getByLabelText("Name");
    const phoneNumberInput = getByLabelText("Phone Number");
    const dateOfBirthInput = getByLabelText("Date of Birth (DD-MM-YYYY)");

    // Enter an invalid date format
    fireEvent.changeText(nameInput, "John Doe");
    fireEvent.changeText(dateOfBirthInput, "01-02-2000");
    fireEvent.changeText(phoneNumberInput, "qwerty");

    fireEvent.press(getByText("Sign Up"));

    const errorMessage = getByText("Phone number contains illegal characters");
    expect(errorMessage).toBeDefined();
  });

  it("should validate if the password inputs are matching", async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);

    const nameInput = getByLabelText("Name");
    const phoneNumberInput = getByLabelText("Phone Number");
    const dateOfBirthInput = getByLabelText("Date of Birth (DD-MM-YYYY)");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm Password");

    // Enter an invalid date format
    fireEvent.changeText(nameInput, "John Doe");
    fireEvent.changeText(dateOfBirthInput, "01-02-2000");
    fireEvent.changeText(phoneNumberInput, "987654432");
    fireEvent.changeText(emailInput, "test@gmail.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.changeText(confirmPasswordInput, "notpassword");

    await waitFor(() => {
      fireEvent.press(getByText("Sign Up"));
    });

    const errorMessage = getByText(
      "Password and confirmed password does not match"
    );
    expect(errorMessage).toBeDefined();
  });

  // it("should show an error message for existing user", async () => {
  //   const { getByLabelText, getByText, debug, findByText } = render(
  //     <CreateAccount />
  //   );

  //   // Set up the input fields
  //   const nameInput = getByLabelText("Name");
  //   const dateOfBirthInput = getByLabelText("Date of Birth (DD-MM-YYYY)");
  //   const phoneNumberInput = getByLabelText("Phone Number");
  //   const emailInput = getByLabelText("Email");
  //   const passwordInput = getByLabelText("Password");
  //   const confirmPasswordInput = getByLabelText("Confirm Password");

  //   // Enter the input values
  //   fireEvent.changeText(nameInput, "John Doe");
  //   fireEvent.changeText(dateOfBirthInput, "01-01-1990");
  //   fireEvent.changeText(phoneNumberInput, "1234567890");
  //   fireEvent.changeText(emailInput, "test@gmail.com");
  //   fireEvent.changeText(passwordInput, "password123");
  //   fireEvent.changeText(confirmPasswordInput, "password123");

  //   // Mock the sign-up response to simulate an existing user scenario
  //   // const existingUserError = new Error("User already registered");
  //   // supabase.auth.signUp.mockRejectedValue();

  //   await waitFor(() => {
  //     // Trigger the form submission
  //     fireEvent.press(getByText("Sign Up"));
  //   });

  //   // Wait for the form submission to complete
  //   await waitFor(() => {
  //     expect(supabase.auth.signUp).toHaveBeenCalledWith({
  //       email: "test@gmail.com",
  //       password: "password123",
  //       options: {
  //         data: {
  //           full_name: "John Doe",
  //           phone_number: "1234567890",
  //           date_of_birth: "01-01-1990",
  //         },
  //       },
  //     });
  //   });

  //   debug();

  //   await waitFor(() => {
  //     // Assert that the error message is displayed for existing user
  //     const errorMessage = getByText("User already registered");
  //     expect(errorMessage).toBeDefined();
  //   });
  // });
});

describe("CreateAccount Integration test", () => {
  it("should sign up a new user", async () => {
    const { getByLabelText, getByText } = render(<CreateAccount />);

    // Set up the input fields
    const nameInput = getByLabelText("Name");
    const dateOfBirthInput = getByLabelText("Date of Birth (DD-MM-YYYY)");
    const phoneNumberInput = getByLabelText("Phone Number");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm Password");

    // Enter the input values
    fireEvent.changeText(nameInput, "John Doe");
    fireEvent.changeText(dateOfBirthInput, "01-01-1990");
    fireEvent.changeText(phoneNumberInput, "1234567890");
    fireEvent.changeText(emailInput, "test@gmail.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.changeText(confirmPasswordInput, "password123");

    // Mock the sign-up response
    const mockUser = { id: 123, email: "test@gmail.com" };
    supabase.auth.signUp.mockResolvedValue({ user: mockUser });

    // Trigger the form submission
    fireEvent.press(getByText("Sign Up"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "password123",
        options: {
          data: {
            full_name: "John Doe",
            phone_number: "1234567890",
            date_of_birth: "01-01-1990",
          },
        },
      });
    });
  });
});
