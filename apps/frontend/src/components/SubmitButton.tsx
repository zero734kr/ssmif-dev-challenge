import { clsx } from "@challenge/utils";

interface SubmitButtonProps {
  isLoading: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function SubmitButton({ className, isLoading, children }: SubmitButtonProps) {
  return <button
    type="submit"
    disabled={isLoading}
    className={clsx(
      "w-full md:w-auto px-8 py-3",
      "bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400",
      "rounded-md disabled:cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
}
