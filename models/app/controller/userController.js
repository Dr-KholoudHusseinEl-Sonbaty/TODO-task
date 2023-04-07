const fs = require("fs");

const filename = "models/allData.json";

class UserController {
  static home(req, res) {
    const allData = UserController.readData();
    res.render("home", {
      pageTitle: "Home",
      allData,
      hasData: allData.length > 0,
    });
  }

  static addTodoForm(req, res) {
    res.render("addTodo", {
      pageTitle: "Add Todo",
    });
  }

  static addTodoSubmit(req, res) {
    const { title, content, dueDate } = req.body;
    const allData = UserController.readData();
    const newTodo = {
      id: Date.now(),
      title,
      content,
      status: false,
      dueDate: new Date(dueDate),
    };
    allData.push(newTodo);
    UserController.writeData(allData);
    res.redirect("/");
  }

  static show(req, res) {
    const allData = UserController.readData();
    const todo = allData.find((t) => t.id === Number(req.params.id));
    if (!todo) {
      res.sendStatus(404);
    } else {
      res.render("showTodo", {
        pageTitle: todo.title,
        todo,
      });
    }
  }

  static editForm(req, res) {
    const allData = UserController.readData();
    const todo = allData.find((t) => t.id === Number(req.params.id));
    if (!todo) {
      res.sendStatus(404);
    } else {
      res.render("editTodo", {
        pageTitle: `Edit ${todo.title}`,
        todo,
      });
    }
  }

  static editSubmit(req, res) {
    const { title, content, dueDate } = req.body;
    const allData = UserController.readData();
    const index = allData.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) {
      res.sendStatus(404);
    } else {
      const updatedTodo = {
        ...allData[index],
        title,
        content,
        dueDate: new Date(dueDate),
      };
      allData[index] = updatedTodo;
      UserController.writeData(allData);
      res.redirect(`/todos/${updatedTodo.id}`);
    }
  }

  static activate(req, res) {
    const allData = UserController.readData();
    const index = allData.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) {
      res.sendStatus(404);
    } else {
      allData[index].status = true;
      UserController.writeData(allData);
      res.redirect("/");
    }
  }

  static delete(req, res) {
    const allData = UserController.readData();
    const index = allData.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) {
      res.sendStatus(404);
    } else {
      allData.splice(index, 1);
      UserController.writeData(allData);
      res.redirect("/");
    }
  }

  static search(req, res) {
    const allData = UserController.readData();
    const searchTerm = req.query.q || "";
    const results = allData.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    res.render("searchResults", {
      pageTitle: "Search Results",
      searchTerm,
      results,
      hasResults: results.length > 0,
    });
