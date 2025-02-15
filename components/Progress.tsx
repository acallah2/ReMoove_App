import { View } from "react-native";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // Fill level (percentage)
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <View className={cn("w-full h-4 bg-gray-200 rounded-lg overflow-hidden", className)}>
      <View
        className={cn(
          "h-full",
          value < 50 ? "bg-redwood" : value < 80 ? "bg-ucd-gold-70" : "bg-doubledecker"
        )}
        style={{ width: `${value}%` }}
      />
    </View>
  );
}
