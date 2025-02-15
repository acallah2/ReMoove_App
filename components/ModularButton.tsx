import { TouchableOpacity, Text } from "react-native";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  textVariant?: "black" | "white"; // 🔹 New prop for text color
  className?: string;
  children: string;
  onPress: () => void;
}

export function Button({
  variant = "primary",
  textVariant = "white", // Default to white text
  className,
  children,
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "px-4 py-2 rounded-lg transition-all",
        variant === "primary" && "bg-ucd-blue-90 active:bg-ucd-blue",
        variant === "secondary" && "bg-gray-300 active:bg-gray-400",
        variant === "danger" && "bg-doubledecker active:bg-doubledecker",
        className
      )}
    >
      <Text className={cn("text-center font-semibold", textVariant === "white" ? "text-white" : "text-black")}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
