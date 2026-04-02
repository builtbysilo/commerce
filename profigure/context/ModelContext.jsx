import {createContext, useContext} from "react";
import {useModelConfig} from "../hooks/useModelConfig";

const ModelContext = createContext();

export function ModelProvider({children, initialConfig = {}}) {
  const modelConfig = useModelConfig(initialConfig);

  return (
    <ModelContext.Provider value={modelConfig}>
      {children}
    </ModelContext.Provider>
  );
}

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
};
