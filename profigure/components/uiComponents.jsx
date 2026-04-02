import React from "react";
import Image from "next/image";

import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "motion/react";
import {useRouter} from "next/navigation";
import {
  useModel,
  showTrackpad,
  showKnobs,
  showKeypad,
  setShowTrackpad,
  setShowKnobs,
  setShowKeypad,
} from "../context/ModelContext";

//? CORE Text Components

export const HeadingLG = ({children, className = ""}) => (
  <h2
    className={`text-black text-4xl leading-4xl md:text-5xl md:leading-5xl ${className}`}
  >
    {children}
  </h2>
);

export const HeadingMD = ({children, className = ""}) => (
  <h3 className={`text-black text-2xl md:text-4xl ${className}`}>{children}</h3>
);

export const HeadingSM = ({children, className = ""}) => (
  <h4 className={`text-black text-xl md:text-2xl  ${className}`}>{children}</h4>
);

export const HeadingXS = ({children, className = ""}) => (
  <p className={`text-black text-xs tracking-[0.1em] uppercase ${className}`}>
    {children}
  </p>
);

export const Paragraph = ({children, className = ""}) => (
  <p className={`text-black text-sm ${className}`}>{children}</p>
);

export const ParagraphLarge = ({children, className = ""}) => (
  <p className={`text-black text-lg ${className}`}>{children}</p>
);

//? ALT Text Components

export const HeadingSMAlt = ({children, className = ""}) => (
  <h3 className={`text-black text-lg  ${className}`}>{children}</h3>
);

export const ParagraphAlt = ({children, className = ""}) => (
  <p className={`text-black text-[10px] leading-normal ${className}`}>
    {children}
  </p>
);

export const HeadingXSFooter = ({children, className = ""}) => (
  <p
    className={`text-black text-[10px] tracking-[0.1em] uppercase ${className}`}
  >
    {children}
  </p>
);

//? Button Component
export const Button = ({
  children,
  onClick,
  variant = "light",
  disabled = false,
  className = "",
  href = "",
}) => {
  const baseClasses =
    "px-3 pb-[9px] pt-[9px] rounded-lg font-normal text-xs lg:text-sm tracking-[0.1em] inline-block w-fit h-fit uppercase justify-center flex gap-2 items-center transition-all duration-300"; // Added transition
  const variantClasses = {
    primary: "text-black bg-lemon hover:bg-light-lemon", // Added hover background
    secondary: "text-black bg-platinum ", // Added hover background
  };

  const buttonVariant = disabled ? `disabled-${variant}` : variant;

  return (
    <button
      className={`${baseClasses} ${variantClasses[buttonVariant]} ${className} group`} // Added 'group' class for child targeting
      onClick={onClick}
      disabled={disabled}
    >
      <HeadingXS>{children}</HeadingXS>
      {variant === "primary" && (
        <div
          className={`w-[10px] h-[10px] transition-transform duration-300 transform rotate-45 group-hover:-rotate-0 `}
        >
          <Image alt="button" fill src="/arrow_outward.svg" />
        </div>
      )}
    </button>
  );
};

