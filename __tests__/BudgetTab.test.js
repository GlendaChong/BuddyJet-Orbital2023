import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import Budget from "../app/(home)/Budget/index";
import { supabase } from "../lib/supabase";
import { useRouter } from "../__mocks__/expo-router";
import { CheckMonthlyBudgetExist } from "../app/components/GetBackendData";

jest.mock("../__mocks__/expo-router", () => ({
  useRouter: jest.fn(),
}));

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

// // Mock the GetBackendData functions
jest.mock("../app/components/GetBackendData", () => ({
  ...jest.requireActual("../app/components/GetBackendData"),
  CheckMonthlyBudgetExist: jest.fn(),

  GetCategoryDetails: jest.fn().mockResolvedValue([
    { category: "Category 1", spending: 0.3, color: "#FF0000" },
    { category: "Category 2", spending: 0.2, color: "#00FF00" },
  ]),
  GetMoneyIn: jest.fn().mockResolvedValue(100),
  GetProfilePic: jest.fn().mockResolvedValue("mocked-profile-picture-url"),
}));

describe("Budget", () => {
  it("should render and match snapshot", () => {
    const { toJSON } = render(<Budget />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render "CreateBudgetDesign" when no monthly budget exists', async () => {
    CheckMonthlyBudgetExist.mockResolvedValue(false);
    // Render the component
    const { getByText, getByTestId } = render(<Budget />);

    // Check if "No Monthly Budget" text is displayed
    const noBudgetText = getByText("No Monthly Budget");
    expect(noBudgetText).toBeDefined();

    // Check if "Create a budget" button is displayed
    const createBudgetButton = getByText("Create a budget");
    expect(createBudgetButton).toBeDefined();

    // Simulate clicking the "Create a budget" button
    fireEvent.press(createBudgetButton);

    // Check if the router.push function was called with the correct path
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith({
        pathname: "./Budget/CreateBudget",
        params: {
          selectedMonth: new Date().toLocaleString("default", {
            month: "long",
          }),
          selectedYear: new Date().getFullYear(),
          monthIndex: new Date().getMonth() + 1,
        },
      });
    });
  });

  it('should render "BudgetBox" when monthly budget exists', async () => {
    // Mock the GetBackendData functions to return data
    CheckMonthlyBudgetExist.mockResolvedValue(true);

    const { getByText } = render(<Budget />);

    // Check if "Monthly Budget" text is displayed
    await waitFor(() => {
      // Check if "Monthly Budget" text is displayed
      const monthlyBudgetText = getByText("Monthly Budget");
      expect(monthlyBudgetText).toBeDefined();
    });

    // Check if budget amounts and percentages are displayed correctly
    const tips = getByText("Financial Tip!");
    expect(tips).toBeDefined();

    const category1Text = getByText("Category 1");
    const category2Text = getByText("Category 2");
    expect(category1Text).toBeDefined();
    expect(category2Text).toBeDefined();
  });
});
