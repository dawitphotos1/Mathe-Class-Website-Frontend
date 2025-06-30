// __tests__/Navbar.darkmode.test.jsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

describe("Navbar Dark Mode Toggle", () => {
  beforeEach(() => {
    // Reset document and localStorage between tests
    document.body.className = "";
    localStorage.clear();
  });

  const renderNavbar = (role = "student") => {
    return render(
      <MemoryRouter>
        <Navbar user={{ id: 1, role }} onLogout={() => {}} />
      </MemoryRouter>
    );
  };

  test("toggle switch enables dark mode", () => {
    const { getByLabelText } = renderNavbar();

    const toggle = getByLabelText(/dark mode/i);
    fireEvent.click(toggle);

    expect(document.body.classList.contains("dark-mode")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("toggle switch disables dark mode", () => {
    localStorage.setItem("theme", "dark");
    document.body.classList.add("dark-mode");

    const { getByLabelText } = renderNavbar();

    const toggle = getByLabelText(/dark mode/i);
    fireEvent.click(toggle); // turn off

    expect(document.body.classList.contains("dark-mode")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("initial render reflects stored dark mode setting", () => {
    localStorage.setItem("theme", "dark");
    const { getByLabelText } = renderNavbar();
    const toggle = getByLabelText(/dark mode/i);
    expect(toggle.checked).toBe(true);
    expect(document.body.classList.contains("dark-mode")).toBe(true);
  });
});
