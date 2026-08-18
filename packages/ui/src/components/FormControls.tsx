import type {
  InputHTMLAttributes,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export type FieldCommonProps = {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

function FieldFrame({
  id,
  label,
  helperText,
  error,
  required,
  children,
}: FieldCommonProps & { children: ReactNode }) {
  const helperId = helperText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="endoora-field">
      <label className="endoora-field__label" htmlFor={id}>
        {label}
        {required ? <span className="endoora-field__required" aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {helperText ? <p id={helperId} className="endoora-field__help">{helperText}</p> : null}
      {error ? <p id={errorId} className="endoora-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

function describedBy(id: string, helperText?: string, error?: string) {
  return [helperText ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

export type TextInputProps = FieldCommonProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "required">;

export function TextInput({ id, label, helperText, error, required, className = "", ...props }: TextInputProps) {
  return (
    <FieldFrame id={id} label={label} helperText={helperText} error={error} required={required}>
      <input
        id={id}
        className={["endoora-input", error ? "endoora-input--error" : "", className].filter(Boolean).join(" ")}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, helperText, error)}
        {...props}
      />
    </FieldFrame>
  );
}

export type TextAreaProps = FieldCommonProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "required">;

export function TextArea({ id, label, helperText, error, required, className = "", ...props }: TextAreaProps) {
  return (
    <FieldFrame id={id} label={label} helperText={helperText} error={error} required={required}>
      <textarea
        id={id}
        className={["endoora-input", "endoora-textarea", error ? "endoora-input--error" : "", className].filter(Boolean).join(" ")}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, helperText, error)}
        {...props}
      />
    </FieldFrame>
  );
}

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = FieldCommonProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "required" | "children"> & {
  options: SelectOption[];
  placeholder?: string;
};

export function Select({ id, label, helperText, error, required, options, placeholder, className = "", ...props }: SelectProps) {
  return (
    <FieldFrame id={id} label={label} helperText={helperText} error={error} required={required}>
      <select
        id={id}
        className={["endoora-input", error ? "endoora-input--error" : "", className].filter(Boolean).join(" ")}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, helperText, error)}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
        ))}
      </select>
    </FieldFrame>
  );
}

export type MultiSelectProps = FieldCommonProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "required" | "children" | "multiple"> & {
  options: SelectOption[];
  visibleRows?: number;
};

export function MultiSelect({ id, label, helperText, error, required, options, visibleRows = 4, className = "", ...props }: MultiSelectProps) {
  return (
    <FieldFrame id={id} label={label} helperText={helperText} error={error} required={required}>
      <select
        id={id}
        multiple
        size={visibleRows}
        className={["endoora-input", "endoora-multiselect", error ? "endoora-input--error" : "", className].filter(Boolean).join(" ")}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, helperText, error)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
        ))}
      </select>
    </FieldFrame>
  );
}

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  description?: string;
};

export function Checkbox({ id, label, description, className = "", ...props }: CheckboxProps) {
  if (!id) throw new Error("Checkbox requires an id so its label is explicit.");
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="endoora-check-row">
      <input id={id} type="checkbox" className={["endoora-check", className].filter(Boolean).join(" ")} aria-describedby={descriptionId} {...props} />
      <div>
        <label htmlFor={id} className="endoora-check-row__label">{label}</label>
        {description ? <p id={descriptionId} className="endoora-field__help">{description}</p> : null}
      </div>
    </div>
  );
}

export type RadioOption = {
  value: string;
  label: string;
  description?: string;
};

export type RadioGroupProps = {
  legend: string;
  name: string;
  options: RadioOption[];
  defaultValue?: string;
};

export function RadioGroup({ legend, name, options, defaultValue }: RadioGroupProps) {
  return (
    <fieldset className="endoora-fieldset">
      <legend className="endoora-field__label">{legend}</legend>
      <div className="endoora-choice-list">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          return (
            <div className="endoora-check-row" key={option.value}>
              <input id={id} type="radio" name={name} value={option.value} defaultChecked={defaultValue === option.value} className="endoora-check" />
              <div>
                <label htmlFor={id} className="endoora-check-row__label">{option.label}</label>
                {option.description ? <p className="endoora-field__help">{option.description}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export type ErrorSummaryItem = {
  fieldId: string;
  message: string;
};

export function ErrorSummary({ title = "Please fix the following", errors }: { title?: string; errors: ErrorSummaryItem[] }) {
  if (errors.length === 0) return null;

  return (
    <section className="endoora-error-summary" role="alert" aria-label={title} tabIndex={-1}>
      <h3 className="text-card-title">{title}</h3>
      <ul>
        {errors.map((error) => (
          <li key={`${error.fieldId}-${error.message}`}><a href={`#${error.fieldId}`}>{error.message}</a></li>
        ))}
      </ul>
    </section>
  );
}

export type NativeOptionProps = OptionHTMLAttributes<HTMLOptionElement>;
export function NativeOption(props: NativeOptionProps) {
  return <option {...props} />;
}
