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

    // Print the rendered output to the console for debugging
    debug();

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

  // it("should call the updateData function with correct parameters", async () => {
  //   const { getByText } = render(<CreateBudget />);

  //   // Mock the functions and inputs
  //   const handleSubmit = jest.fn();

  //   // Trigger the form submission
  //   act(() => {
  //     fireEvent.press(getByText("Make Budget"));
  //   });

  //   // Assert the updateData function is called with correct parameters
  //   expect(handleSubmit).toHaveBeenCalled();
  // });
});
