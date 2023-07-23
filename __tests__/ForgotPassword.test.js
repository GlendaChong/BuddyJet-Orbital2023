import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import ForgotPassword from "../app/(authentication)/ForgotPassword";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { email: "test@example.com" },
        error: null,
      }),
    })),
    auth: {
      signInWithOtp: jest.fn().mockResolvedValue({}),
      verifyOtp: jest.fn().mockResolvedValue({}),
    },
  },
}));

jest.mock(
  "react-native/Libraries/Components/Touchable/TouchableOpacity",
  () => {
    const { View } = require("react-native");
    const TouchableOpacityMock = (props) => {
      return <View {...props} />;
    };
    TouchableOpacityMock.displayName = "TouchableOpacity";

    return TouchableOpacityMock;
  }
);

describe("ForgotPassword Component", () => {
  it("should call signInWithOtp when the Reset Password button is pressed with a valid email", async () => {
    const { getByTestId } = render(<ForgotPassword />);

    // Fill the email field
    fireEvent.changeText(getByTestId("text-input-flat"), "test@example.com");

    // Simulate Reset Password button press
    fireEvent.press(getByTestId("button-text"));

    // Wait for signInWithOtp to be called
    await waitFor(() =>
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledTimes(1)
    );

    // Check if signInWithOtp was called with the correct arguments
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("should show an error message when the Reset Password button is pressed with an empty email", async () => {
    const { getByTestId, getByText } = render(<ForgotPassword />);

    // Simulate Reset Password button press with an empty email
    fireEvent.press(getByTestId("button-text"));

    // Check if the error message is shown
    await waitFor(() =>
      expect(getByText("Email cannot be empty")).toBeTruthy()
    );
  });

  // Add more test cases to cover different scenarios, such as handling different error messages or OTP verification success.

  it("should call verifyOtp when the Verify button is pressed with a valid OTP", async () => {
    // Create a mock function for setState (useState)
    const setState = jest.fn();

    // Mock the useState hook
    jest
      .spyOn(React, "useState")
      .mockReturnValueOnce(["test@example.com", setState]); // email value
    jest.spyOn(React, "useState").mockReturnValueOnce(["123456", setState]); // OTP value
    jest.spyOn(React, "useState").mockReturnValueOnce([true, setState]); // loading value
    jest.spyOn(React, "useState").mockReturnValueOnce([" ", setState]); // err value
    jest.spyOn(React, "useState").mockReturnValueOnce([true, setState]); // isEmailSent = true

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation();

    const { getByTestId } = render(<ForgotPassword />);

    // Simulate Verify button press
    fireEvent.press(getByTestId("button-text"));

    // Wait for verifyOtp to be called
    await waitFor(() =>
      expect(supabase.auth.verifyOtp).toHaveBeenCalledTimes(1)
    );

    // Check if verifyOtp was called with the correct arguments
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      token: "123456",
      type: "email",
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "OTP Verification Successful",
      "Please proceed to change your password at the Profile Tab.",
      expect.arrayContaining([{ text: "OK", onPress: expect.any(Function) }])
    );
  });
});
