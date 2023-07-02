// const useRouter = () => {
//   return <></>; // Replace with the desired component
// }

// export { useRouter }

const useRouter = () => {
  return {
    push: jest.fn(),
  };
};

export { useRouter };




