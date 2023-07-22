import "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "react-native/Libraries/Animated/Animated";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native/Libraries/Animated/Animated", () => {
  return {
    ...jest.requireActual("react-native/Libraries/Animated/Animated"),
    timing: (value, config) => {
      return {
        start: (callback) => {
          value.setValue(config.toValue);
          callback && callback();
        },
      };
    },
  };
});
