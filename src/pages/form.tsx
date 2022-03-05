import { NextPage } from "next";
import { FormEvent } from "react";
import useFormLogic from "~/lib/useFormLogic";

type FormValue = {
  name: string;
  email: string;
  age: number;
};

const PageForm: NextPage = () => {
  const { current, updateForm, sections, valid } = useFormLogic<FormValue>({
    plot: [
      {
        title: "お名前を教えて下さい",
        required: true,
        key: "name"
      },
      {
        title: "年齢を教えて下さい",
        required: false,
        key: "age"
      },
      {
        title: "メールアドレスを教えて下さい",
        required: true,
        key: "email"
      }
    ],
    defaultValue: {
      name: "",
      email: "",
      age: 0
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
      {sections.map(({ plot }) => (
        <div key={plot.key}>
          <p>{plot.title}</p>
          <p>
            <input
              type="text"
              value={current[plot.key]}
              onChange={e => {
                switch (plot.key) {
                  case "age":
                    return updateForm(plot.key, Number(e.target.value));
                  default:
                    return updateForm(plot.key, e.target.value);
                }
              }}
            />
          </p>
        </div>
      ))}
      <p>
        <button type="submit" disabled={!valid}>
          OK
        </button>
      </p>
    </form>
  );
};

export default PageForm;
