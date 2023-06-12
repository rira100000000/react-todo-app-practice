"use strict";
//localStorage.clear();

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    }
  };
})();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function Root() {
  var _React$useState = React.useState(function () {
      var data = {};
      var ids = Object.keys(localStorage)
        .filter(function (id) {
          return id !== "id";
        })
        .map(function (id) {
          return parseInt(id);
        })
        .sort(function (a, b) {
          return a - b;
        });

      ids.map(function (id) {
        data[id] = localStorage.getItem(id);
      });
      return data;
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    contents = _React$useState2[0],
    setContents = _React$useState2[1];

  return React.createElement(
    "div",
    null,
    React.createElement(InputForm, {
      contents: contents,
      setContents: setContents,
    }),
    React.createElement(Todo, { contents: contents, setContents: setContents })
  );
}

var InputForm = function InputForm(props) {
  var ids = Object.keys(props.contents);
  var calcCurrentId = function calcCurrentId() {
    if (ids.length === 0) {
      return 0;
    } else {
      var parsedIds = ids.map(function (id) {
        return parseInt(id);
      });
      return Math.max.apply(Math, _toConsumableArray(parsedIds)) + 1;
    }
  };

  var _React$useState3 = React.useState(calcCurrentId()),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    currentId = _React$useState4[0],
    setCurrentId = _React$useState4[1];

  var _React$useState5 = React.useState(""),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    content = _React$useState6[0],
    setContent = _React$useState6[1];

  var handleChange = function handleChange(event) {
    setContent(event.target.value);
  };

  var handleSubmit = function handleSubmit(event) {
    event.preventDefault();

    if (localStorage.hasOwnProperty("id")) {
      setCurrentId(currentId + 1);
      localStorage.setItem("id", currentId);
    } else {
      localStorage.setItem("id", 0);
    }
    localStorage.setItem(currentId, content);
    props.setContents(
      Object.assign({}, props.contents, _defineProperty({}, currentId, content))
    );
    setContent("");
  };

  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement(
        "label",
        null,
        "TODO:",
        React.createElement("input", {
          type: "text",
          value: content,
          onChange: handleChange,
        })
      ),
      React.createElement("input", { type: "submit", value: "Submit" })
    )
  );
};

var Todo = function Todo(props) {
  var visible = {};
  Object.keys(props.contents).map(function (id) {
    visible[id] = false;
  });

  var _React$useState7 = React.useState(visible),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    isVisible = _React$useState8[0],
    setIsVisible = _React$useState8[1];

  return React.createElement(
    "div",
    null,
    Object.keys(props.contents).map(function (id) {
      return React.createElement(
        "div",
        { id: id },
        React.createElement("p", null, props.contents[id]),
        React.createElement(
          "div",
          { class: "buttons" },
          React.createElement(ToggleEdit, {
            id: id,
            isVisible: isVisible,
            setIsVisible: setIsVisible,
          }),
          React.createElement(DeleteButton, {
            id: id,
            contents: props.contents,
            setContents: props.setContents,
          }),
          isVisible[id] &&
            React.createElement(
              "div",
              null,
              React.createElement(EditForm, {
                id: id,
                contents: props.contents,
                setContents: props.setContents,
              })
            )
        )
      );
    })
  );
};

var ToggleEdit = function ToggleEdit(props) {
  var toggleVisibility = function toggleVisibility() {
    var obj = Object.assign({}, props.isVisible);
    obj[props.id] = !obj[props.id];
    props.setIsVisible(obj);
  };

  return React.createElement(
    "div",
    null,
    React.createElement("button", { onClick: toggleVisibility }, "Edit")
  );
};

var EditForm = function EditForm(props) {
  var _React$useState9 = React.useState(""),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    content = _React$useState10[0],
    setContent = _React$useState10[1];

  var handleChange = function handleChange(event) {
    setContent(event.target.value);
  };

  var handleSubmit = function handleSubmit(event, id) {
    event.preventDefault();
    localStorage.setItem(id, content);
    props.setContents(
      Object.assign({}, props.contents, _defineProperty({}, id, content))
    );
    setContent("");
  };

  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      {
        onSubmit: function onSubmit(event) {
          return handleSubmit(event, props.id);
        },
      },
      React.createElement(
        "label",
        null,
        "EDIT:",
        React.createElement("input", {
          type: "text",
          value: content,
          onChange: handleChange,
        })
      ),
      React.createElement("input", { type: "submit", value: "Submit" })
    )
  );
};

var DeleteButton = function DeleteButton(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "button",
      {
        className: "delete",
        id: "delete" + props.id,
        onClick: function onClick() {
          localStorage.removeItem(props.id);

          var updatedContents = Object.assign({}, props.contents);
          delete updatedContents[props.id];

          props.setContents(updatedContents);
        },
      },
      "delete"
    )
  );
};
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Root, null));
