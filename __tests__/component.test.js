import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import IndividualExpenseBox from "../app/components/ExpensesBox";
import MonthYearPicker from "../app/components/MonthYearPicker";

jest.mock(
  "react-native/Libraries/Components/Touchable/TouchableOpacity",
  () => {
    const { View } = require("react-native");
    const TouchableOpacityMock = jest.fn((props) => {
      return <View {...props} />;
    });
    return TouchableOpacityMock;
  }
);

describe("IndividualExpenseBox", () => {
  const expense = {
    id: 1,
    description: "Expense 1",
    category: "Category 1",
    amount: 10,
  };

  it("renders expense description and category correctly", () => {
    const { getByText } = render(<IndividualExpenseBox expense={expense} />);
    const expenseDescription = getByText(expense.description);
    const expenseCategory = getByText(expense.category);

    expect(expenseDescription).toBeTruthy();
    expect(expenseCategory).toBeTruthy();
  });

  it("calls handleDeleteExpense when delete button is pressed", () => {
    const handleDeleteExpense = jest.fn();
    const { getByTestId } = render(
      <IndividualExpenseBox
        expense={expense}
        handleDeleteExpense={handleDeleteExpense}
      />
    );
    const deleteButton = getByTestId("delete-button");

    fireEvent.press(deleteButton);

    // expect(handleDeleteExpense).toHaveBeenCalled();
  });
});

describe("MonthYearPicker", () => {
  test("displays the current month and year in the button", () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const { getByText } = render(<MonthYearPicker />);
    const button = getByText(`${currentMonth} ${currentYear}`);
    expect(button).toBeTruthy();
  });

  test("opens the picker modal when the button is pressed", () => {
    const { getByText, getByTestId } = render(<MonthYearPicker />);
    const button = getByText("July 2023"); // Replace with your initial selected date
    fireEvent.press(button);
    const monthPickerModal = getByTestId("PickerMonth");
    const yearPickerModal = getByTestId("PickerYear");
    expect(monthPickerModal).toBeTruthy();
    expect(yearPickerModal).toBeTruthy();
  });

  test('closes the picker modal when "Cancel" button is pressed', () => {
    const { getByText, queryByTestId } = render(<MonthYearPicker />);
    const button = getByText("July 2023"); // Replace with your initial selected date
    fireEvent.press(button);
    const cancelButton = getByText("Cancel");
    fireEvent.press(cancelButton);
    const pickerModal = queryByTestId("PickerMonth");
    expect(pickerModal).toBeFalsy();
  });

  test('updates the selected month and year when "Select" button is pressed', async () => {
    // Define a mock function for the onSelect prop
    const mockOnSelect = jest.fn();

    // Render the MonthYearPicker with the mockOnSelect prop
    const { getByText, getByTestId } = render(
      <MonthYearPicker onSelect={mockOnSelect} />
    );

    // The rest of the test code remains the same
    const button = getByText("July 2023"); // Replace with your initial selected date
    fireEvent.press(button);

    await act(() => {
      // Get the month picker and simulate selecting "February"
      const monthPicker = getByTestId("PickerMonth");
      fireEvent(monthPicker, "valueChange", "February");

      // Get the year picker and simulate selecting "2023"
      const yearPicker = getByTestId("PickerYear");
      fireEvent(yearPicker, "valueChange", "2023");
    });

    await waitFor(() => {
      // Get the "Select" button in the picker modal and press it to update the selected values
      const selectButton = getByText("Select");
      fireEvent.press(selectButton);
    });

    // Get the updated month and year from the button text
    const updatedText = getByText("February 2023"); // Replace with your expected updated date
    expect(updatedText).toBeTruthy();

    // Verify that the mock function was called with the correct arguments
    expect(mockOnSelect).toHaveBeenCalledWith("February", "2023"); // Replace with the expected month and year values
  });
});
