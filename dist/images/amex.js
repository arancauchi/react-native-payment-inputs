"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.G, {
  fill: "none",
  fillRule: "evenodd"
}, /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Rect, {
  fill: "#016fd0",
  height: "16",
  rx: "2",
  width: "24"
}), /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Path, {
  d: "m13.7640663 13.3938564v-5.70139231l10.1475359.00910497v1.57489503l-1.1728619 1.25339231 1.1728619 1.2648839v1.6083094h-1.8726188l-.9951823-1.0981657-.9881105 1.1023204z",
  fill: "#fffffe"
}), /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Path, {
  d: "m14.4418122 12.7687956v-4.448884h3.7722872v1.02488398h-2.550895v.69569062h2.4900774v1.0078232h-2.4900774v.6833149h2.550895v1.0371713z",
  fill: "#016fd0"
}), /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Path, {
  d: "m18.1952707 12.7687956 2.087337-2.2270055-2.0874254-2.2217901h1.6156464l1.2754917 1.41003315 1.2791161-1.41003315h1.5461657v.03500552l-2.0428729 2.18678458 2.0428729 2.1638895v.063116h-1.5617237l-1.2981216-1.4241768-1.2847735 1.4241768z",
  fill: "#016fd0"
}), /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Path, {
  d: "m14.2373481 2.6319558h2.4460552l.8591381 1.95085083v-1.95085083h3.0198453l.5207514 1.46156906.5225194-1.46156906h2.3059447v5.70139227h-12.1865193z",
  fill: "#fffffe"
}), /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.G, {
  fill: "#016fd0"
}, /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Path, {
  d: "m14.7004641 3.25135912-1.9740111 4.44517127h1.3539006l.3724199-.89016575h2.0179447l.3721547.89016575h1.3875801l-1.96579-4.44517127zm.1696353 2.55743646.592-1.41507182.5915581 1.41507182z"
}), /*#__PURE__*/_react["default"].createElement(_reactNativeSvg.Path, {
  d: "m18.2119779 7.69573481v-4.44508288l1.903116.00654144.9792707 2.73272928.9856354-2.73927072h1.8316022v4.44508288l-1.1786077.01043094v-3.05334807l-1.1125746 3.04291713h-1.0758011l-1.1356464-3.05334807v3.05334807z"
})));

exports["default"] = _default;