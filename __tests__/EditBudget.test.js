import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import EditBudget from "../app/(home)/Budget/EditBudget";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

// Mock the necessary modules
jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({}),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue({}),
    mockReturnValueOnce: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
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

// Mock the functions
jest.mock("../app/components/GetBackendData", () => ({
  GetCategoryDetails: jest.fn().mockResolvedValue([
    { category_id: 1, category: "Category 1", spending: 20 },
    { category_id: 2, category: "Category 2", spending: 30 },
    // Add more category data as needed
  ]),
  GetCurrentBudget: jest.fn().mockResolvedValue({
    user_id: "sample-user-id",
    budget_id: 1,
    income: 1500,
    // Add other properties as needed
  }),
  GetSideHustles: jest.fn().mockResolvedValue([
    { id: 1, name: "Side Hustle 1", amount: 100 },
    { id: 2, name: "Side Hustle 2", amount: 200 },
    // Add more side hustle data as needed
  ]),
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

describe("EditBudget", () => {
  it("should render and match snapshot", () => {
    const { toJSON } = render(<EditBudget />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should update income on edit and save", () => {
    const { getByTestId } = render(<EditBudget />);

    act(() => {
      // Find and click the Edit button for Income
      const editButton = getByTestId("EditButton");
      fireEvent.press(editButton);
    });

    act(() => {
      // Find the TextInput for new income and update its value
      const newIncomeInput = getByTestId("IncomeText");
      fireEvent.changeText(newIncomeInput, "2000");
    });

    // Find and click the Save button for Income
    const saveButton = getByTestId("SaveButton");
    fireEvent.press(saveButton);

    // Ensure that the income is updated and the "Income updated successfully" message is logged
    expect(supabase.from().update).toHaveBeenCalledWith({
      income: "2000",
      in_use: true,
    });
  });

  it("should add money in and update the state and backend correctly", () => {
    const { getByTestId } = render(<EditBudget />);

    act(() => {
      // Find the "Money in" TextInput elements and enter test values
      const moneyInNameInput = getByTestId("SideHustleNameInput");
      fireEvent.changeText(moneyInNameInput, "Test Money In");
    });

    act(() => {
      const moneyInAmountInput = getByTestId("SideHustleAmountInput");
      fireEvent.changeText(moneyInAmountInput, "100");
    });

    // Find and click the "Add" button
    const addButton = getByTestId("AddSideHustleButton");
    fireEvent.press(addButton);

    // Ensure that the money in is added to the state and backend correctly
    expect(supabase.from().insert).toHaveBeenCalledWith([
      {
        created_at: expect.any(String),
        user_id: expect.any(String),
        name: "Test Money In",
        amount: "100",
      },
    ]);
  });

  it("should display an alert when click on delete icon for money in", async () => {
    // Render the component

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation();
    const { getByTestId, queryAllByTestId, getByText, debug, queryByText } =
      render(<EditBudget />);

    // Wait for the data to be loaded
    await waitFor(() => getByText("Side Hustle 1"));

    // Find the delete button for the first money in item
    const buttons = queryAllByTestId("money-delete");

    // Check if there's at least one element with the testID "money-delete"
    expect(buttons.length).toBeGreaterThan(0);

    // Trigger the deletion using the first element with testID "money-delete"
    fireEvent.press(buttons[0]);

    expect(alertSpy).toHaveBeenCalledWith(
      "Confirm Delete",
      "Are you sure you want to delete this money in?",
      expect.arrayContaining([
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: expect.any(Function),
          style: "destructive",
        },
      ])
    );
  });

  it("should delete money in correctly", async () => {
    // Render the component
    // Mock the Alert.alert function
    Alert.alert = jest.fn((title, message, buttons) => {
      // Simulate pressing the "Reset" button in the confirmation alert
      buttons[1].onPress();
    });

    const { getByTestId, queryAllByTestId, getByText, debug, queryByText } =
      render(<EditBudget />);

    // Wait for the data to be loaded
    await waitFor(() => getByText("Side Hustle 1"));

    // Find the delete button for the first money in item
    const buttons = queryAllByTestId("money-delete");

    // Check if there's at least one element with the testID "money-delete"
    expect(buttons.length).toBeGreaterThan(0);

    // Trigger the deletion using the first element with testID "money-delete"
    fireEvent.press(buttons[0]);

    // Wait for the update to be applied
    await waitFor(() => {
      expect(supabase.from().delete).toHaveBeenCalledTimes(1);
    });
  });

  it("should display an error message for an invalid total percentage", () => {
    // Render the component
    const { getByTestId, getByText } = render(<EditBudget />);
    act(() => {
      // Find the save button and simulate a click
      const saveButton = getByTestId("CategoriesSave");
      fireEvent.press(saveButton);
    });

    // Assert that the error message is displayed
    const errorMessage = getByText("Percentage sum is not equal to 100.");
    expect(errorMessage).toBeDefined();
  });

  it("should update category percentages correctly and save the changes", async () => {
    const { getByText, getByTestId, queryAllByTestId, debug } = render(
      <EditBudget />
    );

    // Wait for the data to be loaded
    await waitFor(() => getByText("Categories:"));

    // Trigger the editing mode
    const buttons = queryAllByTestId("PercentageInput");

    // Check if there's at least one element with the testID "submitButton"
    expect(buttons.length).toBeGreaterThan(0);

    // Trigger the form submission using the first element with testID "submitButton"
    fireEvent.changeText(buttons[0], "40");
    fireEvent.changeText(buttons[1], "60");
    // });

    // Save the changes
    fireEvent.press(getByText("Save"));

    // Wait for the updates to be applied
    await waitFor(() => expect(supabase.update).toHaveBeenCalledTimes(2));

    // // Check if the supabase update method was called with the correct arguments
    expect(supabase.update).toHaveBeenCalledWith({
      category: "Category 1",
      spending: 0.4,
    });

    const input = queryAllByTestId("PercentageInput");
    const first = input[0];
    const second = input[1];
    // Check if the UI is updated with the new percentage values
    expect(first.props.value).toBe("40");
    expect(second.props.value).toBe("60");
  });
});

describe("Integration test for EditBudget", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should allow user to edit a budget", async () => {
    const { queryAllByTestId, getByTestId, getByText, debug } = render(
      <EditBudget />
    );

    act(() => {
      // Find and click the Edit button for Income
      const editButton = getByTestId("EditButton");
      fireEvent.press(editButton);
    });

    act(() => {
      // Find the TextInput for new income and update its value
      const newIncomeInput = getByTestId("IncomeText");
      fireEvent.changeText(newIncomeInput, "2000");
    });

    // Find and click the Save button for Income
    const saveButton = getByTestId("SaveButton");
    fireEvent.press(saveButton);

    // Ensure that the income is updated and the "Income updated successfully" message is logged
    expect(supabase.from().update).toHaveBeenCalledWith({
      income: "2000",
      in_use: true,
    });

    await waitFor(() => getByText("Categories:"));

    // Trigger the editing mode
    const buttons = queryAllByTestId("PercentageInput");

    // Check if there's at least one element with the testID "submitButton"
    expect(buttons.length).toBeGreaterThan(0);

    // Trigger the form submission using the first element with testID "submitButton"
    fireEvent.changeText(buttons[0], "40");
    fireEvent.changeText(buttons[1], "60");

    // Save the changes
    fireEvent.press(getByText("Save"));

    // Wait for the updates to be applied
    await waitFor(() => expect(supabase.update).toHaveBeenCalledTimes(4));
    console.log("Calls to supabase.update:", supabase.update.mock.calls);
    expect(supabase.update).toHaveBeenCalledWith({
      income: "2000",
      in_use: true,
    });
    expect(supabase.update).toHaveBeenCalledWith({
      category: "Category 1",
      spending: 0.4,
    });
  });
});
