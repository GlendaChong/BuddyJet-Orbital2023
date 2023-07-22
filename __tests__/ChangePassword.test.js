import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ChangePassword from "../app/(home)/Profile/ChangePassword";
import { supabase } from "../lib/supabase";

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      updateUser: jest.fn().mockResolvedValue({ error: null }),
      signOut: jest.fn(),
    },
  },
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({
    selectedMonth: "sample-month",
    selectedYear: "sample-year",
    monthIndex: "sample-month-index",
  }),
}));

describe("ChangePassword Component", () => {
  test("renders fields correctly", () => {
    const { getByLabelText } = render(<ChangePassword />);
    const emailField = getByLabelText("Email");
    const newPasswordField = getByLabelText("New Password");
    const confirmNewPasswordField = getByLabelText("Confirm New Password");
    expect(emailField).toBeTruthy();
    expect(newPasswordField).toBeTruthy();
    expect(confirmNewPasswordField).toBeTruthy();
  });

  test("shows error message on missing email", () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);
    const emailField = getByLabelText("Email");
    const changeButton = getByText("Change");

    fireEvent.changeText(emailField, ""); // Set the email field to an empty string
    fireEvent.press(changeButton);

    const errorMessage = getByText("Email cannot be empty");
    expect(errorMessage).toBeTruthy();
  });

  test("shows error message on mismatching passwords", () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);
    const emailField = getByLabelText("Email");
    const newPasswordField = getByLabelText("New Password");
    const confirmNewPasswordField = getByLabelText("Confirm New Password");
    const changeButton = getByText("Change");

    fireEvent.changeText(emailField, "test@example.com");
    fireEvent.changeText(newPasswordField, "newpassword");
    fireEvent.changeText(confirmNewPasswordField, "differentpassword"); // Set different password for confirmation
    fireEvent.press(changeButton);

    const errorMessage = getByText("Passwords do not match");
    expect(errorMessage).toBeTruthy();
  });

  test("should call updateUser when the form is submitted with valid inputs", async () => {
    const { getByText } = render(<ChangePassword />);
    const emailField = getByText("Email");
    const newPasswordField = getByText("New Password");
    const confirmNewPasswordField = getByText("Confirm New Password");
    const changeButton = getByText("Change");

    fireEvent.changeText(emailField, "test@example.com");
    fireEvent.changeText(newPasswordField, "newpassword");
    fireEvent.changeText(confirmNewPasswordField, "newpassword");
    fireEvent.press(changeButton);

    // Wait for updateUser to be called
    await waitFor(() =>
      expect(supabase.auth.updateUser).toHaveBeenCalledTimes(1)
    );

    // Check if updateUser was called with the correct arguments
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "newpassword",
    });
  });
});
