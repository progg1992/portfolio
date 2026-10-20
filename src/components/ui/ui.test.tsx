import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button, ButtonLink } from "./button";
import { FilterButton } from "./tag";
import { TerminalTab } from "./terminal-tab";
import { TextField } from "./text-field";

afterEach(cleanup);

describe("Button", () => {
  it("renders a real button that defaults to type=button", () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveProperty("type", "button");
  });

  it("ButtonLink renders an anchor, not a button", () => {
    render(<ButtonLink href="/contact">Contact</ButtonLink>);
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link.getAttribute("href")).toBe("/contact");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("TextField", () => {
  it("associates its label with the control", () => {
    render(<TextField id="email" label="Work email" type="email" />);
    expect(screen.getByLabelText("Work email").getAttribute("type")).toBe("email");
  });

  it("marks the field invalid and links the error message", () => {
    render(<TextField id="email" label="Work email" error="Expected name@domain" />);
    const input = screen.getByLabelText("Work email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy && document.getElementById(describedBy)?.textContent).toBe(
      "Expected name@domain",
    );
  });

  it("is not marked invalid without an error", () => {
    render(<TextField id="name" label="Name" />);
    expect(screen.getByLabelText("Name").hasAttribute("aria-invalid")).toBe(false);
  });

  it("renders a textarea when multiline", () => {
    render(<TextField id="msg" label="Message" multiline />);
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });
});

describe("TerminalTab", () => {
  it("only the selected tab is in the tab order", () => {
    render(
      <div role="tablist">
        <TerminalTab selected controls="p1">
          one
        </TerminalTab>
        <TerminalTab selected={false} controls="p2">
          two
        </TerminalTab>
      </div>,
    );
    const [one, two] = screen.getAllByRole("tab");
    expect(one.getAttribute("aria-selected")).toBe("true");
    expect(one.tabIndex).toBe(0);
    expect(two.tabIndex).toBe(-1);
  });
});

describe("FilterButton", () => {
  it("announces its pressed state", () => {
    render(
      <FilterButton pressed onClick={() => {}}>
        infrastructure
      </FilterButton>,
    );
    expect(
      screen.getByRole("button", { name: "infrastructure" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });
});
