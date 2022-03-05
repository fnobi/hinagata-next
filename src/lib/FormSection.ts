import { createElement, FC, useEffect } from "react";
import { every } from "~/lib/arrayUtil";

export type FormWidgetProps = {
  id: string;
  title: string;
  value: string;
  required: boolean;
  options?: string[];
  error: string | null;
  valid: boolean;
  update: (v: string) => void;
};

export type FormPlot<T> = {
  id: string;
  title: string;
  required?: boolean;
  getter: (c: T) => string;
  setter: (v: string) => Partial<T>;
  options?: string[];
  validator?: (v: string) => string | null;
  widget: FC<FormWidgetProps>;
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

export default function FormSection<T>(props: {
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
        options,
        validator,
        getter,
        setter,
        widget
      }) => {
        const value = getter(current);
        const error = validator ? validator(value) : null;
        const valid = (() => {
          if (error) {
            return false;
          }
          if (required && !value) {
            return false;
          }
          return true;
        })();
        const update = (v: string) => setCurrent(c => ({ ...c, ...setter(v) }));

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
