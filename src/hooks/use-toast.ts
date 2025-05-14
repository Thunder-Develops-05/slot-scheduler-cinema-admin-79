
// Import from Shadcn UI component
import { useToast as useShadcnToast } from "@/components/ui/toast";

export const useToast = useShadcnToast;

// Export a toast function for easier access
export function toast(props: Parameters<typeof useShadcnToast>["0"]["toast"]) {
  const { toast } = useShadcnToast();
  return toast(props);
}
