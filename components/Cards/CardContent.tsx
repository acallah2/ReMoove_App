import { View } from "react-native";
import { cn } from "@/lib/utils";

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <View className={`p-4 space-y-4 ${cn(className)}`}>{children}</View>;
}
