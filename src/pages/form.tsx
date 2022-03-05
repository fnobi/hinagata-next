import { NextPage } from "next";
import { FormEvent } from "react";
import useFormLogic, { emailValidator } from "~/lib/useFormLogic";

type FormValue = {
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

const PageForm: NextPage = () => {
  const { current, sections, valid } = useFormLogic<FormValue>({
    plot: [
      {
        id: "name",
        title: "お名前を教えて下さい",
        getter: c => c.name,
        setter: v => ({ name: v })
      },
      {
        id: "age",
        title: "年齢を教えて下さい",
        required: false,
        getter: c => String(c.age || ""),
        setter: v => ({ age: Number(v) })
      },
      {
        id: "blood",
        title: "血液型を教えて下さい",
        options: ["-", "a", "b", "o", "ab"],
        getter: c => c.blood || "",
        setter: v => ({
          blood: parseBlood(v)
        })
      },
      {
        id: "email",
        title: "メールアドレスを教えて下さい",
        getter: c => c.email,
        setter: v => ({ email: v }),
        validator: emailValidator
      }
    ],
    defaultValue: {
      name: "",
      email: "",
      age: 0,
      blood: null
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    console.log(current);
  };

  return (
    <form onSubmit={handleSubmit}>
      {sections.map(
        ({ id, title, required, value, options, error, update }) => (
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
        )
      )}
      <p>
        <button type="submit" disabled={!valid}>
          OK
        </button>
      </p>
    </form>
  );
};

export default PageForm;
