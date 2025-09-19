import React from "react";
import logo from "@/assessts/logo.ico";
import Image from "next/image";
const RoadmapPdfTemplate = ({ roadmap, isCloned }: any) => {
  return (
    <div
      style={{
        position: "relative",
        fontFamily: "sans-serif",
        background: "white",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-30deg)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
          flexDirection: "column",
        }}
      >
        <Image
          width={200}
          height={200}
          style={{ opacity: 0.1, marginBottom: "16px" }}
          src={logo}
          alt="Logo"
        />
        <span
          style={{
            color: "#e5e7eb",
            fontSize: "80px",
            fontWeight: 800,
            letterSpacing: "0.25em",
          }}
        >
          LEARNLY
        </span>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Title */}
        <h1
          style={{
            color: "#4338ca",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          {roadmap.title}
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#374151",
            fontSize: "16px",
            marginBottom: "24px",
          }}
        >
          {roadmap.description}
        </p>

        {/* Meta */}
        <div
          style={{
            color: "#4b5563",
            fontSize: "14px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{ marginRight: "40px" }}>
            👤 Owner: {roadmap.owner?.name ?? "Unknown"}
          </span>
          <span>📄 Clones: {roadmap._count?.clones ?? 0} users</span>
        </div>

        {/* Microtasks */}
        {roadmap.microtasks.length === 0 ? (
          <div
            style={{
              color: "#9ca3af",
              textAlign: "center",
              fontStyle: "italic",
              padding: "40px 0",
            }}
          >
            🚀 Nothing here yet...{" "}
            {isCloned
              ? "Ask the owner to add microtasks."
              : "Start by adding a new microtask!"}
          </div>
        ) : (
          <div>
            {roadmap.microtasks.map((micro: any) => (
              <div
                key={micro.id}
                style={{
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                  marginBottom: "32px",
                  display: "block",
                }}
              >
                <div
                  style={{
                    color: "#4338ca",
                    backgroundColor: "#eef2ff",
                    borderLeft: "4px solid #4338ca",
                    fontWeight: 600,
                    fontSize: "20px",
                    padding: "8px 16px",
                    marginBottom: "16px",
                    borderRadius: "6px",
                  }}
                >
                  {micro.title}
                </div>

                {micro.tasks.length === 0 ? (
                  <div
                    style={{
                      color: "#9ca3af",
                      fontStyle: "italic",
                      padding: "12px 16px",
                    }}
                  >
                    ✨ No tasks yet {isCloned ? "" : "— add one now!"}
                  </div>
                ) : (
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: 0,
                      margin: 0,
                    }}
                  >
                    {micro.tasks.map((task: any) => (
                      <li
                        key={task.id}
                        style={{
                          display: "flex",
                          alignItems: "center", // still keeps flex
                          padding: "12px",
                          marginBottom: "12px",

                          position: "relative",
                          top: "10px",
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            border: "2px solid #4f46e5",
                            borderRadius: "4px",
                            marginRight: "12px",
                            flexShrink: 0, // stop it from resizing
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        ></div>

                        {/* Text */}
                        <span
                          style={{
                            display: "inline-block",
                            lineHeight: "18px", // match checkbox height
                            verticalAlign: "middle",
                          }}
                        >
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPdfTemplate;
