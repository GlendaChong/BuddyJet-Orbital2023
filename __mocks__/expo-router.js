// const useRouter = () => {
//   return <></>; // Replace with the desired component
// }

// export { useRouter }

// const useRouter = () => {
//   return {
//     push: jest.fn(),
//   };
// };

// export { useRouter };

// const useRouter = jest.fn().mockReturnValue({
//   push: jest.fn(),
// });

// export { useRouter };

export const useRouter = jest.fn().mockReturnValue({
  push: jest.fn(),
  navigate: jest.fn(),
  back: jest.fn(),
});

// export const Stack = ({ children }) => children;
// export const Screen = ({ children }) => children;

// export const Stack = ({ children }) => <>{children}</>;
// export const Screen = ({ component: Component }) => <Component />;
