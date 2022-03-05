import { NextPage } from "next";
import useFormLogic from "~/lib/useFormLogic";

type FormValue = {
  name: string;
  age: number;
};

const PageForm: NextPage = () => {
  const { current, setCurrent } = useFormLogic<FormValue>({
    defaultValue: {
      name: "",
      age: 0
    }
  });
  return (
    <form>
      <p>
        name:
        <input
          type="text"
          value={current.name}
          onChange={e => setCurrent(c => ({ ...c, name: e.target.value }))}
        />
      </p>
      <p>
        age:
        <input
          type="number"
          value={current.age}
          onChange={e =>
            setCurrent(c => ({ ...c, age: Number(e.target.value) }))
          }
        />
      </p>
    </form>
  );
};

export default PageForm;
