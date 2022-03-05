import { NextPage } from "next";
import { FormEvent } from "react";
import useFormLogic from "~/lib/useFormLogic";

type FormValue = {
  name: string;
  email: string;
  age: number;
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
        getter: c => String(c.age),
        setter: v => ({ age: Number(v) })
      },
      {
        id: "email",
        title: "メールアドレスを教えて下さい",
        getter: c => c.email,
        setter: v => ({ email: v })
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
      {sections.map(({ id, title, value, update }) => (
        <div key={id}>
          <p>{title}</p>
          <p>
            <input
              type="text"
              value={value}
              onChange={e => update(e.target.value)}
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
