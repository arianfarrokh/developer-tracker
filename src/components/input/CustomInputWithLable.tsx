
import type {
  ChangeEventHandler,
  FocusEventHandler,
} from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type BaseProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

type InputProps = BaseProps & {
  multiline?: false;
  type?: React.ComponentProps<"input">["type"];
};

type TextareaProps = BaseProps & {
  multiline: true;
  rows?: number;
};

type Props = InputProps | TextareaProps;

export function CustomInputWithLabel(props: Props) {
  const {
    id,
    name,
    label,
    value,
    placeholder,
    error,
    onChange,
    onBlur,
  } = props;

  const commonClassName = cn(
    error && "border-destructive focus-visible:ring-destructive",
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {props.multiline ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={props.rows ?? 3}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={cn("min-h-[5.5rem] resize-none", commonClassName)}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={props.type ?? "text"}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={commonClassName}
        />
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
