# React Project

- @types/react: "18.2.45",
- @types/react-dom: "18.2.18",
- react: "18.2.0",
- react-dom: "18.2.0",
- recoil: "0.7.7",
- styled-components: "6.1.2",
- typescript: "4.9.5",

```bash
npm i react-beautiful-dnd
npm i --save-dev @types/react-beautiful-dnd

```

# react-beautiful-dnd

[Doc](https://www.npmjs.com/package/react-beautiful-dnd)

## DragDropContext

- v18에서 작동을 안함 -> StrictMode 삭제

앱전체에 활용 가능, 현재는 유저가 드래그앤드롭을 할 특정 영역 생성

- onDragEnd : 필수 prop, 유저가 드래그를 끝낸 시점에 불려지는 함수(많은 정보를 argument로 전달)
- children : 필수

<!-- <img src="/dragDropContext.gif" alt="" /> -->

```ts
function App() {
  return <DragDropContext onDragEnd={onDragEnd}></DragDropContext>;
}
```

### droppable

드래그&드롭할 수 있는 영역

- droppableId : 유저가 드롭할 수 있는 영역이 여러개 일 경우 사용
- children : 필수, 함수여야 함(리액트 요소는 에러)
  - 컴포넌트를 넣으면 바로 사용할 수 있는 무언가를 얻는다

기본

```ts
function App() {
  return <Droppable droppableId="one">{() => <ul></ul>}</Droppable>;
}
```

magic( [provided](https://github.com/atlassian/react-beautiful-dnd/blob/HEAD/docs/api/droppable.md#1-provided-droppableprovided) )의 prop을 보내준당

- provided.placeholder
  - Draggable 드래그하는 동안 position: fixed(영역을 고정시킴)를 적용.
  - Draggable 드래그할 때 Droppable 리스트가 작아지는 것을 방지하기 위해 필요.
  - Draggable 노드의 형제로 렌더링하는 것이 좋다.

```ts
function App() {
  return (
    <Droppable droppableId="one">
      {(magic) => <ul ref={magic.innerRef} {...magic.droppableProps}></ul>}
      {magic.placeholder}
    </Droppable>
  );
}
```

### draggable

드래그 할 수 있는 영역

```ts
function App() {
  return (
    <Draggable draggableId="second" index={1}>
      {() => <li>Two</li>}
    </Draggable>
  );
}
```

magic의 prop을 넣어서 만드는 법

- draggableProps : 요소 전체를 드래그, 🎁One 전체 드래그 가능
- dragHandleProps : 특정 영역을 통해서만 드래그를 가능, 🎁Two 🎁만 드래그 가능

```ts
function App() {
  return (
    <ul>
      <Draggable draggableId="first" index={0}>
        {(magic) => (
          <li
            ref={magic.innerRef}
            {...magic.draggableProps}
            {...magic.dragHandleProps}
          >
            <span {...magic.dragHandleProps}>🎁</span>
            One
          </li>
        )}
      </Draggable>
      <Draggable draggableId="second" index={1}>
        {(magic) => (
          <li ref={magic.innerRef} {...magic.draggableProps}>
            <span {...magic.dragHandleProps}>🎁</span>Two
          </li>
        )}
      </Draggable>
    </ul>
  );
}
```

배열로 만들기

```ts
{(magic) => (
  {toDos.map((toDo, index) => (
    <Draggable key={toDo} draggableId={toDo} index={index}>
    // key와 draggableId 값은 동일해야 함
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  ))}
)}
```

# 데이터 리모델링(recoil)

## onDragEnd

- 드래그를 하면 default의 배열을 뒤바꾸고 싶다
- onDragEnd와 recoil을 사용!

```ts
// atoms.tsx
export const toDoState = atom({
  key: "toDo",
  default: ["a", "b", "c", "d", "e", "f"],
});

// App.tsx
const onDragEnd = ({ destination, source }: DropResult) => {
  console.log("fini");
};
```

- source.index : 최근에 움직여진 item의 index, 어디에서 왔는 가?
- destination.index : 도착지, 어디로 가야하는 가?

ex)
source.index = 0, 0번째 item인 "a" 를 배열에서 삭제
== x.slice(0, 1)
=> ["b", "c", "d", "e", "f"]

destination.index = 3, 방금 삭제한 배열을 추가
== x.slice(3, 0, "a")
=> ["b", "c", "d", "a", "e", "f"]

```ts
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return;

    setToDos((oldToDos) => {
      const toDosCopy = [...oldToDos];
      // 1) Delete item on source.index
      console.log("Delete item on", source.index);
      console.log(toDosCopy);
      toDosCopy.splice(source.index, 1);
      console.log("Delete item");
      console.log(toDosCopy);
      // 2) Put back the item on the destination.index
      console.log("Put back", draggableId, "on", destination.index);
      toDosCopy.splice(destination?.index, 0, draggableId);
      console.log(toDosCopy);
      return toDosCopy;
    });
  };
}
```

# react memo

- react.js에서 기본적으로 parent component의 state가 변하면 해당 컴포넌트의 children은 다시 렌더링 됨
  기본 기능이 필요없을 때 react memo 사용
- prop이 바뀌지 않으면 이 컴포넌트는 렌더링 하지 맛!

`export default React.memo(DraggableCard)`

❗ 드래그앤드롭을 빠르게 시도할 경우 카드가 복제되는 현상발생
React 18에 생긴 [flushSync](https://github.com/atlassian/react-beautiful-dnd/issues/2475) 기능을 통한 해결
➡ 남용시 큰 성능 저하를 초래

# Multi Boards

## 여러개 만들어 보기

state를 object로 만듦

```ts
// toDoState의 확장성
interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    to_do: ["a", "b"],
    doing: ["c", "d"],
    done: ["e", "f"],
  },
});
```

App.tsx에서 map은 못쓰게 됨(array에서만 사용 가능)

```js
const tomato = {
  x: ["a", "b"],
  y: ["c", "d"],
};
// 1
// 주어진 객체의 속성 이름들을 일반적인 반복문과 동일한 순서로 순회되는 열거할 수 있는 배열로 반환
Object.keys(tomato);
// (2) ['x', 'y']
tomato["x"];
tomato["y"];

// 2 1과 똑같음, boardId를 배열에 넣음, boardId를 이용해 토마토 내부도 확인
Object.keys(tomato).map((boardId) => tomato[boardId]);
```

```ts
function App() {
  return (
    <Boards>
      {Object.keys(toDos).map((boardId) => (
        <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} />
      ))}
    </Boards>
  );
}
```

## 하나의 보드에서 움직이기

수정이 일어난 보드만 복사, 복사본을 기존에 붙여 넣는다.
[동일](#onDragEnd)

```ts
const [toDos, setToDos] = useRecoilState(toDoState);
const onDragEnd = (info: DropResult) => {
  const { destination, draggableId, source } = info;
  // same board movement
  if (destination?.droppableId === source.droppableId) {
    // allboard 모든 보드 가져오기
    setToDos((allBoards) => {
      // 변화가 일어난 보드만 복사
      const boardCopy = [...allBoards[source.droppableId]];
      // const boardCopy = [...allBoards["to do"(현재 상태)]];
      boardCopy.splice(source.index, 1);
      boardCopy.splice(destination?.index, 0, draggableId);

      return {
        // 기존 boards
        ...allBoards,
        // "to do"(현재 상태): 복사한 보드,
        [source.droppableId]: boardCopy,
      };
    });
  }
};
```

## "to do"(현재 상태)

source board에서 item을 제거
taget board로 가서 제거한 item을 삽입

```ts
if (destination?.droppableId !== source.droppableId) {
  setToDos((allBoards) => {
    // source board의 copy, 이동이 시작된 지점의 보드 아이디를 알 수 있다.
    const sourceBoard = [...allBoards[source.droppableId]];
    // 움직임이 끝나는 보드의 아이디
    const destinationBoard = [...allBoards[destination.droppableId]];
    // 움직임이 시작 될 때 index 삭제
    sourceBoard.splice(source.index, 1);
    // draggableId 움직임이 끝나는 보드의 index에 넣어줌
    destinationBoard.splice(destination?.index, 0, draggableId);
    return {
      ...allBoards,
      [source.droppableId]: sourceBoard,
      [destination.droppableId]: destinationBoard,
    };
  });
}
```

# style 변경

### Droppablestate snapshot

- `isDraggingOver` : 현재 선택한 Draggable이 특정 Droppable위에 드래깅 되고 있는지 여부 확인
- `draggingOverWith` : Droppable 위로 드래그하는 Draggable ID
- `draggingFromThisWith` : 현재 Droppable에서 벗어난 드래깅되고 있는 Draggable ID
- `isUsingPlaceholder` : placeholder가 사용되고 있는지 여부

색, 카드 모양 변경

```ts
// Board.tsx
const Area = styled.p<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "pink"
      : props.isDraggingFromThis
      ? "red"
      : "darkblue"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

<Droppable droppableId={boardId}>
  {(magic, snapshot) => (
    <Area
      isDraggingOver={snapshot.isDraggingOver}
      isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
      ref={magic.innerRef}
      {...magic.droppableProps}
    >
      {toDos.map((toDo, index) => (
        <DraggableCard key={toDo} toDo={toDo} index={index} />
      ))}
      {magic.placeholder}
    </Area>
  )}
</Droppable>;
```

# 폼 추가

## ref

react를 이용해 html요소를 지정하고 가져오는 방법

```ts
video.play();
//
const videoRef = useRef(null);
const onClick = () => {
  videoRef.current?.play();
};
<video ref={videoRef} />;
// document.querySelector(video)과 같은 방법
```

    // data에서 오는 실제 toDo를 만들어야 함

string에서 object라고 알려주려고 prop 변경
