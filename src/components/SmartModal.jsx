import { Fragment, useEffect, useState } from "react";

export default function SmartModal({
  open,
  header,
  showHeader = true,
  size = "3xl",
  scrollable = true,
  centered = false,
  staticBackdrop = false,
  animationType = "scale",
  showFooter = false,
  footerContent = null,
  backdropBlur = false,
  backdropBlurSize = "xs",
  onClose,
  children,
}) {
  const [bump, setBump] = useState(false);
  const [closing, setClosing] = useState(false);

  const sizeClasses = {
    sm: "w-11/12 max-w-sm",
    md: "w-11/12 max-w-md",
    lg: "w-11/12 max-w-lg",
    xl: "w-11/12 max-w-xl",
    "2xl": "w-11/12 max-w-2xl",
    "3xl": "w-11/12 max-w-3xl",
    "4xl": "w-11/12 max-w-4xl",
    "5xl": "w-11/12 max-w-5xl",
    "6xl": "w-11/12 max-w-6xl",
    "7xl": "w-11/12 max-w-7xl",
  };

  const blurClasses = {
    xs: "backdrop-blur-xs",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
  };

  const animationClasses = {
    top: {
      start: "top-0",
      end: "top-20",
    },
    scale: {
      start: "scale-105",
      end: "scale-100",
    },
    bottom: {
      start: "bottom-0",
      end: "bottom-20",
    },
  };

  const handleClose = (e) => {
    if (!staticBackdrop && e.target.id === "modal-wrapper") {
      setClosing(true);
      setTimeout(() => {
        onClose();
        setClosing(false);
      }, 300);
    } else if (staticBackdrop && e.target.id === "modal-wrapper") {
      setBump(true);
      setTimeout(() => setBump(false), 150);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (staticBackdrop && e.key === "Escape") {
        setBump(true);
        setTimeout(() => setBump(false), 150);
      } else if (!staticBackdrop && e.key === "Escape") {
        setClosing(true);
        setTimeout(() => {
          onClose();
          setClosing(false);
        }, 300);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, staticBackdrop, onClose]);

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 duration-200 ease-in-out z-10 ${
          open && !closing
            ? `visible bg-black/60 ${
                backdropBlur ? `${blurClasses[backdropBlurSize]}` : ""
              }`
            : "invisible"
        }`}
      ></div>

      {/* Modal Container */}
      <div
        id="modal-wrapper"
        onClick={handleClose}
        className={`fixed inset-0 flex justify-center z-11 ease-in-out duration-75 ${
          open && !closing ? "visible" : "invisible"
        } overflow-y-auto ${centered ? "items-center" : "items-start"}`}
      >
        <div
          className={`relative bg-white rounded-md shadow-lg ${
            sizeClasses[size]
          } ease-in-out duration-200 ${
            open
              ? closing
                ? `${animationClasses[animationType].start} opacity-0`
                : `${animationClasses[animationType].end} opacity-100`
              : `${animationClasses[animationType].start} opacity-0`
          } ${bump ? "scale-105" : "scale-100"}`}
          style={scrollable ? {} : { marginTop: "0rem" }}
        >
          {showHeader && (
            <div className="sticky top-0 bg-white z-0 flex justify-between items-center px-6 py-2.5 border-b border-gray-200 rounded-t-lg">
              <h6 className="text-lg font-semibold">{header}</h6>
              <button
                onClick={() => {
                  setClosing(true);
                  setTimeout(() => {
                    onClose();
                    setClosing(false);
                  }, 300);
                }}
                className="text-gray-400 hover:text-gray-500 rounded-lg cursor-pointer"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          )}

          <div
            className={`${showHeader ? "px-6 pt-4 pb-6" : ""} ${
              scrollable ? "" : "overflow-y-auto max-h-[70vh]"
            }`}
          >
            {children}
          </div>

          {showFooter && (
            <div className="sticky bottom-0 bg-white z-10 px-4 py-3 border-t border-gray-200 flex justify-end">
              {footerContent}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
