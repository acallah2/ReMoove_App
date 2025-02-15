import { View } from "react-native";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function ModularCard({ children, className }: CardProps) {
  return <View className={`bg-white shadow-md rounded-lg p-4 ${cn(className)}`}>{children}</View>;
}