export const ButtonLG = ({
  children,
  onClick,
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "px-3 pb-5 pt-5 rounded-lg font-normal text-xs lg:text-sm tracking-[0.1em] inline-block w-fit h-fit uppercase justify-center flex gap-2 items-center transition-all duration-300"; // Added transition

  return (
    <button
      className={`${baseClasses} ${className} group`} // Added 'group' class for child targeting
      onClick={onClick}
      disabled={disabled}
    >
      <HeadingXS className="text-white">{children}</HeadingXS>
    </button>
  );
};

//? Space Components

export const Space = ({className = ""}) => (
  <div className={`w-full h-auto pb-[60px] md:pb-[120px] ${className}`} />
);

export const SpaceLG = ({className = ""}) => (
  <div className={`w-full h-auto pb-[100px] md:pb-[200px] ${className}`} />
);

//? Accordion Component

export const Accordion = ({section, productImages = {}}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const {selectedOptions, handleOptionSelect} = useModel();
  const selectedOption = selectedOptions[section.title.toLowerCase()];

  // Auto-select the option marked default: true on first mount
  useEffect(() => {
    if (selectedOption) return;
    const defaultOpt = section.options.find((o) => o.default);
    if (defaultOpt) handleOptionSelect(section.title, defaultOpt);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isOptionSelected = (option) => selectedOption?.title === option.title;
  const selectedLabel = selectedOption?.title || null;

  const handleSelect = (option) => {
    handleOptionSelect(section.title, option);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(section.title.toLowerCase(), option.title.toLowerCase());
    router.push(`?${searchParams.toString()}`, {scroll: false});
  };

  return (
    <motion.div className="inset-0 w-full px-4 py-2 border border-gray-300 rounded-lg">
      <motion.button
        className="flex items-center justify-between w-full py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <HeadingXS>{section.title}</HeadingXS>
          {selectedLabel && (
            <HeadingXS className="text-brandSecondary">
              {selectedLabel}
            </HeadingXS>
          )}
        </div>
        <motion.span
          animate={{rotate: isOpen ? 180 : 0}}
          transition={{duration: 0.3}}
          className="relative w-4 h-4 text-xs text-gray-500"
        >
          <Image
            src="/ArrowDown.svg"
            alt="arrow"
            fill
            className="object-contain"
          />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3}}
            className="overflow-hidden "
          >
            <div className={`grid ${section.grid} gap-2 py-4`}>
              {section.selection === "primary" ? (
                <>
                  {section.options.map((option) => (
                    <Selection
                      key={option.title}
                      option={option}
                      productImage={option.productHandle ? productImages[option.productHandle] : undefined}
                      isSelected={isOptionSelected(option)}
                      onSelect={() => handleSelect(option)}
                    />
                  ))}
                </>
              ) : (
                <>
                  {section.options.map((option) => (
                    <SelectionAlt
                      key={option.title}
                      option={option}
                      isSelected={isOptionSelected(option)}
                      onSelect={() => handleSelect(option)}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Selection = ({option, isSelected, onSelect, productImage}) => {
  return (
    <div
      className="flex flex-col w-full gap-4 text-center cursor-pointer"
      onClick={onSelect}
    >
      <div
        className={`inset-0 flex flex-col items-center justify-center overflow-hidden border relative bg-gray-50 ${
          isSelected ? "border-brandPrimary" : "border-gray-300"
        } rounded-lg aspect-square`}
      >
        {isSelected && (
          <div className="absolute z-10 w-3 h-3 rounded-full bg-brandSecondary top-2 right-2" />
        )}
        {productImage ? (
          <SelectionShopifyProduct image={productImage} />
        ) : option.component ? (
          option.component
        ) : null}
      </div>
      <HeadingXS>{option.title}</HeadingXS>
    </div>
  );
};

export const SelectionShopifyProduct = ({image}) => {
  return (
    <div className="relative w-full h-full">
      <Image
        alt={image.altText}
        src={image.url}
        fill
        className="object-contain p-3"
      />
    </div>
  );
};

export const SelectionAlt = ({option, isSelected, onSelect}) => {
  return (
    <div
      className="flex flex-col w-full gap-4 cursor-pointer"
      onClick={onSelect}
    >
      <div
        className={`inset-0 flex justify-between items-center p-4 border relative bg-gray-50 gap-2 ${
          isSelected ? "border-brandPrimary" : "border-gray-300"
        } rounded-lg `}
      >
        <div className="flex flex-col gap-2">
          <HeadingXS>{option.title}</HeadingXS>
          <div className="flex gap-2">
            <div className="px-2 py-1 border border-gray-300 rounded-md w-fit">
              <HeadingXSFooter className="">+ NumPad</HeadingXSFooter>
            </div>
            <div className="px-2 py-1 border border-gray-300 rounded-md w-fit">
              <HeadingXSFooter className="">+ Mixer</HeadingXSFooter>
            </div>
          </div>
        </div>
        <HeadingSM className="text-right">$249.99</HeadingSM>
        {isSelected && (
          <div className="absolute w-3 h-3 rounded-full bg-brandPrimary top-2 right-2" />
        )}
      </div>
    </div>
  );
};

//? Custom Selections

export const SelectionColor = ({option, onClick}) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full gap-4 text-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className="w-10 h-10 border border-black rounded-full aspect-square"
        style={{backgroundColor: option.color || "#ffffff"}}
      />
    </div>
  );
};

export const SelectionSystem = ({img}) => {
  return (
    <div className="relative w-[30%] h-full">
      <Image alt="system" fill src={img} className="object-contain" />
    </div>
  );
};

export const SelectionAddOn = ({img}) => {
  return (
    <div className="relative w-full h-full">
      <Image alt="system" fill src={img} className="object-contain" />
    </div>
  );
};
