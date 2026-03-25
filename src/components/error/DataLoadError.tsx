import { DataLoadFailedUI } from "./ErrorUI";

interface DataLoadErrorProps {
  onRetry?: () => void;
  customMessage?: string;
}

/**
 * Data Load Error Component
 * Use this when API calls fail or data cannot be loaded.
 * Prevents blank screens during data loading failures.
 */
export const DataLoadError = ({ onRetry, customMessage }: DataLoadErrorProps) => {
  return (
    <DataLoadFailedUI 
      onRetry={onRetry}
      customMessage={customMessage}
    />
  );
};

export default DataLoadError;
