/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";

describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "e@e" })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);

    router();

    window.onNavigate(ROUTES_PATH.NewBill);
  });

  describe("When I am on NewBill Page", () => {
    test("Then I should see a title name ( Envoyer une note de frais) ", async () => {
      await waitFor(() => screen.getByText("Envoyer une note de frais"));

      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  });

  describe("When I upload a file", () => {
    test("Then the file upload without good image extension", () => {
      document.body.innerHTML = NewBillUI();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const input = screen.getByTestId("file");
      const file = new File(["file"], "file.txt", { type: "text/plain" });

      input.addEventListener("change", handleChangeFile);
      userEvent.upload(input, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.value).toEqual("");
    });

    test("Then the file upload with good image extension", () => {
      document.body.innerHTML = NewBillUI();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const input = screen.getByTestId("file");
      const file = new File(["image"], "image.jpg", { type: "image/jpg" });

      input.addEventListener("change", handleChangeFile);
      userEvent.upload(input, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.files[0]).toStrictEqual(file);
      expect(input.files[0].name).toBe("image.jpg");
    });
  });

  // test du POST
  describe("When I submit a new bill", () => {
    test("Then It should create a bill", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const form = screen.getByTestId("form-new-bill");

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
