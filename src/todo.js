"use strict";
//localStorage.clear();
function Root() {
  const [ids, setIds] = React.useState(
    Object.keys(localStorage)
      .filter((id) => id !== "id")
      .map((id) => {
        return parseInt(id);
      })
      .sort((a, b) => a - b)
  );

  const [contents, setContents] = React.useState(() => {
    let data = {};
    ids.map((id) => {
      data[id] = localStorage.getItem(id);
    });
    return data;
  });

  return (
    <div>
      <InputForm
        ids={ids}
        setIds={setIds}
        contents={contents}
        setContents={setContents}
      />
      <Todo
        ids={ids}
        setIds={setIds}
        contents={contents}
        setContents={setContents}
      />
    </div>
  );
}

const InputForm = (props) => {
  const calcCurrentId = () => {
    if (props.ids.length === 0) {
      return 0;
    } else {
      const parsedIds = props.ids.map((id) => parseInt(id));
      return Math.max(...parsedIds) + 1;
    }
  };
  const [currentId, setCurrentId] = React.useState(calcCurrentId());
  const [content, setContent] = React.useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (localStorage.hasOwnProperty("id")) {
      setCurrentId(currentId + 1);
      const updatedIds = [...props.ids, currentId];
      props.setIds(updatedIds);

      localStorage.setItem("id", currentId);
    } else {
      localStorage.setItem("id", 0);
    }
    localStorage.setItem(currentId, content);
    props.setContents({ ...props.contents, [currentId]: content });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          TODO:
          <input type="text" value={content} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

const Todo = (props) => {
  return (
    <div>
      {Object.keys(props.contents).map((id) => {
        return (
          <div id={id}>
            <p>{props.contents[id]}</p>
            <DeleteButton
              id={id}
              setIds={props.setIds}
              contents={props.contents}
              setContents={props.setContents}
            />
            <ToggleEdit
              id={id}
              setIds={props.setIds}
              contents={props.contents}
              setContents={props.setContents}
            />
          </div>
        );
      })}
    </div>
  );
};

const DeleteButton = (props) => {
  return (
    <button
      className="delete"
      id={"delete" + props.id}
      onClick={function () {
        localStorage.removeItem(props.id);
        const updatedIds = Object.keys(localStorage)
          .filter((id) => id !== "id" || id === props.id)
          .map((id) => {
            return parseInt(id);
          })
          .sort((a, b) => a - b);
        props.setIds(updatedIds);

        let updatedContents = props.contents;
        delete updatedContents[props.id];
        props.setContents(updatedContents);
      }}
    >
      delete
    </button>
  );
};

const ToggleEdit = (props) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={toggleVisibility}>Edit</button>
      {isVisible && (
        <div>
          <EditForm
            id={props.id}
            setIds={props.setIds}
            contents={props.contents}
            setContents={props.setContents}
          />
        </div>
      )}
    </div>
  );
};
const EditForm = (props) => {
  const [content, setContent] = React.useState("");
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event, id) => {
    event.preventDefault();
    localStorage.setItem(id, content);
    props.setContents({ ...props.contents, [id]: content });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event, props.id)}>
        <label>
          EDIT:
          <input type="text" value={content} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
