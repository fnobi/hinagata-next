import { NextPage } from "next";
import { FC, FormEvent, useState } from "react";
import FormEditor, {
  FormBuilder,
  FormWidget,
  emailValidator
} from "~/lib/FormEditor";

type SampleFormData = {
  name: string;
  email: string;
  age: number;
  blood: "a" | "b" | "o" | "ab" | null;
  gender: "male" | "female" | null;
};

const parseBlood = (v: string) => {
  switch (v) {
    case "a":
    case "b":
    case "o":
    case "ab":
      return v;
    default:
      return null;
  }
};

const parseGender = (v: string) => {
  switch (v) {
    case "male":
    case "female":
      return v;
    default:
      return null;
  }
};

const FormWidgetFrame: FC<{
  title: string;
  required: boolean;
  error: string | null;
}> = ({ title, required, error, children }) => (
  <div>
    <p>
      {title}
      {required ? "※必須" : null}
    </p>
    {children}
    {error ? <p>{error}</p> : null}
    <br />
  </div>
);

const StringFormWidget: FormWidget<{
  placeHolder?: string;
  type?: "text" | "number";
}> = ({
  title,
  required,
  value,
  error,
  placeHolder,
  type = "text",
  update
}) => (
  <FormWidgetFrame title={title} required={required} error={error}>
    <p>
      <input
        type={type}
        value={value}
        placeholder={placeHolder}
        onChange={e => update(e.target.value)}
      />
    </p>
  </FormWidgetFrame>
);

const SelectFormWidget: FormWidget<{
  options: { value: string; label: string }[];
}> = ({ title, required, options, value, error, update }) => (
  <FormWidgetFrame title={title} required={required} error={error}>
    <p>
      <select value={value} onChange={e => update(e.target.value)}>
        <option value="">-</option>
        {(options || []).map(({ value: v, label }) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </p>
  </FormWidgetFrame>
);

const RadioFormWidget: FormWidget<{
  options: { value: string; label: string }[];
}> = ({ title, required, options, value, error, update }) => (
  <FormWidgetFrame title={title} required={required} error={error}>
    <p>
      {(options || []).map(({ value: v, label }) => (
        <label key={v}>
          <input
            type="radio"
            value={v}
            checked={v === value}
            onChange={e => update(e.target.checked ? v : "")}
          />
          {label}
        </label>
      ))}
    </p>
  </FormWidgetFrame>
);

const builder: FormBuilder<SampleFormData> = b =>
  b
    .widget(
      {
        id: "name",
        title: "お名前を教えて下さい",
        get: c => c.name,
        set: v => ({ name: v })
      },
      StringFormWidget,
      { placeHolder: "タップして入力" }
    )
    .widget(
      {
        id: "age",
        title: "年齢を教えて下さい",
        required: false,
        get: c => String(c.age || ""),
        set: v => ({ age: Number(v) })
      },
      StringFormWidget,
      { type: "number" }
    )
    .widget(
      {
        id: "gender",
        title: "性別を教えて下さい",
        get: c => c.gender || "",
        set: v => ({ gender: parseGender(v) })
      },
      RadioFormWidget,
      {
        options: [
          { value: "male", label: "男性" },
          { value: "female", label: "女性" }
        ]
      }
    )
    .widget(
      {
        id: "blood",
        title: "血液型を教えて下さい",
        required: false,
        get: c => c.blood || "",
        set: v => ({
          blood: parseBlood(v)
        })
      },
      SelectFormWidget,
      {
        options: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
          { value: "o", label: "O" },
          { value: "ab", label: "AB" }
        ]
      }
    )
    .widget(
      {
        id: "email",
        title: "メールアドレスを教えて下さい",
        get: c => c.email,
        set: v => ({ email: v }),
        validate: emailValidator
      },
      StringFormWidget,
      { placeHolder: "タップして入力" }
    );

const SAMPLE_FORM_DEFAULT_DATA: SampleFormData = {
  name: "",
  email: "",
  age: 0,
  blood: null,
  gender: null
};

const PageForm: NextPage = () => {
  const [current, setCurrent] = useState(SAMPLE_FORM_DEFAULT_DATA);
  const [valid, setValid] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(current);
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormEditor
        builder={builder}
        current={current}
        setCurrent={setCurrent}
        onValidate={setValid}
      />
      <p>
        <button type="submit" disabled={!valid}>
          OK
        </button>
      </p>
    </form>
  );
};

export default PageForm;
