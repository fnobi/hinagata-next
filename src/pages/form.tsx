import { NextPage } from "next";
import { FC, FormEvent, useState } from "react";
import FormSection, {
  emailValidator,
  FormPlot,
  FormWidgetProps
} from "~/lib/FormSection";

type SampleFormData = {
  name: string;
  email: string;
  age: number;
  blood: "a" | "b" | "o" | "ab" | null;
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

const SampleFormWidget: FC<FormWidgetProps> = ({
  id,
  title,
  required,
  options,
  value,
  error,
  update
}) => (
  <div key={id}>
    <p>
      {title}
      {required ? "※必須" : null}
    </p>
    {options ? (
      <p>
        <select value={value} onChange={e => update(e.target.value)}>
          {options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </p>
    ) : (
      <div>
        <input
          type="text"
          value={value}
          onChange={e => update(e.target.value)}
        />
        {error ? <p>{error}</p> : null}
      </div>
    )}
  </div>
);

const FORM_PLOT: FormPlot<SampleFormData>[] = [
  {
    id: "name",
    title: "お名前を教えて下さい",
    getter: c => c.name,
    setter: v => ({ name: v }),
    widget: SampleFormWidget
  },
  {
    id: "age",
    title: "年齢を教えて下さい",
    required: false,
    getter: c => String(c.age || ""),
    setter: v => ({ age: Number(v) }),
    widget: SampleFormWidget
  },
  {
    id: "blood",
    title: "血液型を教えて下さい",
    options: ["-", "a", "b", "o", "ab"],
    getter: c => c.blood || "",
    setter: v => ({
      blood: parseBlood(v)
    }),
    widget: SampleFormWidget
  },
  {
    id: "email",
    title: "メールアドレスを教えて下さい",
    getter: c => c.email,
    setter: v => ({ email: v }),
    validator: emailValidator,
    widget: SampleFormWidget
  }
];

const SAMPLE_FORM_DEFAULT_DATA: SampleFormData = {
  name: "",
  email: "",
  age: 0,
  blood: null
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
      <FormSection
        plot={FORM_PLOT}
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
