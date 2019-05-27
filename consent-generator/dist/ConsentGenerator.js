"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactJsonPretty = _interopRequireDefault(require("react-json-pretty"));

var _lodash = _interopRequireDefault(require("lodash"));

var _reactstrap = require("reactstrap");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _axios = _interopRequireDefault(require("axios"));

var _classnames = _interopRequireDefault(require("classnames"));

require("./ConsentGenerator.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConsentGenerator =
/*#__PURE__*/
function (_Component) {
  _inherits(ConsentGenerator, _Component);

  function ConsentGenerator(props) {
    var _this2;

    _classCallCheck(this, ConsentGenerator);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ConsentGenerator).call(this, props));
    _this2.state = {
      formData: _this2.props.formData ? _this2.props.formData : {},
      cleanFormData: {},
      algorithmTab: '1',
      privateKey: ''
    };
    _this2.generateJwtRS256 = _this2.generateJwtRS256.bind(_assertThisInitialized(_this2));
    _this2.decodeJwt = _this2.decodeJwt.bind(_assertThisInitialized(_this2));
    _this2.verifyJwtRS256 = _this2.verifyJwtRS256.bind(_assertThisInitialized(_this2));
    _this2.onClean = _this2.onClean.bind(_assertThisInitialized(_this2));
    console.log(_this2.props);
    console.log(props);
    return _this2;
  }

  _createClass(ConsentGenerator, [{
    key: "onClean",
    value: function onClean(obj) {
      var _this = this;

      Object.keys(obj).forEach(function (key) {
        if (obj[key] && _typeof(obj[key]) === 'object') _this.onClean(obj[key]);else if (obj[key] == null) delete obj[key];
      });
      console.log(obj);
      _this.state.cleanFormData = obj;

      _this.forceUpdate();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps, nextContext) {
      this.setState({
        formData: nextProps.formData
      });
    }
  }, {
    key: "generateJwtHS256",
    value: function generateJwtHS256() {
      var _this = this;

      _this.onClean(_this.state.formData);

      var jwtToken = _jsonwebtoken.default.sign(_this.state.cleanFormData, _this.state.secret);

      _this.setState({
        jwtToken: jwtToken,
        jwtTokenEncodedVisible: true
      });

      console.log(jwtToken);
    }
  }, {
    key: "generateJwtRS256",
    value: function generateJwtRS256() {
      var _this = this;

      _this.onClean(_this.state.formData);

      console.log("PRIVATE KEY: ", _this.state.privateKey);
      console.log(_this.state.cleanFormData);

      _axios.default.post('http://localhost:5000/api/v1/token', _this.state.cleanFormData, {
        headers: {}
      }).then(function (response) {
        // TODO: check response type
        console.log("RESPONSE", response);

        _this.setState({
          jwtToken: response.data.token
        });
      }).catch(function (error) {
        alert("Network error!");
        throw error;
      });
    }
  }, {
    key: "decodeJwt",
    value: function decodeJwt() {
      var _this = this;

      var decoded = _jsonwebtoken.default.decode(_this.state.jwtToken, {
        complete: true
      });

      _this.setState({
        jwtTokenDecodedVisible: true,
        jwtTokenDecoded: decoded
      });
    }
  }, {
    key: "verifyJwtRS256",
    value: function verifyJwtRS256() {
      var _this = this;

      console.log("_this.state.formData.publicKey ", _this.state.formData.publicKey);
      var verifyOptions = {
        issuer: 'issuer',
        subject: 'subject',
        audience: 'audience',
        expiresIn: "12h",
        algorithm: "RS256"
      };

      try {
        var legit = _jsonwebtoken.default.verify(_this.state.jwtToken, _this.state.formData.publicKey, verifyOptions);

        _this.setState({
          signature: legit
        });

        alert("Signature VALID!");
      } catch (e) {
        alert("Invalid signature!");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return _react.default.createElement("div", null, !_lodash.default.isEmpty(this.state.formData) && _react.default.createElement("div", null, _react.default.createElement("h5", {
        className: "mt-4"
      }, "Form Data"), _react.default.createElement(_reactJsonPretty.default, {
        className: "p-2 mt-3",
        json: this.state.formData,
        themeClassName: "json-pretty"
      }), !_lodash.default.isEmpty(_this.state.formData, true) && _react.default.createElement("div", null, _react.default.createElement("h5", {
        className: "mt-4"
      }, "Encode"), _react.default.createElement("a", {
        className: "btn btn-success text-white mt-3 mb-3",
        onClick: function onClick(e) {
          _this.generateJwtRS256();
        }
      }, _react.default.createElement("i", {
        className: "fas fa-certificate"
      }), " Encode JWT (RS256)"), _react.default.createElement("div", null, !_lodash.default.isEmpty(_this.state.jwtToken) && _react.default.createElement("div", null, _react.default.createElement("pre", {
        className: "p-4 mt-3 text-break bg-light"
      }, _this.state.jwtToken), _react.default.createElement("div", null, _react.default.createElement("a", {
        className: "btn btn-success text-white mt-3",
        onClick: function onClick(e) {
          _this.decodeJwt();
        }
      }, _react.default.createElement("i", {
        className: "fas fa-certificate"
      }), " Decode JWT"), _react.default.createElement("br", null))), _react.default.createElement("hr", null), !_lodash.default.isEmpty(_this.state.jwtTokenDecoded) && _react.default.createElement("div", null, _react.default.createElement("h5", {
        className: "mt-4"
      }, "Decode"), _react.default.createElement("div", null, _react.default.createElement(_reactJsonPretty.default, {
        className: "p-2 mt-3",
        json: this.state.jwtTokenDecoded,
        themeClassName: "json-pretty"
      })), _react.default.createElement("hr", null), _react.default.createElement("h5", {
        className: "mt-4"
      }, "Verify signature"), _react.default.createElement("div", {
        className: "form-group"
      }, _react.default.createElement("label", {
        htmlFor: "root_version"
      }, "RSA Public Key"), " ", _react.default.createElement("textarea", {
        className: "form-control d-block mb-3",
        placeholder: "insert private key",
        rows: 10,
        onChange: function onChange(e) {
          _this.state.formData.publicKey = e.target.value;

          _this.forceUpdate();
        },
        defaultValue: _this.state.formData.publicKey
      })), _react.default.createElement("a", {
        className: "btn btn-success text-white mt-3",
        onClick: function onClick(e) {
          _this.verifyJwtRS256();
        }
      }, _react.default.createElement("i", {
        className: "fas fa-certificate"
      }), " Verify Signature (RS256)"), !_lodash.default.isEmpty(_this.state.signature, true) && _react.default.createElement(_reactJsonPretty.default, {
        className: "p-2 mt-3",
        json: this.state.signature,
        themeClassName: "json-pretty"
      }))))), _lodash.default.isEmpty(this.state.formData) && _react.default.createElement("em", null, "Form data not available."));
    }
  }]);

  return ConsentGenerator;
}(_react.Component);

exports.default = ConsentGenerator;