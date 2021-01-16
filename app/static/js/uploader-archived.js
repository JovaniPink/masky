// Using XState
const { Machine, assign, interpret } = XState;

// https://tritarget.org/static/Simple%2520DOM%2520micro%2520lib.html

function dom(selector, cloneService = {}) {
  if (Array.isArray(selector)) {
    return (...args) => selector.forEach((fn) => fn(...args));
  }
  function service(...args) {
    let has = (i) => i != null;
    let resolve = (value) =>
      typeof value === "function" ? value(...args) : value;
    for (let element of service.elements) {
      let addClasses = [...service._addClasses].map(resolve);
      let classNames = new Set([...element.classList, ...addClasses]);
      service._deleteClasses.forEach((k) => classNames.delete(resolve(k)));
      has(service._contentHtml) &&
        (element.innerHTML = resolve(service._contentHtml));
      has(service._contentText) &&
        (element.innerText = resolve(service._contentText));
      has(service._styles) && (element.style = resolve(service._styles));
      has(service._value) && (element.value = resolve(service._value));
      classNames.size > 0 && (element.className = [...classNames].join(" "));
      Object.entries(service._attrs).forEach(([key, value]) => {
        value = resolve(value);
        value = value === true ? "" : value;
        value = value === false ? null : value;
        let method = value == null ? "removeAttribute" : "setAttribute";
        element[method](key, value);
      });
    }
  }
  return Object.assign(service, {
    ...cloneService,
    _attrs: { ...cloneService._attrs },
    _styles: cloneService._styles && { ...cloneService._styles },
    _addClasses: new Set(cloneService._addClasses),
    _deleteClasses: new Set(cloneService._deleteClasses),
    get element() {
      return typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    },
    get elements() {
      return typeof selector === "string"
        ? document.querySelectorAll(selector)
        : [].concat(selector);
    },
    find(_selector) {
      return dom(service.element.querySelector(_selector));
    },
    finsAll(_selector) {
      return dom(service.element.querySelectorAll(_selector));
    },
    toggleClass(className, isEnabled) {
      let classNameFn =
        typeof className === "function" ? className : () => className;
      let isEnabledFn =
        isEnabled === undefined
          ? (...args) =>
              !service.element.classList.contains(classNameFn(...args))
          : typeof isEnabled === "function"
          ? isEnabled
          : () => isEnabled;
      return service
        .addClass((...args) => isEnabledFn(...args) && classNameFn(...args))
        .removeClass(
          (...args) => !isEnabledFn(...args) && classNameFn(...args)
        );
    },
    addClass(className) {
      let _deleteClasses = new Set(service._deleteClasses);
      _deleteClasses.delete(className);
      return dom(selector, {
        ...service,
        _deleteClasses,
        _addClasses: new Set([...service._addClasses, className]),
      });
    },
    removeClass(className) {
      return dom(selector, {
        ...service,
        _deleteClasses: new Set([...service._deleteClasses, className]),
      });
    },
    hide() {
      return service.attr("hidden", "");
    },
    show() {
      return service.attr("hidden", null);
    },
    attr(key, value) {
      return service.attrs({ [key]: value });
    },
    attrs(_attrs) {
      return dom(selector, {
        ...service,
        _attrs: { ...service._attrs, ..._attrs },
      });
    },
    styles(_styles = service._styles) {
      return dom(selector, { ...service, _styles });
    },
    text(_contentText) {
      return dom(selector, { ...service, _contentHtml: null, _contentText });
    },
    html(_contentHtml) {
      return dom(selector, { ...service, _contentHtml, _contentText: null });
    },
    value(_value) {
      return dom(selector, { ...service, _value });
    },
    clear() {
      return service.html("");
    },
    on(eventName, callback) {
      service.element.addEventListener(eventName, callback);
      return service;
    },
    off(eventName, callback) {
      service.element.removeEventListener(eventName, callback);
      return service;
    },
    subscribe(eventName, callback) {
      service.on(eventName, callback);
      return { unsubscribe: () => service.off(eventName, callback) };
    },
    one(eventName, callback) {
      let actor = service.subscribe(eventName, (event) => {
        actor.unsubscribe();
        callback(event);
      });
      return service;
    },
    waitFor(eventName) {
      return new Promise((resolve) => service.one(eventName, resolve));
    },
  });
}

