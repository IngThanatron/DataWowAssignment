import cn from "classnames";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  bgColor?: "blue" | "red" | "gray" | "white";
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  bgColor,
  disabled,
}: ButtonProps) => {
  const bgClass = (() => {
    switch (bgColor) {
      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
      case "red":
        return "bg-red-500 hover:bg-red-600";
      case "gray":
        return "bg-gray-500 hover:bg-gray-600";
      case "white":
        return "bg-white hover:bg-gray-100";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  })();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full sm:w-fit text-white px-8 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors cursor-pointer",
        bgClass,
      )}
    >
      {children}
    </button>
  );
};
