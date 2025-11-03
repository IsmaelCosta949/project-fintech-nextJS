import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClass = hover
    ? "hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md ${paddings[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
