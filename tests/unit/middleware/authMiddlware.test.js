const authMiddleware = require("../../../src/middleware/authMiddleware");
const { validateJSONToken } = require("../../../src/util/auth");

jest.mock("../../../src/util/auth", () => ({
  validateJSONToken: jest.fn(),
}));

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 403 if Authorization header is missing", () => {
    authMiddleware()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Token is required");
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalid-token";
    validateJSONToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware()(req, res, next);

    expect(validateJSONToken).toHaveBeenCalledWith("invalid-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Invalid token");
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach user to req if token is valid", () => {
    const decodedUser = { id: 1, name: "Test User" };
    req.headers.authorization = "Bearer valid-token";
    validateJSONToken.mockReturnValue(decodedUser);

    authMiddleware()(req, res, next);

    expect(validateJSONToken).toHaveBeenCalledWith("valid-token");
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
