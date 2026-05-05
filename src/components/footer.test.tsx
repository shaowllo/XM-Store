import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("should render footer with brand name", () => {
    render(<Footer />);
    expect(screen.getByText("XM")).toBeInTheDocument();
    expect(screen.getByText("Store")).toBeInTheDocument();
  });

  it("should render feature items", () => {
    render(<Footer />);
    expect(screen.getByText("极速配送")).toBeInTheDocument();
    expect(screen.getByText("品质保障")).toBeInTheDocument();
    expect(screen.getByText("无忧退换")).toBeInTheDocument();
    expect(screen.getByText("专属客服")).toBeInTheDocument();
  });

  it("should render feature descriptions", () => {
    render(<Footer />);
    expect(screen.getByText("全国包邮，次日送达")).toBeInTheDocument();
    expect(screen.getByText("官方正品，假一赔十")).toBeInTheDocument();
    expect(screen.getByText("7天无理由退换货")).toBeInTheDocument();
    expect(screen.getByText("24小时在线支持")).toBeInTheDocument();
  });

  it("should render product category links", () => {
    render(<Footer />);
    expect(screen.getByText("产品分类")).toBeInTheDocument();
    expect(screen.getByText("手机")).toBeInTheDocument();
    expect(screen.getByText("音频")).toBeInTheDocument();
    expect(screen.getByText("穿戴")).toBeInTheDocument();
    expect(screen.getByText("电脑")).toBeInTheDocument();
  });

  it("should render service links", () => {
    render(<Footer />);
    expect(screen.getByText("服务支持")).toBeInTheDocument();
    expect(screen.getByText("售后服务")).toBeInTheDocument();
    expect(screen.getByText("配送说明")).toBeInTheDocument();
    expect(screen.getByText("退换政策")).toBeInTheDocument();
    expect(screen.getByText("常见问题")).toBeInTheDocument();
  });

  it("should render about links", () => {
    render(<Footer />);
    expect(screen.getByText("关于我们")).toBeInTheDocument();
    expect(screen.getByText("品牌故事")).toBeInTheDocument();
    expect(screen.getByText("联系我们")).toBeInTheDocument();
    expect(screen.getByText("加入我们")).toBeInTheDocument();
    expect(screen.getByText("隐私政策")).toBeInTheDocument();
  });

  it("should render copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 XM Store/)).toBeInTheDocument();
  });

  it("should have correct link hrefs", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "品牌故事" })).toHaveAttribute("href", "/about");
  });
});
