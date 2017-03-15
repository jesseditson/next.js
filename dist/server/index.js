'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _url = require('url');

var _querystring = require('querystring');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _render = require('./render');

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _hotReloader = require('./hot-reloader');

var _hotReloader2 = _interopRequireDefault(_hotReloader);

var _resolve = require('./resolve');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _package = require('../../package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server = function () {
  function Server() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$dir = _ref.dir,
        dir = _ref$dir === undefined ? '.' : _ref$dir,
        _ref$dev = _ref.dev,
        dev = _ref$dev === undefined ? false : _ref$dev,
        _ref$staticMarkup = _ref.staticMarkup,
        staticMarkup = _ref$staticMarkup === undefined ? false : _ref$staticMarkup,
        _ref$quiet = _ref.quiet,
        quiet = _ref$quiet === undefined ? false : _ref$quiet;

    (0, _classCallCheck3.default)(this, Server);

    this.dir = (0, _path.resolve)(dir);
    this.dev = dev;
    this.quiet = quiet;
    this.router = new _router2.default();
    this.hotReloader = dev ? new _hotReloader2.default(this.dir, { quiet: quiet }) : null;
    this.http = null;
    this.config = (0, _config2.default)(this.dir);
    this.buildStats = !dev ? require((0, _path.join)(this.dir, '.next', 'build-stats.json')) : null;
    this.buildId = !dev ? this.readBuildId() : '-';
    this.renderOpts = {
      dev: dev,
      staticMarkup: staticMarkup,
      dir: this.dir,
      hotReloader: this.hotReloader,
      buildStats: this.buildStats,
      buildId: this.buildId
    };

    this.defineRoutes();
  }

  (0, _createClass3.default)(Server, [{
    key: 'getRequestHandler',
    value: function getRequestHandler() {
      var _this = this;

      return function (req, res, parsedUrl) {
        // Parse url if parsedUrl not provided
        if (!parsedUrl) {
          parsedUrl = (0, _url.parse)(req.url, true);
        }

        // Parse the querystring ourselves if the user doesn't handle querystring parsing
        if (typeof parsedUrl.query === 'string') {
          parsedUrl.query = (0, _querystring.parse)(parsedUrl.query);
        }

        return _this.run(req, res, parsedUrl).catch(function (err) {
          if (!_this.quiet) console.error(err);
          res.statusCode = 500;
          res.end(_http.STATUS_CODES[500]);
        });
      };
    }
  }, {
    key: 'prepare',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.hotReloader) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return this.hotReloader.start();

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function prepare() {
        return _ref2.apply(this, arguments);
      }

      return prepare;
    }()
  }, {
    key: 'close',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.hotReloader) {
                  _context2.next = 3;
                  break;
                }

                _context2.next = 3;
                return this.hotReloader.stop();

              case 3:
                if (!this.http) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return new _promise2.default(function (resolve, reject) {
                  _this2.http.close(function (err) {
                    if (err) return reject(err);
                    return resolve();
                  });
                });

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function close() {
        return _ref3.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: 'defineRoutes',
    value: function defineRoutes() {
      var _this3 = this;

      var routes = {
        '/_next-prefetcher.js': function () {
          var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    p = (0, _path.join)(__dirname, '../client/next-prefetcher-bundle.js');
                    _context3.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this3);
          }));

          return function _nextPrefetcherJs(_x2, _x3, _x4) {
            return _ref4.apply(this, arguments);
          };
        }(),

        '/_next/:hash/main.js': function () {
          var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _this3.handleBuildHash('main.js', params.hash, res);
                    p = (0, _path.join)(_this3.dir, '.next/main.js');
                    _context4.next = 4;
                    return _this3.serveStatic(req, res, p);

                  case 4:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this3);
          }));

          return function _nextHashMainJs(_x5, _x6, _x7) {
            return _ref5.apply(this, arguments);
          };
        }(),

        '/_next/:hash/commons.js': function () {
          var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _this3.handleBuildHash('commons.js', params.hash, res);
                    p = (0, _path.join)(_this3.dir, '.next/commons.js');
                    _context5.next = 4;
                    return _this3.serveStatic(req, res, p);

                  case 4:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, _this3);
          }));

          return function _nextHashCommonsJs(_x8, _x9, _x10) {
            return _ref6.apply(this, arguments);
          };
        }(),

        '/_next/:buildId/pages/:path*': function () {
          var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res, params) {
            var paths, pathname;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (_this3.handleBuildId(params.buildId, res)) {
                      _context6.next = 4;
                      break;
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.end((0, _stringify2.default)({ buildIdMismatch: true }));
                    return _context6.abrupt('return');

                  case 4:
                    paths = params.path || ['index'];
                    pathname = '/' + paths.join('/');
                    _context6.next = 8;
                    return _this3.renderJSON(req, res, pathname);

                  case 8:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this3);
          }));

          return function _nextBuildIdPagesPath(_x11, _x12, _x13) {
            return _ref7.apply(this, arguments);
          };
        }(),

        '/_next/:path+': function () {
          var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    p = _path.join.apply(undefined, [__dirname, '..', 'client'].concat((0, _toConsumableArray3.default)(params.path || [])));
                    _context7.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this3);
          }));

          return function _nextPath(_x14, _x15, _x16) {
            return _ref8.apply(this, arguments);
          };
        }(),

        '/static/:path+': function () {
          var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(req, res, params) {
            var p;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    p = _path.join.apply(undefined, [_this3.dir, 'static'].concat((0, _toConsumableArray3.default)(params.path || [])));
                    _context8.next = 3;
                    return _this3.serveStatic(req, res, p);

                  case 3:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this3);
          }));

          return function staticPath(_x17, _x18, _x19) {
            return _ref9.apply(this, arguments);
          };
        }(),

        '/:path*': function () {
          var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(req, res, params, parsedUrl) {
            var pathname, query;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    pathname = parsedUrl.pathname, query = parsedUrl.query;
                    _context9.next = 3;
                    return _this3.render(req, res, pathname, query);

                  case 3:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this3);
          }));

          return function path(_x20, _x21, _x22, _x23) {
            return _ref10.apply(this, arguments);
          };
        }()
      };

      var _arr = ['GET', 'HEAD'];
      for (var _i = 0; _i < _arr.length; _i++) {
        var method = _arr[_i];var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(routes)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            this.router.add(method, p, routes[p]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }, {
    key: 'start',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(port, hostname) {
        var _this4 = this;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.prepare();

              case 2:
                this.http = _http2.default.createServer(this.getRequestHandler());
                _context10.next = 5;
                return new _promise2.default(function (resolve, reject) {
                  // This code catches EADDRINUSE error if the port is already in use
                  _this4.http.on('error', reject);
                  _this4.http.on('listening', function () {
                    return resolve();
                  });
                  _this4.http.listen(port, hostname);
                });

              case 5:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function start(_x24, _x25) {
        return _ref11.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(req, res, parsedUrl) {
        var fn;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!this.hotReloader) {
                  _context11.next = 3;
                  break;
                }

                _context11.next = 3;
                return this.hotReloader.run(req, res);

              case 3:
                fn = this.router.match(req, res, parsedUrl);

                if (!fn) {
                  _context11.next = 8;
                  break;
                }

                _context11.next = 7;
                return fn();

              case 7:
                return _context11.abrupt('return');

              case 8:
                if (!(req.method === 'GET' || req.method === 'HEAD')) {
                  _context11.next = 13;
                  break;
                }

                _context11.next = 11;
                return this.render404(req, res, parsedUrl);

              case 11:
                _context11.next = 15;
                break;

              case 13:
                res.statusCode = 501;
                res.end(_http.STATUS_CODES[501]);

              case 15:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function run(_x26, _x27, _x28) {
        return _ref12.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(req, res, pathname, query) {
        var html;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (this.config.poweredByHeader) {
                  res.setHeader('X-Powered-By', 'Next.js ' + _package2.default.version);
                }
                _context12.next = 3;
                return this.renderToHTML(req, res, pathname, query);

              case 3:
                html = _context12.sent;
                return _context12.abrupt('return', (0, _render.sendHTML)(res, html, req.method));

              case 5:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function render(_x29, _x30, _x31, _x32) {
        return _ref13.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: 'renderToHTML',
    value: function () {
      var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(req, res, pathname, query) {
        var compilationErr;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (!this.dev) {
                  _context13.next = 5;
                  break;
                }

                compilationErr = this.getCompilationError(pathname);

                if (!compilationErr) {
                  _context13.next = 5;
                  break;
                }

                res.statusCode = 500;
                return _context13.abrupt('return', this.renderErrorToHTML(compilationErr, req, res, pathname, query));

              case 5:
                _context13.prev = 5;
                _context13.next = 8;
                return (0, _render.renderToHTML)(req, res, pathname, query, this.renderOpts);

              case 8:
                return _context13.abrupt('return', _context13.sent);

              case 11:
                _context13.prev = 11;
                _context13.t0 = _context13['catch'](5);

                if (!(_context13.t0.code === 'ENOENT')) {
                  _context13.next = 18;
                  break;
                }

                res.statusCode = 404;
                return _context13.abrupt('return', this.renderErrorToHTML(null, req, res, pathname, query));

              case 18:
                if (!this.quiet) console.error(_context13.t0);
                res.statusCode = 500;
                return _context13.abrupt('return', this.renderErrorToHTML(_context13.t0, req, res, pathname, query));

              case 21:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[5, 11]]);
      }));

      function renderToHTML(_x33, _x34, _x35, _x36) {
        return _ref14.apply(this, arguments);
      }

      return renderToHTML;
    }()
  }, {
    key: 'renderError',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(err, req, res, pathname, query) {
        var html;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.renderErrorToHTML(err, req, res, pathname, query);

              case 2:
                html = _context14.sent;
                return _context14.abrupt('return', (0, _render.sendHTML)(res, html, req.method));

              case 4:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function renderError(_x37, _x38, _x39, _x40, _x41) {
        return _ref15.apply(this, arguments);
      }

      return renderError;
    }()
  }, {
    key: 'renderErrorToHTML',
    value: function () {
      var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(err, req, res, pathname, query) {
        var compilationErr;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!this.dev) {
                  _context15.next = 5;
                  break;
                }

                compilationErr = this.getCompilationError('/_error');

                if (!compilationErr) {
                  _context15.next = 5;
                  break;
                }

                res.statusCode = 500;
                return _context15.abrupt('return', (0, _render.renderErrorToHTML)(compilationErr, req, res, pathname, query, this.renderOpts));

              case 5:
                _context15.prev = 5;
                _context15.next = 8;
                return (0, _render.renderErrorToHTML)(err, req, res, pathname, query, this.renderOpts);

              case 8:
                return _context15.abrupt('return', _context15.sent);

              case 11:
                _context15.prev = 11;
                _context15.t0 = _context15['catch'](5);

                if (!this.dev) {
                  _context15.next = 19;
                  break;
                }

                if (!this.quiet) console.error(_context15.t0);
                res.statusCode = 500;
                return _context15.abrupt('return', (0, _render.renderErrorToHTML)(_context15.t0, req, res, pathname, query, this.renderOpts));

              case 19:
                throw _context15.t0;

              case 20:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this, [[5, 11]]);
      }));

      function renderErrorToHTML(_x42, _x43, _x44, _x45, _x46) {
        return _ref16.apply(this, arguments);
      }

      return renderErrorToHTML;
    }()
  }, {
    key: 'render404',
    value: function () {
      var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(req, res) {
        var parsedUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _url.parse)(req.url, true);
        var pathname, query;
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                pathname = parsedUrl.pathname, query = parsedUrl.query;

                res.statusCode = 404;
                return _context16.abrupt('return', this.renderError(null, req, res, pathname, query));

              case 3:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function render404(_x47, _x48) {
        return _ref17.apply(this, arguments);
      }

      return render404;
    }()
  }, {
    key: 'renderJSON',
    value: function () {
      var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(req, res, page) {
        var compilationErr;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (!this.dev) {
                  _context17.next = 4;
                  break;
                }

                compilationErr = this.getCompilationError(page);

                if (!compilationErr) {
                  _context17.next = 4;
                  break;
                }

                return _context17.abrupt('return', this.renderErrorJSON(compilationErr, req, res));

              case 4:
                _context17.prev = 4;
                _context17.next = 7;
                return (0, _render.renderJSON)(req, res, page, this.renderOpts);

              case 7:
                return _context17.abrupt('return', _context17.sent);

              case 10:
                _context17.prev = 10;
                _context17.t0 = _context17['catch'](4);

                if (!(_context17.t0.code === 'ENOENT')) {
                  _context17.next = 17;
                  break;
                }

                res.statusCode = 404;
                return _context17.abrupt('return', this.renderErrorJSON(null, req, res));

              case 17:
                if (!this.quiet) console.error(_context17.t0);
                res.statusCode = 500;
                return _context17.abrupt('return', this.renderErrorJSON(_context17.t0, req, res));

              case 20:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this, [[4, 10]]);
      }));

      function renderJSON(_x50, _x51, _x52) {
        return _ref18.apply(this, arguments);
      }

      return renderJSON;
    }()
  }, {
    key: 'renderErrorJSON',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(err, req, res) {
        var compilationErr;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (!this.dev) {
                  _context18.next = 5;
                  break;
                }

                compilationErr = this.getCompilationError('/_error');

                if (!compilationErr) {
                  _context18.next = 5;
                  break;
                }

                res.statusCode = 500;
                return _context18.abrupt('return', (0, _render.renderErrorJSON)(compilationErr, req, res, this.renderOpts));

              case 5:
                return _context18.abrupt('return', (0, _render.renderErrorJSON)(err, req, res, this.renderOpts));

              case 6:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function renderErrorJSON(_x53, _x54, _x55) {
        return _ref19.apply(this, arguments);
      }

      return renderErrorJSON;
    }()
  }, {
    key: 'serveStatic',
    value: function () {
      var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(req, res, path) {
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                _context19.next = 3;
                return (0, _render.serveStatic)(req, res, path);

              case 3:
                return _context19.abrupt('return', _context19.sent);

              case 6:
                _context19.prev = 6;
                _context19.t0 = _context19['catch'](0);

                if (!(_context19.t0.code === 'ENOENT')) {
                  _context19.next = 12;
                  break;
                }

                this.render404(req, res);
                _context19.next = 13;
                break;

              case 12:
                throw _context19.t0;

              case 13:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this, [[0, 6]]);
      }));

      function serveStatic(_x56, _x57, _x58) {
        return _ref20.apply(this, arguments);
      }

      return serveStatic;
    }()
  }, {
    key: 'readBuildId',
    value: function readBuildId() {
      var buildIdPath = (0, _path.join)(this.dir, '.next', 'BUILD_ID');
      var buildId = _fs2.default.readFileSync(buildIdPath, 'utf8');
      return buildId.trim();
    }
  }, {
    key: 'handleBuildId',
    value: function handleBuildId(buildId, res) {
      if (this.dev) return true;
      if (buildId !== this.renderOpts.buildId) {
        return false;
      }

      res.setHeader('Cache-Control', 'max-age=365000000, immutable');
      return true;
    }
  }, {
    key: 'getCompilationError',
    value: function getCompilationError(page) {
      if (!this.hotReloader) return;

      var errors = this.hotReloader.getCompilationErrors();
      if (!errors.size) return;

      var id = (0, _path.join)(this.dir, '.next', 'bundles', 'pages', page);
      var p = (0, _resolve.resolveFromList)(id, errors.keys());
      if (p) return errors.get(p)[0];
    }
  }, {
    key: 'handleBuildHash',
    value: function handleBuildHash(filename, hash, res) {
      if (this.dev) return;
      if (hash !== this.buildStats[filename].hash) {
        throw new Error('Invalid Build File Hash(' + hash + ') for chunk: ' + filename);
      }

      res.setHeader('Cache-Control', 'max-age=365000000, immutable');
    }
  }]);
  return Server;
}();
// We need to go up one more level since we are in the `dist` directory


exports.default = Server;