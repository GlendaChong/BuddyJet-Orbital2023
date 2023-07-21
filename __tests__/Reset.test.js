import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Profile from "../app/(home)/Profile/index";
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
      delete: jest.fn().mockResolvedValue({}),
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
      update: jest.fn(),
      eq: jest.fn(),
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

describe("Reset Component", () => {
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

  test("should delete expenses when 'Reset' is pressed in the confirmation prompt for 'Reset Expenses' button", async () => {
    // Mock supabase method for delete

    supabase.from("expenses").delete = jest
      .fn()
      .mockResolvedValue({ error: null });

    // Mock the Alert.alert function
    Alert.alert = jest.fn((title, message, buttons) => {
      // Simulate pressing the "Reset" button in the confirmation alert
      buttons[1].onPress();
    });

    const { getByText } = render(<Profile />);

    await waitFor(() => {
      const resetExpensesButton = getByText("Reset Expenses");
      fireEvent.press(resetExpensesButton);
    });

    // Check if the expenses are deleted
    await waitFor(() => {
      expect(supabase.from("expenses").delete)
        .toHaveBeenCalledWith("*")
        .eq("user_id", "user123");
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
