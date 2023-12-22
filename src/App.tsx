import { useRecoilState, useRecoilValue } from "recoil";
import { hourSelector, minuteState } from "./atoms";

function App() {
  const [minutes, setMinutes] = useRecoilState(minuteState);
  // minutes : string
  // input으로 state를 가져와서 수정하고 output으로 return : 셀렉터

  const hours = useRecoilValue(hourSelector);

  const onMinutesChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+event.currentTarget.value);
    // setMinutes:string이라 에러, + 붙여주면 number 타입으로 변환( +"1" >> 1)
  };

  return (
    <>
      <input
        value={minutes}
        onChange={onMinutesChange}
        type="number"
        placeholder="Minutes"
      />
      <input value={hours} type="number" placeholder="Hours" />
      {/* hourSelector와 input 연결 */}
    </>
  );
}

export default App;
