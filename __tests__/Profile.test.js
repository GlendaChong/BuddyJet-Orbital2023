import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Profile from "../app/(home)/Profile/index";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

// Mock the TouchableOpacity component
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

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: jest.fn(() => ({
        data: [
          {
            full_name: "John Doe",
            phone_number: "123456789",
            email: "john.doe@example.com",
            date_of_birth: "01-01-1990",
            avatar_url: "https://example.com/avatar.jpg",
          },
        ],
        error: null,
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    }),
    storage: {
      from: () => ({
        upload: jest.fn(() => ({
          data: {
            path: "path/to/uploaded/image.jpg",
          },
          error: null,
        })),
        getPublicUrl: jest.fn(() => ({
          data: {
            publicUrl: "https://example.com/avatar.jpg",
          },
          error: null,
        })),
      }),
    },
  },
}));

describe("Profile Component", () => {
  test("renders Profile page", () => {
    const { getByText } = render(<Profile />);
    // Check if the page title is rendered
    const pageTitle = getByText("Profile");
    expect(pageTitle).toBeTruthy();

    // Add more assertions to test other elements on the page
  });

  test("should show user data when available", async () => {
    const { getByPlaceholderText, debug, getByTestId } = render(<Profile />);
    await waitFor(() => {
      expect(getByPlaceholderText("John Doe")).toBeTruthy();
      expect(getByPlaceholderText("123456789")).toBeTruthy();
      expect(getByPlaceholderText("john.doe@example.com")).toBeTruthy();
      expect(getByPlaceholderText("01-01-1990")).toBeTruthy();
      expect(getByTestId("profile-pic").props.source).toEqual({
        uri: "https://example.com/avatar.jpg",
      });
    });

    debug();
  });

  test("should display the updated details when updating the text field input", async () => {
    const { getByText, getByPlaceholderText } = render(<Profile />);

    await waitFor(() => {
      // Find the 'Update' button
      const updateButton = getByText("Update");

      // Find the 'Name' TextInput and change its value
      const nameInput = getByPlaceholderText("John Doe");
      fireEvent.changeText(nameInput, "New Name");

      // Find the 'Phone Number' TextInput and change its value
      const phoneNumberInput = getByPlaceholderText("123456789");
      fireEvent.changeText(phoneNumberInput, "987654321");

      // Find the 'Email' TextInput and change its value
      const emailInput = getByPlaceholderText("john.doe@example.com");
      fireEvent.changeText(emailInput, "new.email@example.com");

      // Find the 'Date of Birth' TextInput and change its value
      const dobInput = getByPlaceholderText("01-01-1990");
      fireEvent.changeText(dobInput, "01-02-1990");

      // Click the 'Update' button
      // fireEvent.press(updateButton);
      expect(getByPlaceholderText("New Name")).toBeTruthy();
      expect(getByPlaceholderText("987654321")).toBeTruthy();
      expect(getByPlaceholderText("new.email@example.com")).toBeTruthy();
      expect(getByPlaceholderText("01-02-1990")).toBeTruthy();
    });
  });

  test("should prompt confirmation when 'Reset Expenses' button is clicked", async () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation();
    const { getByText } = render(<Profile />);

    await waitFor(() => {
      const resetExpensesButton = getByText("Reset Expenses");
      fireEvent.press(resetExpensesButton);

      // Add assertions to check if the confirmation alert is displayed
      expect(alertSpy).toHaveBeenCalledWith(
        "Reset Confirmation",
        "Are you sure you want to reset Expenses?",
        expect.arrayContaining([
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset",
            onPress: expect.any(Function),
            style: "destructive",
          },
        ]),
        { cancelable: true }
      );
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

describe("Profile Component Integration Test", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders Profile page and performs integration tests", async () => {
    // Mock the ImagePicker result
    ImagePicker.launchImageLibraryAsync = jest.fn(() =>
      Promise.resolve({ cancelled: false, uri: "path/to/image.jpg" })
    );

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation();

    // Render the Profile component
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Profile />
    );

    // Check if the page title is rendered
    const pageTitle = getByText("Profile");
    expect(pageTitle).toBeTruthy();

    // // Test the initial display of user data
    await waitFor(() => {
      expect(getByPlaceholderText("John Doe")).toBeTruthy();
      expect(getByPlaceholderText("123456789")).toBeTruthy();
      expect(getByPlaceholderText("john.doe@example.com")).toBeTruthy();
      expect(getByPlaceholderText("01-01-1990")).toBeTruthy();
    });

    // Test updating the text field input
    const nameInput = getByPlaceholderText("John Doe");
    fireEvent.changeText(nameInput, "New Name");
    const phoneNumberInput = getByPlaceholderText("123456789");
    fireEvent.changeText(phoneNumberInput, "987654321");
    const emailInput = getByPlaceholderText("john.doe@example.com");
    fireEvent.changeText(emailInput, "new.email@example.com");
    const dobInput = getByPlaceholderText("01-01-1990");
    fireEvent.changeText(dobInput, "01-02-1990");

    await waitFor(() => {
      // Check if the updated details are displayed
      expect(getByPlaceholderText("New Name")).toBeTruthy();
      expect(getByPlaceholderText("987654321")).toBeTruthy();
      expect(getByPlaceholderText("new.email@example.com")).toBeTruthy();
      expect(getByPlaceholderText("01-02-1990")).toBeTruthy();
    });

    await waitFor(() => {
      // Test clicking the 'Update' button
      const updateButton = getByTestId("Update-button");
      fireEvent.press(updateButton);
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Success",
      "Profile updated successfully"
    );
  });
});
