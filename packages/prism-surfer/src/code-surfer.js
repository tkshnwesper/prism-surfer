import React from "react";
import Highlight from "react-syntax-highlighter";
import * as Scroller from "./scroller";
import { css } from "glamor";
import SelectedTokens from "./step-parser";
import PropTypes from "prop-types";

const selectedRules = css({
  opacity: 1,
  transition: "opacity 300ms"
});
const unselectedRules = css({
  opacity: 0.3,
  transition: "opacity 300ms"
});

const CodeSurfer = ({ code, step, lang, showNumbers, dark, monospace }) => {
  const selectedTokens = new SelectedTokens(step);

  return (
    <Highlight code={code} language={lang || "jsx"} style={dark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Scroller.Container
          type="pre"
          className={className}
          style={Object.assign({}, style, {
            background: null,
            fontFamily: monospace
          })}
        >
          <Scroller.Content type="code" style={{ fontFamily: monospace }}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {showNumbers && (
                  <span
                    className={
                      "token comment " +
                      (selectedTokens.isLineSelected(i)
                        ? selectedRules
                        : unselectedRules)
                    }
                    style={{ userSelect: "none" }}
                  >
                    {(i + 1 + ".").padStart(3)}{" "}
                  </span>
                )}
                {line.map((token, key) => (
                  <Scroller.Element
                    type="span"
                    {...getTokenProps({
                      token,
                      key,
                      selected: selectedTokens.isTokenSelected(i, key),
                      className: selectedTokens.isTokenSelected(i, key)
                        ? selectedRules
                        : unselectedRules
                    })}
                  />
                ))}
              </div>
            ))}
          </Scroller.Content>
        </Scroller.Container>
      )}
    </Highlight>
  );
};

CodeSurfer.propTypes = {
  /** The code you want to show */
  code: PropTypes.string.isRequired,
  /** The lines/tokens to highlight */
  step: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      lines: PropTypes.arrayOf(PropTypes.number),
      range: PropTypes.arrayOf(PropTypes.number),
      ranges: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      tokens: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number))
    })
  ]),
  /** Any language supported in [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/vendor/prism/includeLangs.js) */
  lang: PropTypes.string,
  /** Whether to show line numbers or not */
  showNumbers: PropTypes.bool,
  /** If you have a dark background set this prop to true (it will use the default dark theme) */
  dark: PropTypes.bool,
  /** Use a theme from react-prism-renderer */
  theme: PropTypes.object,
  /** Use your own font-family */
  monospace: PropTypes.string
};

CodeSurfer.defaultProps = {
  lang: "jsx",
  step: {}
};

export default CodeSurfer;
