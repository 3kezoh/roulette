import { createSignal, type Component } from "solid-js";
import Wheel from "./components/Wheel";
import { random } from "./helpers";

const App: Component = () => {
  // const [file, setFile] = createSignal(null);
  const [getState, setState] = createSignal<{ from: number; to?: number }>({
    from: 0,
  });

  // const onChange: JSX.ChangeEventHandlerUnion<
  //   HTMLInputElement,
  //   Event
  // > = async ({ target }) => {
  //   if (!target.files) {
  //     return;
  //   }

  //   const [file] = target.files;

  //   const text = await file.text();
  // };

  const students = [
    "Stanley",
    "Keylian",
    "Rhadya",
    "Ryan",
    "Rowan",
    "Riley",
    "Yana-ïss",
    "Yowen",
    "Ceejay",
    "Jaymee",
  ];

  function onClick() {
    setState(({ from, to }) => {
      const nextTo = random(0, students.length - 1);

      if (to !== undefined) {
        return {
          from: to,
          to: nextTo,
        };
      }

      return {
        from,
        to: nextTo,
      };
    });
  }

  return (
    <div class="grid gap-2 justify-items-center">
      <div class="relative">
        <Wheel data={students} radius={500} {...getState()} />
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 absolute top-1/2 right-0 border-2 -translate-y-1/2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
        </svg>
      </div>
      <button type="button" class="border-black border-2 p-2" onClick={onClick}>
        Spin
      </button>
      {/* <input type="file" onChange={onChange} /> */}
    </div>
  );
};

export default App;
