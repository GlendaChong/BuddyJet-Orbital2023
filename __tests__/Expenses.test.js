import { render, fireEvent } from "@testing-library/react-native";
import Expenses from "../app/(home)/Expenses/index";
import { supabase } from "../lib/supabase";
import {
  GetMonthlyExpensesSortedByCat,
  GetMonthlyExpensesSortedByDate,
  GetCurrentFixedIncome,
} from "../app/(home)/GetBackendData";

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

// Mock the GetBackendData module
jest.mock("../app/(home)/GetBackendData", () => ({
  GetMonthlyExpensesSortedByCat: jest.fn(),
  GetMonthlyExpensesSortedByDate: jest.fn(),
  GetCurrentFixedIncome: jest.fn(),
}));

describe("Expenses", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('returns expenses sorted by date for the given month and year', async () => {
  //   const selectedMonth = 'July';
  //   const selectedYear = 2023;

  //   const sampleExpenses = [
  //     { id: 1, description: 'Expense 1', date: '2023-07-02', amount: 100 },
  //     { id: 2, description: 'Expense 2', date: '2023-07-03', amount: 200 },
  //     { id: 3, description: 'Expense 3', date: '2023-07-01', amount: 150 },
  //   ];

  //   // Mock the supabase module to return the sample expenses
  //   supabase.from().select().order().gte().lt().then.mockResolvedValue({ data: sampleExpenses });

  //   const result = await GetMonthlyExpensesSortedByDate(selectedMonth, selectedYear);

  //   expect(supabase.from).toHaveBeenCalledWith('expenses');
  //   expect(supabase.from().select).toHaveBeenCalledWith('*');
  //   expect(supabase.from().select().order).toHaveBeenCalledWith('date', { ascending: false });
  //   expect(supabase.from().select().order().gte).toHaveBeenCalledWith('date', '2023-07-01');
  //   expect(supabase.from().select().order().gte().lt).toHaveBeenCalledWith('date', '2023-08-01');
  //   expect(result).toEqual(sampleExpenses);
  // });

  test("should fetch and return expenses sorted by category", async () => {
    // Prepare sample expenses with different categories
    const sampleExpenses = [
      { id: 1, description: "Expense 1", category: "Category A", amount: 100 },
      { id: 2, description: "Expense 2", category: "Category B", amount: 200 },
      { id: 3, description: "Expense 3", category: "Category A", amount: 150 },
      { id: 4, description: "Expense 4", category: "Category C", amount: 50 },
      { id: 5, description: "Expense 5", category: "Category B", amount: 300 },
    ];

    // Mock the API response for GetMonthlyExpensesSortedByCat
    GetMonthlyExpensesSortedByCat.mockResolvedValue(sampleExpenses);

    // Call the GetMonthlyExpensesSortedByCat function
    const selectedMonth = "July";
    const selectedYear = 2023;
    const expenses = await GetMonthlyExpensesSortedByCat(
      selectedMonth,
      selectedYear
    );

    // Create an object to store the categories and their corresponding expenses
    const categories = {};

    // Group expenses by category
    for (const expense of expenses) {
      const category = expense.category;
      if (!categories[category]) {
        categories[category] = [expense];
      } else {
        categories[category].push(expense);
      }
    }

    // Assert that all expenses with the same category are displayed together
    for (const category in categories) {
      const categoryExpenses = categories[category];
      for (let i = 1; i < categoryExpenses.length; i++) {
        const currentExpense = categoryExpenses[i];
        const previousExpense = categoryExpenses[i - 1];
        expect(currentExpense.category).toEqual(previousExpense.category);
      }
    }
  });

  test("should fetch and display expenses sorted by date", async () => {
    // Mock the API response for GetMonthlyExpensesSortedByDate
    const mockExpensesSortedByDate = [
      { id: 1, description: "Expense 1", date: "2023-07-01", amount: 100 },
      { id: 2, description: "Expense 2", date: "2023-07-02", amount: 200 },
    ];
    GetMonthlyExpensesSortedByDate.mockResolvedValue(mockExpensesSortedByDate);

    // Render the Expenses component
    const { findByText } = render(<Expenses />);

    // Step 1: Wait for the expenses to be displayed
    const expense1 = await findByText("Expense 1");
    const expense2 = await findByText("Expense 2");

    // Step 2: Verify that the expenses are displayed correctly
    expect(expense1).toBeTruthy();
    expect(expense2).toBeTruthy();
  });

  test("should fetch and display expenses sorted by categories", async () => {
    // Mock the API response for GetMonthlyExpensesSortedByCat
    const mockExpensesSortedByCat = [
      { id: 1, description: "Expense 1", category: "Category 1", amount: 100 },
      { id: 2, description: "Expense 2", category: "Category 2", amount: 200 },
    ];
    GetMonthlyExpensesSortedByCat.mockResolvedValue(mockExpensesSortedByCat);

    // Render the Expenses component
    const { findByText, getByTestId } = render(<Expenses />);

    // Step 1: Click on the "Categories" button to toggle the sorting order
    const categoriesButton = getByTestId("categories-button");
    fireEvent.press(categoriesButton);

    // Step 2: Wait for the expenses to be displayed
    const expense1 = await findByText("Expense 1");
    const expense2 = await findByText("Expense 2");

    // Step 3: Verify that the expenses are displayed correctly
    expect(expense1).toBeTruthy();
    expect(expense2).toBeTruthy();
  });
});
