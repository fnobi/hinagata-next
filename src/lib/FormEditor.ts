import { createElement, FC, useEffect } from "react";
import { every } from "~/lib/arrayUtil";

export type FormWidgetProps = {
  id: string;
  title: string;
  value: string;
  required: boolean;
  options?: { value: string; label: string }[];
  error: string | null;
  valid: boolean;
  update: (v: string) => void;
};

export type FormPlot<T> = {
  id: string;
  title: string;
  required?: boolean;
  optionsArray?: string[];
  options?: { value: string; label: string }[];
  widget: FC<FormWidgetProps>;
  get: (c: T) => string;
  set: (v: string) => Partial<T>;
  validate?: (v: string) => string | null;
};

export const emailValidator = (v: string) => {
  if (!v) {
    return null;
  }
  if (
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
      v
    )
  ) {
    return null;
  }
  return "不正なメールアドレスです";
};

export default function FormEditor<T>(props: {
  plot: FormPlot<T>[];
  current: T;
  setCurrent: (fn: (c: T) => T) => void;
  onValidate?: (valid: boolean) => void;
}) {
  const { current, setCurrent, plot, onValidate = () => {} } = props;
  const sections: { widget: FC<FormWidgetProps>; props: FormWidgetProps }[] =
    plot.map(
      ({
        id,
        title,
        required = true,
        options: optionsOriginal,
        optionsArray,
        validate,
        get,
        set,
        widget
      }) => {
        const value = get(current);
        const error = validate ? validate(value) : null;
        const valid = (() => {
          if (error) {
            return false;
          }
          if (required && !value) {
            return false;
          }
          return true;
        })();
        const update = (v: string) => setCurrent(c => ({ ...c, ...set(v) }));
        const options = (() => {
          if (optionsOriginal) {
            return optionsOriginal;
          }
          if (optionsArray) {
            return optionsArray.map(s => ({ label: s, value: s }));
          }
          return undefined;
        })();

        return {
          widget,
          props: {
            id,
            title,
            value,
            required,
            options,
            error,
            valid,
            update
          }
        };
      }
    );
  const valid = every(sections, s => s.props.valid);

  useEffect(() => {
    onValidate(valid);
  }, [valid]);

  return createElement(
    "div",
    null,
    sections.map(({ widget, props: p }) =>
      createElement(widget, { ...p, key: p.id })
    )
  );
}
