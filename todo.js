"use strict";

function Root() {
  const [contents, setContents] = React.useState(() => {
    let obj = {};
    const ids = Object.keys(localStorage)
      .filter((id) => id !== "id")
      .map((id) => {
        return parseInt(id);
      })
      .sort((a, b) => a - b);

    ids.map((id) => {
      obj[id] = localStorage.getItem(id);
    });
    return obj;
  });

  return (
    <div>
      <InputForm contents={contents} setContents={setContents} />
      <Todo contents={contents} setContents={setContents} />
    </div>
  );
}

const InputForm = (props) => {
  const calcCurrentId = () => {
    const ids = Object.keys(props.contents);
    if (ids.length === 0) {
      return 0;
    } else {
      const parsedIds = ids.map((id) => parseInt(id));
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

    setCurrentId(currentId + 1);
    localStorage.setItem("id", currentId);

    localStorage.setItem(currentId, content);
    props.setContents({ ...props.contents, [currentId]: content });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          TODO:
          <input
            key={"edit_form_" + props.id}
            type="text"
            value={content}
            onChange={handleChange}
          />
        </label>
        <input key={"submit_" + props.id} type="submit" value="Submit" />
      </form>
    </div>
  );
};

const Todo = (props) => {
  let visible = {};
  Object.keys(props.contents).map((id) => {
    visible[id] = false;
  });
  const [isVisible, setIsVisible] = React.useState(visible);

  return (
    <div>
      {Object.keys(props.contents).map((id) => {
        return (
          <div key={id}>
            <p>{props.contents[id]}</p>
            <div className="buttons">
              <ToggleEdit
                id={id}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
              />
              <DeleteButton
                id={id}
                contents={props.contents}
                setContents={props.setContents}
              />
              {isVisible[id] && (
                <EditForm
                  id={id}
                  contents={props.contents}
                  setContents={props.setContents}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ToggleEdit = (props) => {
  const toggleVisibility = () => {
    let obj = { ...props.isVisible };
    obj[props.id] = !obj[props.id];
    props.setIsVisible(obj);
  };

  return (
    <div>
      <button onClick={toggleVisibility}>Edit</button>
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

const DeleteButton = (props) => {
  return (
    <div>
      <button
        className="delete"
        id={"delete" + props.id}
        onClick={() => {
          localStorage.removeItem(props.id);

          let updatedContents = { ...props.contents };
          delete updatedContents[props.id];

          props.setContents(updatedContents);
        }}
      >
        delete
      </button>
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
