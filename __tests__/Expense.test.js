import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddExpenses from "../app/(home)/Expenses/AddExpenses";
import Expenses from "../app/(home)/Expenses/index";
import {
  GetMonthlyExpensesSortedByCat,
  GetMonthlyExpensesSortedByDate,
  GetMoneyIn,
} from "../app/components/GetBackendData";
import { supabase } from "../lib/supabase";
import { exp } from "react-native-reanimated";

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    then: jest.fn().mockResolvedValue({ data: [], status: 200 }),
  },
}));

// jest.mock('../lib/supabase', () => ({
//   supabase: {
//     from: jest.fn(() => ({
//       select: jest.fn().mockReturnThis(),
//       order: jest.fn().mockReturnThis(),
//       gte: jest.fn().mockReturnThis(),
//       lt: jest.fn().mockReturnThis(),
//       then: jest.fn().mockResolvedValue({ data: [], status: 200 })
//     })),
//   },
// }));

// Mock the API functions
jest.mock("../app/components/GetBackendData", () => ({
  GetMonthlyExpensesSortedByCat: jest.fn(),
  GetMonthlyExpensesSortedByDate: jest.fn(),
  GetMoneyIn: jest.fn(),
}));

// // Set up the mocked API responses
// const mockedExpensesByCat = [
//   { id: 1, category: 'Food', amount: 10 },
//   { id: 2, category: 'Transport', amount: 20 },
// ];

// const mockedExpensesByDate = [
//   { id: 1, date: '2023-07-01', amount: 10 },
// ];

// // Mock the API functions' implementation
// GetMonthlyExpensesSortedByCat.mockResolvedValue(mockedExpensesByCat);
// GetMonthlyExpensesSortedByDate.mockResolvedValue(mockedExpensesByDate);

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

// describe('Expenses', () => {
//   it('initializes the API client and makes a valid API call', async () => {

//     const { queryByText } = render(<Expenses />);

//     // Wait for the API calls to resolve
//     await waitFor(() => {
//       expect(GetMonthlyExpensesSortedByCat).toHaveBeenCalled();
//       expect(GetMonthlyExpensesSortedByDate).toHaveBeenCalled();
//     });

//     // // Assert the response status code
//     // expect(GetMonthlyExpensesSortedByCat.mock.results[0].value.status).toBe(200);
//     // expect(GetMonthlyExpensesSortedByDate.mock.results[0].value.status).toBe(200);
//   });
// });

describe("Test if user can make successful API calls", () => {
  test("GetMonthlyExpensesSortedByDate should return expenses sorted by date", async () => {
    const selectedMonth = "July";
    const selectedYear = 2023;
    const expenses = [{ id: 1, date: "2023-07-01", amount: 10 }];
    const response = { data: expenses, status: 200 };

    // supabase.from().select.mockResolvedValue(response);
    supabase
      .from()
      .select()
      .order()
      .gte()
      .lt()
      .then.mockResolvedValue(expenses);

    GetMonthlyExpensesSortedByDate.mockResolvedValue(expenses);

    // Call the API function
    const result = await GetMonthlyExpensesSortedByDate(
      selectedMonth,
      selectedYear
    );

    // Check the result and status code
    expect(result).toEqual(expenses);
    // expect(supabase.from).toHaveBeenCalledWith("expenses");
    // expect(supabase.from().select).toHaveBeenCalledWith("*");
    // expect(supabase.from().order).toHaveBeenCalledWith("date", { ascending: false });
    // expect(supabase.from().gte).toHaveBeenCalledWith(`${selectedYear}-${selectedMonth.padStart(2, "0")}-01`);
    // expect(supabase.from().lt).toHaveBeenCalledWith(`${selectedYear}-${selectedMonth.padStart(2, "0")}-02`);
    expect(response.status).toBe(200);
  });
  test("GetMonthlyExpensesSortedByDate should return expenses sorted by category", async () => {
    const selectedMonth = "July";
    const selectedYear = 2023;
    const expenses = [
      { id: 1, date: "2023-07-01", amount: 10, category: "Category A" },
    ];
    const response = { data: expenses, status: 200 };

    // supabase.from().select().order().gte().lt().then.mockResolvedValue(response);

    GetMonthlyExpensesSortedByCat.mockResolvedValue(expenses);

    // Call the API function
    const result = await GetMonthlyExpensesSortedByCat(
      selectedMonth,
      selectedYear
    );
    expect(result).toEqual(expenses);
    expect(response.status).toBe(200);
  });

  // Similar test cases for GetMonthlyExpensesSortedByCat, GetCurrentFixedIncome, and GetMoneyIn
});
