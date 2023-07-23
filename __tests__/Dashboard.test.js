import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Dashboard from "../app/(home)/Dashboard";
import LineGraph from "../app/components/LineGraph";
import PieChartContainer from "../app/components/PieChartContainer";
import VerticalBarChart from "../app/components/VerticalBarChart";

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
    insert: jest.fn().mockResolvedValue({}),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue({}),
    mockReturnValueOnce: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("react-native-gifted-charts", () => {
  const { View } = require("react-native");
  const Animated = {
    timing: jest.fn().mockReturnValue({ start: jest.fn() }),
  };
  const BarChartMock = (props) => {
    return <View testID="bar-chart" {...props} />; // Replace with a valid implementation for the BarChart component
  };
  BarChartMock.displayName = "BarChart";
  return {
    ...jest.requireActual("react-native-gifted-charts"),
    LineChart: View, // Mock the LineChart component as a regular View
    BarChart: BarChartMock,
    Animated,
  };
});

// Mock the other components and functions used in the Dashboard component
jest.mock("../app/components/GetBackendData", () => ({
  GetMonthlyExpensesSortedByDate: jest.fn().mockResolvedValue([]),
  GetPastYearExpensesSum: jest.fn().mockResolvedValue([]),
  GetPastYearMoneyIn: jest.fn().mockResolvedValue([]),
  GetLastYearMonths: jest.fn().mockResolvedValue([]),
  GetProfilePic: jest.fn().mockResolvedValue("mocked-profile-picture-url"),
}));

jest.mock("@react-navigation/native", () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
}));

describe("Dashboard Component", () => {
  test("renders Dashboard component", () => {
    const { getByText } = render(<Dashboard />);
    const headerText = getByText("Dashboard");
    expect(headerText).toBeTruthy();
  });

  test("renders MonthYearPicker component", () => {
    const { getByText } = render(<Dashboard />);
    const monthYearPicker = getByText("July 2023");
    expect(monthYearPicker).toBeTruthy();
  });
});

describe("Line Graph component", () => {
  test("renders the LineGraph component with valid data", () => {
    const lastYearMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const pastYearMoneyIn = [100, 200, 150, 300, 250, 400];
    const pastYearExpenses = [50, 100, 80, 120, 90, 150];

    const { getByTestId } = render(
      <LineGraph
        lastYearMonths={lastYearMonths}
        pastYearMoneyIn={pastYearMoneyIn}
        pastYearExpenses={pastYearExpenses}
      />
    );

    // Assert that the LineGraph component is rendered without errors
    const lineGraph = getByTestId("line-graph");
    expect(lineGraph).toBeTruthy();
  });

  test("renders the LineGraph component with expense greater than money in values", () => {
    const lastYearMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const pastYearMoneyIn = [500, 600, 700, 800, 900, 1000];
    const pastYearExpenses = [600, 700, 800, 900, 1000, 1100];

    const { getByTestId } = render(
      <LineGraph
        lastYearMonths={lastYearMonths}
        pastYearMoneyIn={pastYearMoneyIn}
        pastYearExpenses={pastYearExpenses}
      />
    );

    // Assert that the LineGraph component is rendered without errors
    const lineGraph = getByTestId("line-graph");
    expect(lineGraph).toBeTruthy();

    // You can add more assertions to check the appearance and behavior of the LineGraph component with negative expense values
  });

  test("renders the LineGraph component with large data values", () => {
    const lastYearMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const pastYearMoneyIn = [
      1000000, 2000000, 3000000, 4000000, 5000000, 6000000,
    ];
    const pastYearExpenses = [
      500000, 1000000, 800000, 1200000, 900000, 1500000,
    ];

    const { getByTestId } = render(
      <LineGraph
        lastYearMonths={lastYearMonths}
        pastYearMoneyIn={pastYearMoneyIn}
        pastYearExpenses={pastYearExpenses}
      />
    );

    // Assert that the LineGraph component is rendered without errors
    const lineGraph = getByTestId("line-graph");
    expect(lineGraph).toBeTruthy();
  });
});

