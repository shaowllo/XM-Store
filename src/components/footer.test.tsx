// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("should render footer with brand name", () => {
    render(<Footer />);
    expect(screen.getByText("XMStore")).toBeInTheDocument();
  });

  it("should render feature items", () => {
    render(<Footer />);
    expect(screen.getByText("Express Delivery")).toBeInTheDocument();
    expect(screen.getByText("Quality Guarantee")).toBeInTheDocument();
    expect(screen.getByText("Easy Returns")).toBeInTheDocument();
    expect(screen.getByText("24/7 Support")).toBeInTheDocument();
  });

  it("should render feature descriptions", () => {
    render(<Footer />);
    expect(screen.getByText("Free shipping across the Middle East")).toBeInTheDocument();
    expect(screen.getByText("Authentic products, certified premium")).toBeInTheDocument();
    expect(screen.getByText("7-day hassle-free return policy")).toBeInTheDocument();
    expect(screen.getByText("Dedicated support, always available")).toBeInTheDocument();
  });

  it("should render product category links", () => {
    render(<Footer />);
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Phones")).toBeInTheDocument();
    expect(screen.getByText("Audio")).toBeInTheDocument();
    expect(screen.getByText("Wearables")).toBeInTheDocument();
    expect(screen.getByText("Computers")).toBeInTheDocument();
  });

  it("should render service links", () => {
    render(<Footer />);
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Delivery Info")).toBeInTheDocument();
    expect(screen.getByText("refundPolicy")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("contactUs")).toBeInTheDocument();
  });

  it("should render about links", () => {
    render(<Footer />);
    expect(screen.getByText("aboutUs")).toBeInTheDocument();
    expect(screen.getByText("Our Story")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    // privacyPolicy appears twice (about links + bottom links)
    expect(screen.getAllByText("privacyPolicy").length).toBeGreaterThanOrEqual(1);
    // termsOfService appears twice (about links + bottom links)
    expect(screen.getAllByText("termsOfService").length).toBeGreaterThanOrEqual(1);
  });

  it("should render copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 XM Store/)).toBeInTheDocument();
  });

  it("should have correct link hrefs", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Our Story" })).toHaveAttribute("href", "/about");
  });
});
