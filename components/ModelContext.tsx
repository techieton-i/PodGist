import { createContext, ReactNode, useContext, useState } from "react";

type Model = "gpt-3.5" | "gpt-4" | "custom-model";

interface ModelContextProps {
  model: Model;
  setModel: (model: Model) => void;
}

const ModelContext = createContext<ModelContextProps | undefined>(undefined);

export const ModelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [model, setModel] = useState<Model>("gpt-3.5");

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = (): ModelContextProps => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
};