const createMachine = () => {
  return Machine(
    {
      id: "app",
      strict: true,
      initial: "idle",
      context: {
        progress: 0,
        file: "",
        files: {},
        fileData: {},
      },
      states: {
        idle: {
          on: { DRAG_OVER: "dragging" },
        },
        dragging: {
          on: {
            DRAG_LEAVE: [
              { target: "error", cond: "hasError" },
              { target: "idle" },
            ],
          },
        },
        processing: {
          entry: "resetProgress",
          exit: "resetFileInput",
          invoke: { src: "processFile" },
          on: {
            PROGRESS: { actions: "updateProgress" },
            ERROR: { target: "error", actions: "storeError" },
            DONE: { target: "completed", actions: "storeFileData" },
          },
        },
        error: {
          entry: "showError",
          on: { DRAG_OVER: "dragging" },
        },
        completed: {
          entry: "renderImageFile",
          after: { 5000: "idle" },
        },
      },
      on: {
        BROWSE: { actions: "browseForFile" },
        PICK_FILE: { target: "processing", actions: "storeFile" },
      },
    },
    {
      guards: {
        hasError: (ctx) => !!ctx.error,
      },
      actions: {
        resetProgress: assign({ progress: 0, error: null }),
        updateProgress: assign({ progress: (_, { value }) => value }),
        storeFile: assign({ files: (_, { files }) => files }),
        storeFileData: assign({ fileData: (_, { data }) => data }),
        storeError: assign({ error: (_, { data }) => data }),
      },
    }
  );
};

function processFile(manager) {
  console.log(manager);
  const { min, round } = Math;
  let {
    files: [file],
  } = manager.context;
  if (!file.type.match("image.*")) {
    return manager.error(new Error("Not an image file"));
  } else {
    console.log(file.name);
    let reader = new FileReader();
    console.log(reader);
    manager.onabort = () => reader.abort();
    reader.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      let { loaded, total } = event;
      let percent = round(loaded / total) * 100;
      manager.progress(min(100, percent));
    };
    reader.onerror = (event) => manager.error(event.target.error);
    reader.onload = (event) => manager.done(event.target.result);
    reader.readAsDataURL(file);
  }
}

const trackableCancelableService = (serviceFn) => {
  return (context) => (callback) => {
    let manager = {
      context,
      done: (data) => callback({ type: "DONE", data }),
      error: (data) => callback({ type: "ERROR", data }),
      progress: (value) => callback({ type: "PROGRESS", value }),
      onabort: () => {},
    };
    serviceFn(manager);
    return () => manager.onabort();
  };
};

let interpreter = interpret(
  createMachine().withConfig({
    actions: {
      resetFileInput: dom("#file-picker").value(""),
      browseForFile: () => dom("#file-picker").element.click(),
      showError: dom("#error").text((ctx) => ctx.error.message),
      renderImageFile: (ctx) => {
        let parent = dom("#file-gallery").element;
        let template = dom("#gallery-item").element.content;
        let fragment = document.importNode(template, true);
        let item = dom(fragment.children[0]);
        item.find("img").attr("src", ctx.fileData)();
        item
          .find("button")
          .on("click", (e) => parent.removeChild(item.element));
        parent.appendChild(fragment);
      },
    },
    services: {
      processFile: trackableCancelableService(processFile),
    },
  })
);

function transition(type, transFn = (value) => ({ value })) {
  return (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(transFn(event));
    interpreter.send({ type, ...transFn(event) });
  };
}

dom("#idle-message").on("click", transition("BROWSE"));
dom("#completed-message").on("click", transition("BROWSE"));
dom("#error-message").on("click", transition("BROWSE"));
dom("#file-picker").on(
  "change",
  transition("PICK_FILE", (event) => ({ files: event.target.files }))
);
dom(document.body).on("dragover", transition("DRAG_LEAVE"));
dom("#drop-container").on("dragover", transition("DRAG_OVER"));
dom("#dropzone-overlay")
  .on("dragover", transition("DRAG_OVER"))
  .on("dragleave", transition("DRAG_LEAVE"))
  .on(
    "drop",
    transition("PICK_FILE", (event) => ({ files: event.dataTransfer.files }))
  );

let renderState = dom([
  dom(document.body).attr("data-state", (state) => state.toStrings().join(" ")),
  dom("#progress-bar").styles((state) => ({
    width: `${state.context.progress}%`,
  })),
  dom("#accessible-bar")
    .value((state) => state.context.progress)
    .text((state) => `${state.context.progress}%`),
]);

let ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
};

ready(() => {
  /* Do things after DOM has fully loaded */
  interpreter.onTransition(renderState);
  interpreter.start();
});
