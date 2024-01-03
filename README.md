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

## 드래그를 하면 default의 배열을 뒤바꾸고 싶다

onDragEnd와 recoil을 사용!

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
