import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ContextProps<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
}

const createGenericContext = <T extends unknown>() => {
  const GenericContext = createContext<ContextProps<T> | undefined>(undefined);

  const useGenericContext = () => {
    const context = useContext(GenericContext);
    if (!context) {
      throw new Error(
        "useGenericContext must be used within a GenericContextProvider"
      );
    }
    return context;
  };

  const GenericContextProvider = ({
    children,
    initialData,
  }: {
    children: ReactNode;
    initialData: T;
  }) => {
    const [data, setData] = useState<T>(initialData);
    return (
      <GenericContext.Provider value={{ data, setData }}>
        {children}
      </GenericContext.Provider>
    );
  };

  return { useGenericContext, GenericContextProvider };
};

export const { useGenericContext, GenericContextProvider } =
  createGenericContext<any>();

export default createGenericContext;
