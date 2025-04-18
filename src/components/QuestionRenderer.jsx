import katex from "katex";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";

const QuestionRenderer = ({ htmlContent, classes }) => {
  const [renderedHTML, setRenderedHTML] = useState("");

  useEffect(() => {
    if (!htmlContent) return;

    // Detect inline and block math expressions
    let newHTML = htmlContent.replace(/\$\$(.*?)\$\$/gs, (_, expr) => {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: true,
      });
    });

    newHTML = newHTML.replace(/\$(.*?)\$/g, (_, expr) => {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: false,
      });
    });

    setRenderedHTML(newHTML);
  }, [htmlContent]);

  return (
    <div
      className={`-z-50 prose w-full max-w-full ${classes}`}
      dangerouslySetInnerHTML={{ __html: renderedHTML }}
    />
  );
};

export default QuestionRenderer;
