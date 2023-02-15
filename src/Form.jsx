import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

function Form() {
  // React Hook Form を使うための基本設定
  const { register, handleSubmit, reset, control, getValues } = useForm({
    // input の value の 初期値を設置
    defaultValues: {
      tasks: [{ taskValue: "" }]
    }
  });

  // input を動的に増減させるための設定
  const { fields, prepend, append, remove } = useFieldArray({
    control,
    name: "tasks"
  });

  // submitボタンを押した時に行う処理

  const onSubmit = (data) => {
    console.log(data);
    const list = [];
    data.tasks.forEach((item, index) =>
      list.push(`\nタスク番号${index}:${item.taskValue}`)
    );
    // 送信後 input の入力欄を初期化
    alert(list);
    reset();
  };

  // input をいくつ追加したカウント
  const [count, setCount] = useState(0);
  const countUp = () => setCount(count + 1);

  // input を減らすボタンを押した時の処理
  const reduce = () => {
    if (count > 0) {
      remove(count);
      setCount(count - 1);
    }
  };

  // 漢字変換・予測変換（サジェスト）選択中か否かの判定
  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);

  const onKeydown = (e, key, index) => {
    const value = getValues(`tasks.${index}.taskValue`);
    switch (key) {
      // 変換中でない時に エンター で input を増やす
      case "Enter":
        e.preventDefault();
        if (composing) break;
        append({ taskValue: "" });
        break;
      // input が空欄時に バックスペース で input を減らす
      case "Backspace":
        if (index === 0) break;
        if (value === "") remove(count);
        setCount(count - 1);
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="button"
        onClick={() => [prepend({ taskValue: "" }), countUp()]}
      >
        前に追加
      </button>

      {fields.map((field, index) => (
        <div key={field.id}>
          <label htmlFor={`tasks.${index}.taskValue`}>
            タスク番号{index}：
            <input
              {...register(`tasks.${index}.taskValue`)}
              onCompositionStart={startComposition}
              onCompositionEnd={endComposition}
              onKeyDown={(e) => onKeydown(e, e.key, index)}
            />
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={() => [append({ taskValue: "" }), countUp()]}
      >
        後ろに追加
      </button>
      <br />

      <button type="button" onClick={reduce}>
        減らす
      </button>
      <br />

      <button type="submit">送信</button>
    </form>
  );
}
export default Form;
