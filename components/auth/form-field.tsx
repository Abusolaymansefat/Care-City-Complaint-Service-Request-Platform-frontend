import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = React.ComponentProps<"input"> & { label: string; error?: string };

export const FormField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{label}</Label>
        <Input id={fieldId} ref={ref} aria-invalid={!!error} {...props} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
FormField.displayName = "FormField";