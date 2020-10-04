import React from "react";

import utils from "./utils";

export default function usePaymentCard({
  autoFocus = true,
  errorMessages,
  onBlur,
  onChange,
  onError,
  onTouch,
  cardNumberValidator,
  cvcValidator,
  expiryValidator,
} = {}) {
  const cardNumberField = React.useRef();
  const expiryDateField = React.useRef();
  const cvcField = React.useRef();
  const zipField = React.useRef();

  /** ====== START: META STUFF ====== */
  const [touchedInputs, setTouchedInputs] = React.useState({
    cardNumber: false,
    expiryDate: false,
    cvc: false,
    zip: false,
  });
  const [isTouched, setIsTouched] = React.useState(false);
  const [erroredInputs, setErroredInputs] = React.useState({
    cardNumber: undefined,
    expiryDate: undefined,
    cvc: undefined,
    zip: undefined,
  });
  const [error, setError] = React.useState();
  const [cardType, setCardType] = React.useState();
  const [focused, setFocused] = React.useState();

  const setInputError = React.useCallback((input, error) => {
    setErroredInputs((erroredInputs) => {
      if (erroredInputs[input] === error) return erroredInputs;

      let newError = error;
      const newErroredInputs = { ...erroredInputs, [input]: error };
      if (error) {
        setError(error);
      } else {
        newError = Object.values(newErroredInputs).find(Boolean);
        setError(newError);
      }
      onError && onError(newError, newErroredInputs);
      return newErroredInputs;
    });
  }, []); // eslint-disable-line

  const setInputTouched = React.useCallback((input, value) => {
    requestAnimationFrame(() => {
      if (document.activeElement.tagName !== "INPUT") {
        setIsTouched(true);
      } else if (value === false) {
        setIsTouched(false);
      }
    });

    setTouchedInputs((touchedInputs) => {
      if (touchedInputs[input] === value) return touchedInputs;

      const newTouchedInputs = { ...touchedInputs, [input]: value };
      onTouch && onTouch({ [input]: value }, newTouchedInputs);
      return newTouchedInputs;
    });
  }, []); // eslint-disable-line
  /** ====== END: META STUFF ====== */

  /** ====== START: CARD NUMBER STUFF ====== */
  const handleBlurCardNumber = React.useCallback(
    (props = {}) => {
      return (e) => {
        props.onBlur && props.onBlur(e);
        onBlur && onBlur(e);
        setFocused(undefined);
        setInputTouched("cardNumber", true);
      };
    },
    [onBlur, setInputTouched]
  );

  const handleChangeCardNumber = React.useCallback(
    (props = {}) => {
      return (e) => {
        const formattedCardNumber = e.nativeEvent.text || "";
        const cardNumber = formattedCardNumber.replace(/\s/g, "");
        let cursorPosition = cardNumberField.current.selectionStart;

        const cardType = utils.cardTypes.getCardTypeByValue(cardNumber);
        setCardType(cardType);

        setInputTouched("cardNumber", false);

        // @ts-ignore
        props.__onChangeText(utils.formatter.formatCardNumber(cardNumber));

        props.onChange && props.onChange(e);
        onChange && onChange(e);

        // Due to the card number formatting, the selection cursor will fall to the end of
        // the input field. Here, we want to reposition the cursor to the correct place.
        requestAnimationFrame(() => {
          if (document.activeElement !== cardNumberField.current) return;
          if (cardNumberField.current.value[cursorPosition - 1] === " ") {
            cursorPosition = cursorPosition + 1;
          }
          cardNumberField.current.setSelectionRange(
            cursorPosition,
            cursorPosition
          );
        });

        const cardNumberError = utils.validator.getCardNumberError(
          cardNumber,
          cardNumberValidator,
          { errorMessages }
        );
        if (!cardNumberError && autoFocus) {
          expiryDateField.current && expiryDateField.current.focus();
        }
        setInputError("cardNumber", cardNumberError);
        props.onError && props.onError(cardNumberError);
      };
    },
    [
      autoFocus,
      cardNumberValidator,
      errorMessages,
      onChange,
      setInputError,
      setInputTouched,
    ]
  );

  const handleFocusCardNumber = React.useCallback((props = {}) => {
    return (e) => {
      props.onFocus && props.onFocus(e);
      setFocused("cardNumber");
    };
  }, []);

  const handleKeyPressCardNumber = React.useCallback((props = {}) => {
    return (e) => {
      const formattedCardNumber = props.value || "";
      const cardNumber = formattedCardNumber.replace(/\s/g, "");

      props.onKeyPress && props.onKeyPress(e);

      if (e.nativeEvent.key !== utils.ENTER_KEY_CODE) {
        if (!utils.validator.isNumeric(e)) {
          e.preventDefault();
        }
        if (utils.validator.hasCardNumberReachedMaxLength(cardNumber)) {
          e.preventDefault();
        }
      }
    };
  }, []);

  const getCardNumberProps = React.useCallback(
    ({ refKey, onChangeText, value, ...extras } = {}) => {
      const { ...props } = {
        ...extras,
        __onChangeText: onChangeText,
        value: value || "",
      };
      return {
        "aria-label": "Card number",
        autoComplete: "cc-number",
        id: "cardNumber",
        name: "cardNumber",
        placeholder: "Card number",
        type: "tel",
        [refKey || "ref"]: cardNumberField,
        onBlur: handleBlurCardNumber(props),
        onChange: handleChangeCardNumber(props),
        onFocus: handleFocusCardNumber(props),
        onKeyPress: handleKeyPressCardNumber(props),
        selectTextOnFocus: true,
        ...props,
      };
    },
    [
      handleBlurCardNumber,
      handleChangeCardNumber,
      handleFocusCardNumber,
      handleKeyPressCardNumber,
    ]
  );
  /** ====== END: CARD NUMBER STUFF ====== */

  /** ====== START: EXPIRY DATE STUFF ====== */
  const handleBlurExpiryDate = React.useCallback(
    (props = {}) => {
      return (e) => {
        props.onBlur && props.onBlur(e);
        onBlur && onBlur(e);
        setFocused(undefined);
        setInputTouched("expiryDate", true);
      };
    },
    [onBlur, setInputTouched]
  );

  const handleChangeExpiryDate = React.useCallback(
    (props = {}) => {
      return (e) => {
        setInputTouched("expiryDate", false);

        const nextValue = utils.formatter.formatExpiry(e.nativeEvent.text);
        props.__onChangeText(nextValue);

        props.onChange && props.onChange(e);

        onChange && onChange(e);

        const expiryDateError = utils.validator.getExpiryDateError(
          nextValue,
          expiryValidator,
          {
            errorMessages,
          }
        );

        console.log("expiry error", expiryDateError);

        if (!expiryDateError && autoFocus) {
          cvcField.current && cvcField.current.focus();
        }
        setInputError("expiryDate", expiryDateError);
        props.onError && props.onError(expiryDateError);
      };
    },
    [
      autoFocus,
      errorMessages,
      expiryValidator,
      onChange,
      setInputError,
      setInputTouched,
    ]
  );

  const handleFocusExpiryDate = React.useCallback((props = {}) => {
    return (e) => {
      props.onFocus && props.onFocus(e);
      setFocused("expiryDate");
    };
  }, []);

  const handleKeyPressExpiryDate = React.useCallback((props = {}) => {
    return (e) => {
      const formattedExpiryDate = props.value || "";
      const expiryDate = formattedExpiryDate.replace(" / ", "");

      props.onKeyPress && props.onKeyPress(e);

      if (e.nativeEvent.key !== utils.ENTER_KEY_CODE) {
        if (!utils.validator.isNumeric(e)) {
          e.preventDefault();
        }
        if (expiryDate.length >= 4) {
          e.preventDefault();
        }
      }
    };
  }, []);

  const getExpiryDateProps = React.useCallback(
    ({ refKey, onChangeText, value, ...extras } = {}) => {
      const { ...props } = {
        ...extras,
        __onChangeText: onChangeText,
        value: value || "",
      };
      return {
        "aria-label": "Expiry date in format MM YY",
        autoComplete: "cc-exp",
        id: "expiryDate",
        name: "expiryDate",
        placeholder: "MM/YY",
        type: "tel",
        [refKey || "ref"]: expiryDateField,
        onBlur: handleBlurExpiryDate(props),
        onChange: handleChangeExpiryDate(props),
        onFocus: handleFocusExpiryDate(props),
        onKeyPress: handleKeyPressExpiryDate(props),
        selectTextOnFocus: true,
        ...props,
      };
    },
    [
      handleBlurExpiryDate,
      handleChangeExpiryDate,
      handleFocusExpiryDate,
      handleKeyPressExpiryDate,
    ]
  );
  /** ====== END: EXPIRY DATE STUFF ====== */

  /** ====== START: CVC STUFF ====== */
  const handleBlurCVC = React.useCallback(
    (props = {}) => {
      return (e) => {
        props.onBlur && props.onBlur(e);
        onBlur && onBlur(e);
        setFocused(undefined);
        setInputTouched("cvc", true);
      };
    },
    [onBlur, setInputTouched]
  );

  const handleChangeCVC = React.useCallback(
    (props = {}, { cardType } = {}) => {
      return (e) => {
        const cvc = e.nativeEvent.text;

        setInputTouched("cvc", false);

        props.onChange && props.onChange(e);
        onChange && onChange(e);
        props.__onChangeText(cvc);

        const cvcError = utils.validator.getCVCError(cvc, cvcValidator, {
          cardType,
          errorMessages,
        });
        if (!cvcError && autoFocus) {
          zipField.current && zipField.current.focus();
        }
        setInputError("cvc", cvcError);
        props.onError && props.onError(cvcError);
      };
    },
    [
      autoFocus,
      cvcValidator,
      errorMessages,
      onChange,
      setInputError,
      setInputTouched,
    ]
  );

  const handleFocusCVC = React.useCallback((props = {}) => {
    return (e) => {
      props.onFocus && props.onFocus(e);
      setFocused("cvc");
    };
  }, []);

  const handleKeyPressCVC = React.useCallback((props = {}, { cardType }) => {
    return (e) => {
      const formattedCVC = props.value || "";
      const cvc = formattedCVC.replace(" / ", "");

      props.onKeyPress && props.onKeyPress(e);

      if (e.nativeEvent.key !== utils.ENTER_KEY_CODE) {
        if (!utils.validator.isNumeric(e)) {
          e.preventDefault();
        }
        if (cardType && cvc.length >= cardType.code.length) {
          e.preventDefault();
        }
        if (cvc.length >= 4) {
          e.preventDefault();
        }
      }
    };
  }, []);

  const getCVCProps = React.useCallback(
    ({ refKey, onChangeText, value, ...extras } = {}) => {
      const { ...props } = {
        ...extras,
        __onChangeText: onChangeText,
        value: value || "",
      };
      return {
        "aria-label": "CVC",
        autoComplete: "cc-csc",
        id: "cvc",
        name: "cvc",
        placeholder: cardType ? cardType.code.name : "CVC",
        type: "tel",
        [refKey || "ref"]: cvcField,
        onBlur: handleBlurCVC(props),
        onChange: handleChangeCVC(props, { cardType }),
        onFocus: handleFocusCVC(props),
        onKeyPress: handleKeyPressCVC(props, { cardType }),
        selectTextOnFocus: true,
        ...props,
      };
    },
    [
      cardType,
      handleBlurCVC,
      handleChangeCVC,
      handleFocusCVC,
      handleKeyPressCVC,
    ]
  );
  /** ====== END: CVC STUFF ====== */

  /** ====== START: ZIP STUFF ====== */
  const handleBlurZIP = React.useCallback(
    (props = {}) => {
      return (e) => {
        props.onBlur && props.onBlur(e);
        onBlur && onBlur(e);
        setFocused(undefined);
        setInputTouched("zip", true);
      };
    },
    [onBlur, setInputTouched]
  );

  const handleChangeZIP = React.useCallback(
    (props = {}) => {
      return (e) => {
        const zip = e.nativeEvent.text;

        props.__onChangeText(zip);
        setInputTouched("zip", false);

        props.onChange && props.onChange(e);
        onChange && onChange(e);

        const zipError = utils.validator.getZIPError(zip, { errorMessages });
        setInputError("zip", zipError);
        props.onError && props.onError(zipError);
      };
    },
    [errorMessages, onChange, setInputError, setInputTouched]
  );

  const handleFocusZIP = React.useCallback((props = {}) => {
    return (e) => {
      props.onFocus && props.onFocus(e);
      setFocused("zip");
    };
  }, []);

  const handleKeyPressZIP = React.useCallback((props = {}) => {
    return (e) => {
      props.onKeyPress && props.onKeyPress(e);

      if (e.nativeEvent.key !== utils.ENTER_KEY_CODE) {
        if (!utils.validator.isNumeric(e)) {
          e.preventDefault();
        }
      }
    };
  }, []);

  const getZIPProps = React.useCallback(
    ({ refKey, onChangeText, value, ...extras } = {}) => {
      const { ...props } = {
        ...extras,
        __onChangeText: onChangeText,
        value: value || "",
      };
      return {
        autoComplete: "off",
        id: "zip",
        maxLength: "6",
        name: "zip",
        placeholder: "ZIP",
        type: "tel",
        [refKey || "ref"]: zipField,
        onBlur: handleBlurZIP(props),
        onChange: handleChangeZIP(props),
        onFocus: handleFocusZIP(props),
        onKeyPress: handleKeyPressZIP(props),
        selectTextOnFocus: true,
        ...props,
      };
    },
    [handleBlurZIP, handleChangeZIP, handleFocusZIP, handleKeyPressZIP]
  );
  /** ====== END: ZIP STUFF ====== */

  /** ====== START: CARD IMAGE STUFF ====== */
  const getCardImageProps = React.useCallback(
    (props = {}) => {
      const images = props.images || {};
      const children =
        images[cardType ? cardType.type : "placeholder"] || images.placeholder;
      return {
        "aria-label": cardType ? cardType.displayName : "Placeholder card",
        children,
        width: "1.5em",
        height: "1em",
        viewBox: "0 0 24 16",
        ...props,
      };
    },
    [cardType]
  );
  /** ====== END: CARD IMAGE STUFF ====== */

//  // Set default field errors
//  React.useLayoutEffect(() => {
//    if (zipField.current) {
//      const zipError = utils.validator.getZIPError(
//        zipField.current.props.value,
//        { errorMessages }
//      );
//      setInputError("zip", zipError);
//    }
//    if (cvcField.current) {
//      const cvcError = utils.validator.getCVCError(
//        cvcField.current.props.value,
//        cvcValidator,
//        { errorMessages }
//      );
//      setInputError("cvc", cvcError);
//    }
//    if (expiryDateField.current) {
//      const expiryDateError = utils.validator.getExpiryDateError(
//        expiryDateField.current.props.value,
//        expiryValidator,
//        {
//          errorMessages,
//        }
//      );
//      setInputError("expiryDate", expiryDateError);
//    }
//    if (cardNumberField.current) {
//      const cardNumberError = utils.validator.getCardNumberError(
//        cardNumberField.current.props.value,
//        cardNumberValidator,
//        {
//          errorMessages,
//        }
//      );
//      setInputError("cardNumber", cardNumberError);
//    }
//  }, [
//    cardNumberValidator,
//    cvcValidator,
//    errorMessages,
//    expiryValidator,
//    setInputError,
//  ]);
//
//  // Format default values
//  React.useLayoutEffect(() => {
//    if (cardNumberField.current) {
//      cardNumberField.current.props.__onChangeText(
//        utils.formatter.formatCardNumber(cardNumberField.current.props.value)
//      );
//    }
//    if (expiryDateField.current) {
//      expiryDateField.current.props.__onChangeText(
//        utils.formatter.formatExpiry(expiryDateField.current.props.value)
//      );
//    }
//  }, []);
//
//  // Set default card type
//  React.useLayoutEffect(() => {
//    if (cardNumberField.current) {
//      const cardType = utils.cardTypes.getCardTypeByValue(
//        cardNumberField.current.value
//      );
//      setCardType(cardType);
//    }
//  }, []);

  return {
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getZIPProps,
    wrapperProps: {
      error,
      focused,
      isTouched,
    },

    meta: {
      cardType,
      erroredInputs,
      error,
      focused,
      isTouched,
      touchedInputs,
    },
  };
}
