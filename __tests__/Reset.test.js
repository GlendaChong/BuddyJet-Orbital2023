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
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({}),
    select: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    mockReturnValueOnce: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
  },
}));

describe("Reset Component", () => {
  test("should prompt confirmation when 'Reset Expenses' button is clicked", async () => {
    const mockProfilesData = [{ id: "mocked-id" }];

    // Mock the supabase.from('profiles').select('id') to return the mock profiles data
    jest.spyOn(supabase, "from").mockReturnThis();
    jest
      .spyOn(supabase, "select")
      .mockResolvedValue({ data: mockProfilesData });

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
    const mockProfilesData = [{ user_id: "mocked-id" }];

    // Mock the supabase.from('profiles').select('id') to return the mock profiles data
    jest.spyOn(supabase, "from").mockReturnThis();
    jest
      .spyOn(supabase, "select")
      .mockResolvedValue({ data: mockProfilesData });

    const mockExpensesData = [
      { id: 1, description: "Expense 1", amount: 100 },
      { id: 2, description: "Expense 2", amount: 50 },
    ];

    jest.spyOn(supabase, "select").mockReturnValueOnce({
      data: mockExpensesData,
    });

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
      expect(supabase.from).toHaveBeenCalledWith("expenses");
      expect(supabase.delete).toHaveBeenCalledWith("*");
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "");
    });
  });
});
