import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import CreateBudget from "../app/(home)/Budget/CreateBudget";
import { supabase } from "../lib/supabase";
import SampleBudget from "../app/components/SampleBudget";
import { TouchableOpacity } from "react-native";

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
      return <View {...props} />;
    };
    TouchableOpacityMock.displayName = "TouchableOpacity";

    return TouchableOpacityMock;
  }
);

describe("CreateBudget", () => {
  it("should call handleSubmit and navigate to another page on button press", async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
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
      const button = getByTestId("submit-button");
      fireEvent.press(button);

      expect(handleSubmit).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalledWith("./");
    });
  });

  //   it("should display an error message when income is empty", async () => {
  //     const { getByLabelText, getByText, queryByText, getByTestId } = render(
  //       <CreateBudget />
  //     );

  //     // Set up the input fields
  //     const incomeInput = getByTestId("text-input-flat");

  //     // Enter the income value
  //     fireEvent.changeText(incomeInput, "");

  //     // Trigger the form submission
  //     fireEvent.press(getByText("Make Budget"));

  //     // Assert the error message is displayed
  //     const errorMessage = await waitFor(() =>
  //       queryByText("Please remember to key in your fixed income")
  //     );
  //     expect(errorMessage).toBeTruthy();
  //   });

  //   it("should call the updateData function with correct parameters", async () => {
  //     const { getByText } = render(<CreateBudget />);

  //     // Mock the functions and inputs
  //     const handleSubmit = jest.fn();

  //     // Trigger the form submission
  //     act(() => {
  //       fireEvent.press(getByText("Make Budget"));
  //     });

  //     // Assert the updateData function is called with correct parameters
  //     expect(handleSubmit).toHaveBeenCalled();
  //   });
});
