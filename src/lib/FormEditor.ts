import { createElement, FC, useEffect, useMemo } from "react";
import { every } from "~/lib/arrayUtil";

type FormWidgetProps = {
  id: string;
  title: string;
  value: string;
  required: boolean;
  error: string | null;
  valid: boolean;
  update: (v: string) => void;
};

export type FormWidget<T = {}> = FC<FormWidgetProps & T>;

export type FormSectionConfig<T> = {
  id: string;
  title: string;
  required?: boolean;
  get: (c: T) => string;
  set: (v: string) => Partial<T>;
  validate?: (v: string) => string | null;
};

export type FormSection<T> = FormSectionConfig<T> & {
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

class SectionBuilder<T> {
  private base: FormSection<T>[];

  public constructor(...base: FormSection<T>[]) {
    this.base = base;
  }

  public widget<O>(
    config: FormSectionConfig<T>,
    widget: FC<FormWidgetProps & O>,
    option: O
  ) {
    return new SectionBuilder(...this.base, {
      ...config,
      widget: p => createElement(widget, { ...p, ...option })
    });
  }

  public build() {
    return this.base;
  }
}

export type FormBuilder<T> = (b: SectionBuilder<T>) => SectionBuilder<T>;

type FormEditorProps<T> = {
  builder: FormBuilder<T>;
  current: T;
  setCurrent: (fn: (c: T) => T) => void;
  onValidate?: (valid: boolean) => void;
};

function FormEditor<T>({
  builder,
  current,
  setCurrent,
  onValidate = () => {}
}: FormEditorProps<T>) {
  const formFrame = useMemo(
    () => builder(new SectionBuilder()).build(),
    [builder]
  );
  const sections = useMemo(
    () =>
      formFrame.map(
        ({ widget, id, title, required = true, validate, get, set }) => {
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
          const props: FormWidgetProps = {
            id,
            title,
            value,
            required,
            error,
            valid,
            update
          };
          return {
            widget,
            props
          };
        }
      ),
    [formFrame, current]
  );

  const canSubmit = useMemo(
    () => every(sections, s => s.props.valid),
    [sections]
  );

  useEffect(() => {
    onValidate(canSubmit);
  }, [canSubmit]);

  return createElement(
    "div",
    null,
    sections.map(({ widget, props }) => createElement(widget, props))
  );
}

export default FormEditor;
