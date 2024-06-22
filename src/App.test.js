import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";
import { hexToRgb } from "@mui/material";

let container = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

test("test that App component renders", () => {
	render(<App />, container);
});

test("test that new-item-button is a button", () => {
	render(<App />, container);
	const element = screen.getByTestId("new-item-button");
	expect(element.outerHTML.toLowerCase().includes("button")).toBe(true);
});

test("test that new-item-input is an input ", () => {
	render(<App />, container);
	const element = screen.getByTestId("new-item-input");
	expect(element.innerHTML.toLowerCase().includes("input")).toBe(true);
});

test("test that no duplicate todos", () => {
	render(<App />, container);

	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });

	const dueDate = "05/30/2023";

	fireEvent.change(inputTask, { target: { value: "History Test" } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);

	fireEvent.change(inputTask, { target: { value: "History Test" } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);

	const check = screen.getAllByTestId("History Test");
	expect(check.length).toBe(1);
});

test("test Submit Task with No Due Date", () => {
	render(<App />, container);

	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const element = screen.getByRole("button", { name: /Add/i });

	fireEvent.change(inputTask, { target: { value: "History Test" } });
	fireEvent.click(element);

	const check = screen.getByText("You have no todo's left");
	expect(check).toBeInTheDocument();
});

test("test Submit Task with No Task Name", () => {
	render(<App />, container);

	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });

	const dueDate = "05/30/2023";

	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);

	const check = screen.getByText("You have no todo's left");
	expect(check).toBeInTheDocument();
});

test("test Late Tasks have Different Colors", () => {
	render(<App />, container);

	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });

	const dueDate = "05/30/2023";

	fireEvent.change(inputTask, { target: { value: "History Test" } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);

	const check = screen.getByTestId(/History Test/i).style.background;
	expect(check).toBe(hexToRgb("#EE4B2B"));
});

test("test Delete Task", () => {
	render(<App />, container);

	const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
	const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
	const element = screen.getByRole("button", { name: /Add/i });

	const dueDate = "05/30/2023";

	fireEvent.change(inputTask, { target: { value: "History Test" } });
	fireEvent.change(inputDate, { target: { value: dueDate } });
	fireEvent.click(element);

	const checkbox = screen.getByRole("checkbox");

	fireEvent.click(checkbox);

	const check = screen.getByText("You have no todo's left");
	expect(check).toBeInTheDocument();
});
