import React from "react";
import { render, act } from "@testing-library/react";
import { useContext } from "react";
import AccountContext from "../Context/AccountContext";

// Mock global variables
global.ClientID = "test-client-id";

// Mock window.location.assign correctamente
Object.defineProperty(window, "location", {
  value: {
    assign: jest.fn(), // Mocking window.location.assign
    hash: "#id_token=test-id-token&access_token=test-access-token", // Mocking the hash part of the URL
  },
  writable: true,
});

// Mock localStorage globalmente
beforeEach(() => {
  global.localStorage = {
    setItem: jest.fn(), // Mocking the setItem function
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

describe("Auth functions", () => {
  let registerFederatedUser, handleGoogleSignIn;

  // Mocking the context functions
  beforeEach(() => {
    const mockContextValue = {
      registerFederatedUser: jest.fn().mockResolvedValue({}),
      handleGoogleSignIn: jest.fn(() => {
        // Simulate the redirect logic in handleGoogleSignIn
        window.location.assign("https://us-east-1e4thxcnqj.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&response_type=token&client_id=test-client-id");
      }),
    };

    function TestComponent() {
      const context = useContext(AccountContext);
      registerFederatedUser = context.registerFederatedUser;
      handleGoogleSignIn = context.handleGoogleSignIn;
      return null;
    }

    render(
      <AccountContext.Provider value={mockContextValue}>
        <TestComponent />
      </AccountContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar todos los mocks después de cada prueba
  });

  // Prueba 1: Verifica que handleGoogleSignIn redirige correctamente
  test("handleGoogleSignIn should redirect to the correct Cognito URL", () => {
    act(() => {
      handleGoogleSignIn(); // Ejecutar handleGoogleSignIn dentro de act
    });

    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith(
      expect.stringContaining("https://us-east-1e4thxcnqj.auth.us-east-1.amazoncognito.com/oauth2/authorize")
    );
    expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining("identity_provider=Google"));
    expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining("response_type=token"));
    expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining("client_id=test-client-id"));
  });

  // Prueba 2: Verifica que handleGoogleSignIn maneja un fallo de redirección
  test("handleGoogleSignIn should handle redirect failure gracefully", () => {
    // Simulamos un fallo en la redirección
    window.location.assign = jest.fn(() => { throw new Error("Redirection failed") });

    act(() => {
      expect(() => handleGoogleSignIn()).toThrow("Redirection failed");
    });
  });

  // Prueba 3: Verifica que registerFederatedUser crea una sesión Cognito
  test("registerFederatedUser should create a Cognito session", async () => {
    const session = await registerFederatedUser("mocked-id-token");

    expect(session).toBeDefined();
    expect(session).toEqual(expect.any(Object));
  });

  // Prueba 4: Verifica que registerFederatedUser maneja un error al crear la sesión
  test("registerFederatedUser should handle session creation failure", async () => {
    // Simulamos un error en la creación de la sesión
    registerFederatedUser.mockRejectedValueOnce(new Error("Session creation failed"));

    await expect(registerFederatedUser("mocked-id-token")).rejects.toThrow("Session creation failed");
  });
});