describe("PieChart Component", () => {
  test("renders PieChart with no data", () => {
    const monthlyExpensesList = [];
    const monthlyExpensesSum = 0;

    const { getByTestId, getByText } = render(
      <PieChartContainer
        monthlyExpensesList={monthlyExpensesList}
        monthlyExpensesSum={monthlyExpensesSum}
      />
    );

    // Assert that the "No pie chart generated!" text is displayed
    const noPieChartText = getByText("No pie chart generated!");
    expect(noPieChartText).toBeTruthy();

    // Assert that the "No expenses added for this month" text is displayed
    const noExpensesText = getByText("No expenses added for this month");
    expect(noExpensesText).toBeTruthy();
  });

  test("renders PieChart with valid data", () => {
    const monthlyExpensesList = [
      { category: "Food", amount: 100 },
      { category: "Utilities", amount: 50 },
      { category: "Entertainment", amount: 75 },
    ];
    const monthlyExpensesSum = 225;

    const { getByTestId, getByText } = render(
      <PieChartContainer
        monthlyExpensesList={monthlyExpensesList}
        monthlyExpensesSum={monthlyExpensesSum}
      />
    );

    // Assert that the PieChart component is rendered without errors
    const FoodText = getByText(`44% Food`);
    expect(FoodText).toBeTruthy();

    const UtilitiesText = getByText(`22% Utilities`);
    expect(UtilitiesText).toBeTruthy();

    const EntertainmentText = getByText(`33% Entertainment`);
    expect(EntertainmentText).toBeTruthy();

    // Assert that the total monthly expenses text is rendered correctly
    const totalExpensesText = getByText(
      `Total Monthly Expenses: $${monthlyExpensesSum}`
    );
    expect(totalExpensesText).toBeTruthy();
  });
});

describe("VerticalBarChart Component", () => {
  test("renders a 'generating bar chart' message when no data is available", () => {
    const lastSixMonths = [];
    const sixMonthsMoneyInSum = [];
    const sixMonthsExpensesSum = [];

    const { getByText } = render(
      <VerticalBarChart
        lastSixMonths={lastSixMonths}
        sixMonthsMoneyInSum={sixMonthsMoneyInSum}
        sixMonthsExpensesSum={sixMonthsExpensesSum}
      />
    );

    const generatingMessage = getByText("Generating bar chart...");
    expect(generatingMessage).toBeTruthy();
  });

  test("renders a 'no bar chart generated' message when all data is zero", () => {
    const lastSixMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const sixMonthsMoneyInSum = [0, 0, 0, 0, 0, 0];
    const sixMonthsExpensesSum = [0, 0, 0, 0, 0, 0];

    const { getByText } = render(
      <VerticalBarChart
        lastSixMonths={lastSixMonths}
        sixMonthsMoneyInSum={sixMonthsMoneyInSum}
        sixMonthsExpensesSum={sixMonthsExpensesSum}
      />
    );

    const noChartMessage = getByText("No bar chart generated!");
    const noDataMessage = getByText(
      "No expenses and income added for the last 6 months"
    );
    expect(noChartMessage).toBeTruthy();
    expect(noDataMessage).toBeTruthy();
  });

  test("renders the bar chart with valid data", () => {
    const lastSixMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const sixMonthsMoneyInSum = [100, 200, 150, 300, 250, 400];
    const sixMonthsExpensesSum = [50, 100, 80, 120, 90, 150];

    const { getByText, getByTestId } = render(
      <VerticalBarChart
        lastSixMonths={lastSixMonths}
        sixMonthsMoneyInSum={sixMonthsMoneyInSum}
        sixMonthsExpensesSum={sixMonthsExpensesSum}
      />
    );

    // Assert that the BarChart component is rendered without errors
    const jan = getByTestId("bar-chart");
    expect(jan).toBeTruthy();
  });
});
