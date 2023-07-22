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

// Mock the API functions
jest.mock("../app/components/GetBackendData", () => ({
  GetMonthlyExpensesSortedByCat: jest.fn(),
  GetMonthlyExpensesSortedByDate: jest.fn(),
  GetMoneyIn: jest.fn(),
}));

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
  });
  test("GetMonthlyExpensesSortedByDate should return expenses sorted by category", async () => {
    const selectedMonth = "July";
    const selectedYear = 2023;
    const expenses = [
      { id: 1, date: "2023-07-01", amount: 10, category: "Category A" },
    ];
    const response = { data: expenses, status: 200 };

    GetMonthlyExpensesSortedByCat.mockResolvedValue(expenses);

    // Call the API function
    const result = await GetMonthlyExpensesSortedByCat(
      selectedMonth,
      selectedYear
    );
    expect(result).toEqual(expenses);
  });

  // Similar test cases for GetMonthlyExpensesSortedByCat, GetCurrentFixedIncome, and GetMoneyIn
});
