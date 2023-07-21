import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import AddExpenses from "../app/(home)/Expenses/AddExpenses";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/auth";

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

// Mock the useAuth hook to provide a mock user object with an 'id' property
jest.mock("../contexts/auth", () => ({
  useAuth: jest.fn(() => ({ user: { id: "mocked-user-id" } })),
}));

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({}),
  },
}));

describe("AddExpenses", () => {
  test("should handle form input and state changes correctly", () => {
    const { getByLabelText } = render(<AddExpenses />);

    const descriptionInput = getByLabelText("Description");
    const dateInput = getByLabelText("Date (DD/MM/YYYY)");
    const amountInput = getByLabelText("Amount");

    // Type into form inputs
    fireEvent.changeText(descriptionInput, "Expense Description");
    fireEvent.changeText(dateInput, "01/01/2022");
    fireEvent.changeText(amountInput, "100");

    // Assert that the form inputs update the component's state correctly
    expect(descriptionInput.props.value).toBe("Expense Description");
    expect(dateInput.props.value).toBe("01/01/2022");
    expect(amountInput.props.value).toBe("100");
  });

  test("should show the correct options and select an item", async () => {
    const { getByTestId, getByText } = render(<AddExpenses />);

    // Open the dropdown
    fireEvent.press(getByTestId("category-field"));

    //Select the option
    fireEvent(getByTestId("category-field"), "onChange", { value: "Food" });

    const food = getByText("Food");
    expect(food).toBeTruthy();
  });

  test("should handle payment mode selection correctly", async () => {
    const { getByTestId, getByText } = render(<AddExpenses />);

    // Open the dropdown
    fireEvent.press(getByTestId("payment-field"));

    //Select the option
    fireEvent(getByTestId("payment-field"), "onChange", { value: "Cash" });

    const Cash = getByText("Cash");
    expect(Cash).toBeTruthy();
  });

  test("should display error message if form fields are not filled", () => {
    const { getByText } = render(<AddExpenses />);

    const addButton = getByText("Add Expense");
    fireEvent.press(addButton);

    // Assert that the error message is displayed for empty form fields
    expect(getByText("Description cannot be empty")).toBeTruthy();
    // expect(getByText("Date cannot be empty")).toBeTruthy();
    // expect(getByText("Amount cannot be empty")).toBeTruthy();
    // expect(getByText("Category cannot be empty")).toBeTruthy();
    // expect(getByText("Payment mode cannot be empty")).toBeTruthy();
  });
});

describe("Expenses integration test ", () => {
  test("should allow user to create an expense entry with valid input", async () => {
    const { getByTestId, getByLabelText, getByText } = render(<AddExpenses />);

    const descriptionInput = getByLabelText("Description");
    const dateInput = getByLabelText("Date (DD/MM/YYYY)");
    const amountInput = getByLabelText("Amount");

    await act(() => {
      // Set up values for the form fields
      fireEvent.changeText(descriptionInput, "Expense Description");
      fireEvent.changeText(dateInput, "01/01/2022");
      fireEvent.changeText(amountInput, "100");
      fireEvent(getByTestId("payment-field"), "onChange", { value: "Cash" });
      fireEvent(getByTestId("category-field"), "onChange", { value: "Food" });
    });

    // Simulate button press to trigger handleSubmit
    fireEvent.press(getByText("Add Expense"));

    const expectedData = {
      description: "Expense Description",
      user_id: "mocked-user-id",
      date: "2022/01/01",
      amount: "100",
      category: "Food", // Replace with the selected category from your form
      payment_mode: "Cash", // Replace with the selected payment mode from your form
    };

    expect(supabase.from().insert).toHaveBeenCalledWith(expectedData);
  });
});
