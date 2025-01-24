import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  className?: string;
};

const Loader = ({ className }: Props) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={cn("animate-spin", className)} />
      <span>Loading...</span>
    </div>
  );
};

export default Loader;
