import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import CreateBudget from "../app/(home)/Budget/CreateBudget";
import { supabase } from "../lib/supabase";
import SampleBudget from "../app/components/SampleBudget";
import { TouchableOpacity } from "react-native";
import { useRouter } from "../__mocks__/expo-router";
import { Alert } from "react-native";

jest.mock("../__mocks__/expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock the supabase dependency
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
      return <View {...props} testID="submitButton" />;
    };
    TouchableOpacityMock.displayName = "TouchableOpacity";
    // TouchableOpacityMock.testID = "submit-button";

    return TouchableOpacityMock;
  }
);

describe("CreateBudget", () => {
  useRouter.mockReturnValue({
    push: jest.fn(), // Mock the push method
  });

  const handleSubmit = jest.fn();

  it("should call handleSubmit and navigate to another page on button press", async () => {
    const { getByTestId, debug } = render(
      <SampleBudget
        index={1}
        budgetType="Sample Budget"
        categories={[
          { categoryName: "Category 1", percentage: "50", color: "#0A84FF" },
          { categoryName: "Category 2", percentage: "30", color: "#32D74B" },
          { categoryName: "Category 3", percentage: "20", color: "#F46040" },
        ]}
        handleSubmit={handleSubmit}
      />
    );

    await waitFor(() => {
      const button = getByTestId("submitButton");
      fireEvent.press(button);

      expect(handleSubmit).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalledWith("./");
    });
  });

  it("should display an error message when income is empty", async () => {
    const { queryAllByTestId, debug, getByTestId } = render(<CreateBudget />);

    // Spy on the Alert component to capture if it was called
    jest.spyOn(Alert, "alert");

    // Set up the input fields
    const incomeInput = getByTestId("text-input-flat");

    // Enter the income value
    fireEvent.changeText(incomeInput, "");

    await waitFor(() => {
      // Get all elements with testID "submitButton"
      const buttons = queryAllByTestId("submitButton");

      // Check if there's at least one element with the testID "submitButton"
      expect(buttons.length).toBeGreaterThan(0);

      // Trigger the form submission using the first element with testID "submitButton"
      fireEvent.press(buttons[0]);
    });

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

    // Check if the alert was called with the correct message
    expect(Alert.alert).toHaveBeenCalledWith(
      "Missing Information",
      "Please remember to key in your fixed income",
      [{ style: "okay", text: "Okay" }]
    );
  });

  it("should display an error message when income format is wrong", async () => {
    const { queryAllByTestId, debug, getByTestId } = render(<CreateBudget />);

    // Spy on the Alert component to capture if it was called
    jest.spyOn(Alert, "alert");

    // Set up the input fields
    const incomeInput = getByTestId("text-input-flat");

    // Enter the income value
    fireEvent.changeText(incomeInput, "ddd");

    await waitFor(() => {
      // Get all elements with testID "submitButton"
      const buttons = queryAllByTestId("submitButton");

      // Check if there's at least one element with the testID "submitButton"
      expect(buttons.length).toBeGreaterThan(0);

      // Trigger the form submission using the first element with testID "submitButton"
      fireEvent.press(buttons[0]);
    });

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

    // Check if the alert was called with the correct message
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid Information",
      "Please key in a valid fixed income",
      [{ style: "okay", text: "Okay" }]
    );
  });
});

describe("Integration test for CreateBudget", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should allow user to create a budget", async () => {
    // Mock the profiles data to be used when calling handleSubmit

    const { queryAllByTestId, debug, getByTestId } = render(<CreateBudget />);
    // Mock the categories data to be used when calling handleSubmit
    const categories = [
      { categoryName: "Needs", percentage: "50", color: "#0A84FF" },
      { categoryName: "Wants", percentage: "30", color: "#32D74B" },
      { categoryName: "Savings", percentage: "20", color: "#F46040" },
    ];

    // Set up the input fields
    const incomeInput = getByTestId("text-input-flat");

    // Enter the income value
    fireEvent.changeText(incomeInput, "2000");

    // Get the submit button and trigger its press event
    await waitFor(async () => {
      // Get all elements with testID "submitButton"
      const buttons = queryAllByTestId("submitButton");

      // Check if there's at least one element with the testID "submitButton"
      expect(buttons.length).toBeGreaterThan(0);

      // Trigger the form submission using the first element with testID "submitButton"
      fireEvent.press(buttons[0]);
    });

    // Wait for the handleSubmit function to finish its async operations
    await act(() => {
      // Assert that the supabase functions were called with the correct parameters
      expect(supabase.from).toHaveBeenCalledWith("profiles");
      // expect(supabase.from).toHaveBeenCalledWith("budget");
      // expect(supabase.insert).toHaveBeenCalledWith([
      //   {
      //     income: "2000",
      //     user_id: expect.any(String),
      //     created_at: expect.any(String),
      //   },
      // ]);

      // Add more assertions for other supabase function calls if needed
    });
  });
});
