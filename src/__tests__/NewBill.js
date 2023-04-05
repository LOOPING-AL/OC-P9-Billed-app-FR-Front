/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { fireEvent } from "@testing-library/dom";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
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
    test("I should see a title name ( Envoyer une note de frais) ", async () => {
      await waitFor(() => screen.getByText("Envoyer une note de frais"));

      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });

    test("I upload a file", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const file = new File(["fileTest"], "fileTest.png", {
        type: "image/png",
      });
      const input = screen.getByTestId("file");

      input.addEventListener("change", handleChangeFile);
      fireEvent.change(input, file);

      expect(handleChangeFile).toHaveBeenCalled();
    });

    // test du POST
    test("Then I submit a new bill It should create a bill", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
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
