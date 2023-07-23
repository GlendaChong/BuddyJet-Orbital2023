import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import EditExpenses from "../app/(home)/Expenses/EditExpenses";
import * as ImagePicker from "expo-image-picker";

// Mock the necessary modules
jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({}),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue({}),
    mockReturnValueOnce: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          description: "Sample Description",
          amount: "100",
          date: "2023-07-20",
          category: "Food",
          payment_mode: "Cash",
          pic_url: "sample-image-url",
        },
      }),
    })),
  },
  storage: {
    from: () => ({
      upload: jest.fn(() => ({
        data: {
          path: "path/to/uploaded/image.jpg",
        },
        error: null,
      })),
      getPublicUrl: jest.fn(() => ({
        data: {
          publicUrl: "https://example.com/avatar.jpg",
        },
        error: null,
      })),
    }),
  },
}));

ImagePicker.launchImageLibraryAsync = jest.fn(() =>
  Promise.resolve({ cancelled: false, uri: "path/to/image.jpg" })
);

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

describe("EditExpenses", () => {
  it("should render the EditExpenses component with initial state", async () => {
    const { getByLabelText, getByTestId } = render(
      <EditExpenses expensesId="sample-expenses-id" />
    );

    // Wait for the data to be fetched and set in the component state
    // await waitFor(() => {
    //   expect(supabase.from).toHaveBeenCalledWith("expenses");
    //   expect(supabase.from().select).toHaveBeenCalled();
    //   expect(supabase.from().select().eq).toHaveBeenCalledWith(
    //     "id",
    //     "sample-expenses-id"
    //   );
    //   expect(supabase.from().select().eq().single).toHaveBeenCalled();
    // });

    // Check if the fields are rendered and have initial values

    expect(getByLabelText("Description").props.value).toBe("");
    expect(getByLabelText("Date (DD/MM/YYYY)").props.value).toBe("");
    expect(getByLabelText("Amount").props.value).toBe("");
    expect(getByTestId("CategoryField")).toBeTruthy();
    expect(getByTestId("PaymentModeField")).toBeTruthy();
    expect(getByTestId("Picture")).toBeTruthy();
  });

  //   it("should add and delete a picture", async () => {
  //     const { getByTestId } = render(<EditExpenses />);

  //     // Mock the ImagePicker.launchImageLibraryAsync method
  //     const mockImagePickerResult = {
  //       cancelled: false,
  //       assets: [
  //         {
  //           uri: "sample-image-uri",
  //           type: "image/jpeg",
  //           name: "sample-image.jpeg",
  //         },
  //       ],
  //     };
  //     jest.mock("expo-image-picker", () => ({
  //       launchImageLibraryAsync: jest.fn(() =>
  //         Promise.resolve(mockImagePickerResult)
  //       ),
  //     }));

  //     // Add a picture
  //     const pictureButton = getByTestId("Picture");
  //     fireEvent.press(pictureButton);
  //     expect(pictureButton.props.pic).toBe("sample-image-uri");

  //     // Delete the picture
  //     fireEvent.press(getByTestId("DeletePictureButton"));
  //     expect(pictureButton.props.pic).toBeNull();
  //   });
});
