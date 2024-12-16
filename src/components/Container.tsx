interface ContainerProps {
    children: React.ReactNode;
  }
  
  // const Container: React.FC<ContainerProps> = ({ children }) => {
  //   return <StyledContainer>{children}</StyledContainer>;
  // };
  
  const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="w-[90%] mx-auto">{children}</div>;
  };
  
  export default Container;